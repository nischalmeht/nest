import { Injectable } from '@nestjs/common';
import { UploadApiResponse } from 'cloudinary';
import { CloudinaryService } from './cloudinary/cloudinary.service';

@Injectable()
export class FileUploadService {
  constructor(private readonly cloudinary: CloudinaryService) {}

  async upload(file: { buffer: Buffer }): Promise<UploadApiResponse> {
    return this.cloudinary.uploadFile(file);
  }

  async delete(publicId: string): Promise<any> {
    return this.cloudinary.deleteFile(publicId);
  }
}
