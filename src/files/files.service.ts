import { CloudinaryResponse } from '@cloudinary/cloudinary-response';
import { Injectable } from '@nestjs/common';

import { v2 as cloudinary } from 'cloudinary';

const streamifier = require('streamifier');

@Injectable()
export class FilesService {
  async uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse> {
    const filePath = new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });

    return await filePath;
  }
}
