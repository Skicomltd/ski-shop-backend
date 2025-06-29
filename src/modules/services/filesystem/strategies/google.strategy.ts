import * as fs from "fs"
import { Inject, Injectable } from "@nestjs/common"
import { Storage, Bucket } from "@google-cloud/storage"
import { FileMetada, FileUploadDto, IFileSystemService } from "../interfaces/filesystem.interface"
import { ApiException } from "@/exceptions/api.exception"
import { CONFIG_OPTIONS } from "../entities/config"
import { FileSystemModuleOptions, GoogleStorageOptions } from "../interfaces/config.interface"

@Injectable()
export class GoogleStorageStrategy implements IFileSystemService {
  private storage: Storage
  private bucket: Bucket
  private bucketName: string
  private publicUrl?: string
  private config: GoogleStorageOptions

  constructor(@Inject(CONFIG_OPTIONS) protected readonly fsOptions: FileSystemModuleOptions) {
    const config = fsOptions.clients.google

    this.bucketName = config.bucket
    this.publicUrl = config.publicUrl

    this.storage = new Storage({
      projectId: config.projectId,
      keyFilename: config.keyFilename
    })

    if (this.bucketName) {
      this.bucket = this.storage.bucket(this.bucketName)
    }
  }

  async upload(file: FileUploadDto): Promise<string> {
    const error = this.checkConfig(this.config)
    if (error) throw new ApiException(error, 500)

    if (!file.filePath && !file.buffer) {
      throw new ApiException("No filePath or buffer provided", 400)
    }

    try {
      const destination = file.destination
      const blob = this.bucket.file(destination)

      const stream = blob.createWriteStream({
        metadata: {
          contentType: file.mimetype
        },
        resumable: false
      })

      return new Promise((resolve, reject) => {
        stream.on("error", (error) => {
          console.error("Google upload error:", error)
          reject(new ApiException(`Failed to upload file to Google`, 500))
        })

        stream.on("finish", async () => {
          await blob.makePublic()
          const publicUrl = this.publicUrl ? `${this.publicUrl}/${destination}` : `https://storage.googleapis.com/${this.bucketName}/${destination}`

          resolve(publicUrl)
        })

        if (file.buffer) {
          stream.end(file.buffer)
        } else {
          const readStream = fs.createReadStream(file.filePath)
          readStream.pipe(stream)
        }
      })
    } catch (error: any) {
      throw new ApiException(`Failed to upload to Google: ${error.message}`, 500)
    }
  }

  async get(path: string): Promise<Buffer> {
    const error = this.checkConfig(this.config)
    if (error) throw new ApiException(error, 500)

    try {
      const [fileContent] = await this.bucket.file(path).download()
      return fileContent
    } catch (error: any) {
      throw new ApiException(`Failed to download file from Google Storage: ${error.message}`, 500)
    }
  }

  async getMetaData(path: string): Promise<FileMetada> {
    const error = this.checkConfig(this.config)
    if (error) throw new ApiException(error, 500)

    const [metadata] = await this.bucket.file(path).getMetadata()

    return {
      name: metadata.name,
      size: metadata.size.toString() || "0",
      mimeType: metadata.contentType,
      url: this.publicUrl ? `${this.publicUrl}/${path}` : `https://storage.googleapis.com/${this.bucketName}/${path}`,
      lastModified: metadata.timeStorageClassUpdated ? new Date(metadata.timeStorageClassUpdated) : undefined
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

    try {
      await this.bucket.file(path).delete()
    } catch (error: any) {
      throw new ApiException(`Failed to delete file from Google Storage: ${error.message}`, 500)
    }
  }

  private checkConfig(options: GoogleStorageOptions): string {
    if (!options.driver) return "Invalid driver for Google Storage"
    if (!options.bucket) return "No Google storage bucket specified"
    if (!options.projectId) return "No Google project ID provided"
    if (!options.keyFilename) return "No Google credentials key file path provided"
    return ""
  }
}
