import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadImage(
    filePath: string,
  ): Promise<string> {
    const result =
      await cloudinary.uploader.upload(
        filePath,
        {
          folder: 'eventful-events',
        },
      );

    return result.secure_url;
  }
}