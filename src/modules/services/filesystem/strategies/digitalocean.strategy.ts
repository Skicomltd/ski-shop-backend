import * as fs from "fs"
import { Inject, Injectable } from "@nestjs/common"
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client, ObjectCannedACL } from "@aws-sdk/client-s3"
import { FileMetada, FileUploadDto, IFileSystemService } from "../interfaces/filesystem.interface"
import { ApiException } from "@/exceptions/api.exception"
import { DOSpacesOptions, FileSystemModuleOptions } from "../interfaces/config.interface"
import { CONFIG_OPTIONS } from "../entities/config"

@Injectable()
export class DigitalOceanStrategy implements IFileSystemService {
  private config: DOSpacesOptions
  private client: S3Client
  private endpoint: string

  constructor(@Inject(CONFIG_OPTIONS) protected fsOptions: FileSystemModuleOptions) {
    this.config = fsOptions.clients.spaces

    this.endpoint = `https://${fsOptions.clients.spaces.bucket}.${fsOptions.clients.spaces.region}.digitaloceanspaces.com/${fsOptions.clients.spaces.bucket}`
    this.client = new S3Client({
      credentials: {
        accessKeyId: fsOptions.clients.spaces.key,
        secretAccessKey: fsOptions.clients.spaces.secret
      },
      endpoint: `https://${fsOptions.clients.spaces.bucket}.${fsOptions.clients.spaces.region}.digitaloceanspaces.com/${fsOptions.clients.spaces.bucket}`,
      region: fsOptions.clients.spaces.region,
      forcePathStyle: true
    })
  }

  async upload(file: FileUploadDto): Promise<string> {
    const error = this.checkConfig(this.config)
    if (error) throw new ApiException(error, 500)

    if (!file.filePath && !file.buffer) {
      throw new ApiException("valid file required", 500)
    }

    if (file.filePath && !fs.existsSync(file.filePath)) {
      throw new ApiException(`File does not exist at path: ${file.filePath}`, 500)
    }

    try {
      await this.client.send(
        new PutObjectCommand({
          Bucket: this.config.bucket,
          Key: file.destination,
          Body: file.buffer || fs.createReadStream(file.filePath),
          ContentType: file.mimetype,
          ACL: "public-read" as ObjectCannedACL
        })
      )

      return `${this.endpoint}/${file.destination}`
    } catch (error) {
      if (error.name === `NoSuchBucket`) {
        throw new ApiException(`No bucket`, 500)
      }
      if (error.name === "AccessDenied") {
        throw new ApiException(`Access denied`, 500)
      }
      throw new ApiException(error.message, 500)
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

  private checkConfig(options: DOSpacesOptions) {
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
