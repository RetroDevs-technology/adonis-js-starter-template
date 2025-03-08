import { v2 as cloudinary } from 'cloudinary'
import env from '#start/env'
import type { MultipartFile } from '@adonisjs/core/bodyparser'

cloudinary.config({
  cloud_name: env.get('CLOUDINARY_CLOUD_NAME'),
  api_key: env.get('CLOUDINARY_API_KEY'),
  api_secret: env.get('CLOUDINARY_API_SECRET'),
})

export default class CloudinaryService {
  static async upload(file: MultipartFile, publicId?: string) {
    if (!file.tmpPath) {
      throw new Error('File tmpPath is required')
    }

    const result = await cloudinary.uploader.upload(file.tmpPath, {
      public_id: publicId,
      resource_type: 'image',
    })

    return result.secure_url
  }

  static async getUrl(publicId: string) {
    const result = await cloudinary.url(publicId)

    return result
  }

  static async delete(publicId: string) {
    await cloudinary.uploader.destroy(publicId)
  }
}
