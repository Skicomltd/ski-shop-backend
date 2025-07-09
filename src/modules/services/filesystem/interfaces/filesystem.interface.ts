export interface IFileSystemService {
  upload(file: FileUploadDto): Promise<string>
  get(path: string): Promise<Buffer>
  getMetaData(path: string): Promise<FileMetada>
  zipFolder(folderPath: string): Promise<Buffer>
  update(path: string, file: FileUploadDto): Promise<string>
  delete(path: string): Promise<void>
}

export interface FileUploadDto {
  buffer?: Buffer
  filePath?: string
  mimetype: string
  destination: string
}

export interface FileMetada {
  name: string
  size: string
  url: string
  mimeType: string
  lastModified: Date
}
