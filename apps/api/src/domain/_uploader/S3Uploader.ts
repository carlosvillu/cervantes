import debug from 'debug'

import {S3Client} from '@aws-sdk/client-s3'
import {Upload} from '@aws-sdk/lib-storage'

import {ID} from '../_kernel/ID.js'
import {Image} from '../statics/Models/Image.js'
import {Result} from '../statics/Models/Result.js'
import {UploadImageResult} from '../statics/Models/UploadImageResult.js'
import {Uploader} from './Uploader.js'

const log = debug('cervantes:api:domain:s3uploader')
const S3 = new S3Client({region: 'auto', endpoint: `https://fly.storage.tigris.dev`})

export class S3Uploader implements Uploader {
  static BUCKET = 'cervantes-bucket'
  static create() {
    return new S3Uploader()
  }

  async image(image: Image): Promise<UploadImageResult> {
    try {
      const upload = new Upload({
        params: {
          Bucket: S3Uploader.BUCKET,
          Key: image.key(),
          Body: image.data,
          CacheControl: 'max-age=31536000',
          ContentType: image.mimetype
        },
        client: S3,
        queueSize: 3
      })

      upload.on('httpUploadProgress', progress => log(progress))

      await upload.done()

      return UploadImageResult.create({
        id: ID.random(),
        result: Result.success(),
        image: image.stripData()
      })
    } catch (error) {
      return UploadImageResult.create({
        id: ID.random(),
        result: Result.failed(),
        image: image.stripData(),
        cause: error as Error
      })
    }
  }
}
