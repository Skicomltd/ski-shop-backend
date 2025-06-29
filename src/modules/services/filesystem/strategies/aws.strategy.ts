import * as fs from "fs"
import { Inject, Injectable } from "@nestjs/common"
import { DeleteObjectCommand, GetObjectCommand, ObjectCannedACL, PutObjectCommand, S3Client } from "@aws-sdk/client-s3"

import { ApiException } from "@/exceptions/api.exception"
import { FileSystemModuleOptions, S3Options } from "../interfaces/config.interface"
import { FileMetada, FileUploadDto, IFileSystemService } from "../interfaces/filesystem.interface"
import { CONFIG_OPTIONS } from "../entities/config"

@Injectable()
export class S3Strategy implements IFileSystemService {
  private config: S3Options
  private client: S3Client
  private endpoint: string

  constructor(@Inject(CONFIG_OPTIONS) protected fsOptions: FileSystemModuleOptions) {
    this.config = fsOptions.clients.s3
    this.client = new S3Client({
      credentials: {
        accessKeyId: this.config.key,
        secretAccessKey: this.config.secret
      },
      endpoint: `https://${fsOptions.clients.s3.bucket}.s3.${fsOptions.clients.s3.region}.amazonaws.com`,
      region: fsOptions.clients.s3.region,
      forcePathStyle: true
    })

    this.endpoint = `https://${fsOptions.clients.s3.bucket}.s3.${fsOptions.clients.s3.region}.amazonaws.com`
  }

  async upload(file: FileUploadDto): Promise<string> {
    const error = this.checkConfig(this.config)
    if (error) throw new ApiException(error, 500)

    try {
      if (!file.filePath && !file.buffer) {
        throw new ApiException("valid file required", 500)
      }

      if (file.filePath && !fs.existsSync(file.filePath)) {
        throw new ApiException(`File does not exist at path: ${file.filePath}`, 500)
      }

      const fileStream = fs.createReadStream(file.filePath)
      const key = file.destination

      await this.client.send(
        new PutObjectCommand({
          Bucket: this.config.bucket,
          Key: key,
          Body: fileStream,
          ACL: "public-read" as ObjectCannedACL,
          ContentType: file.mimetype
        })
      )

      return `${this.endpoint}/${this.config.bucket}/${key}`
    } catch (error) {
      if (error.name === "NoSuchBucket") {
        throw new ApiException(`Bucket ${this.config.bucket} does not exist`, 500)
      }
      if (error.name === "AccessDenied") {
        throw new ApiException("Access denied to AWS. Check your credentials.", 500)
      }
      throw new ApiException(`Failed to upload file to AWS: ${error.message}`, 500)
    }
  }

  async get(path: string): Promise<Buffer> {
    const error = this.checkConfig(this.config)
    if (error) throw new ApiException(error, 500)

    const response = await this.client.send(
      new GetObjectCommand({
        Bucket: this.config.bucket,
        Key: path
      })
    )

    return Buffer.from(await response.Body.transformToByteArray())
  }

  async getMetaData(path: string): Promise<FileMetada> {
    const error = this.checkConfig(this.config)
    if (error) throw new ApiException(error, 500)

    const response = await this.client.send(
      new GetObjectCommand({
        Bucket: this.config.bucket,
        Key: path
      })
    )

    return {
      name: path,
      mimeType: response.ContentType,
      size: response.ContentLength.toString(),
      lastModified: response.LastModified,
      url: path.replace(this.endpoint, "")
    }
  }

  async update(path: string, file: FileUploadDto): Promise<string> {
    const error = this.checkConfig(this.config)
    if (error) throw new ApiException(error, 500)

    await this.delete(path)
    return this.upload(file)
  }

  async delete(path: string): Promise<void> {
    const error = this.checkConfig(this.config)
    if (error) throw new ApiException(error, 500)

    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.config.bucket,
        Key: path
      })
    )
  }

  private checkConfig(options: S3Options) {
    if (!options.driver) {
      return "Invalid driver"
    }

    if (!options.bucket) {
      return "No storage bucket"
    }

    if (!options.region) {
      return "Region not specified"
    }

    if (!options.secret || !options.key) {
      return "Invalid credentials"
    }

    return ""
  }
}
