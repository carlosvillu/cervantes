import {Image} from '../statics/Models/Image.js'
import {UploadImageResult} from '../statics/Models/UploadImageResult.js'

export interface Uploader {
  image: (file: Image) => Promise<UploadImageResult>
}
