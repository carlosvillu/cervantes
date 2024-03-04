import {Image} from '../Models/Image'
import {UploadImageResult} from '../Models/UploadImageResult'

export interface StaticsRepository {
  uploadImage: (image: Image) => Promise<UploadImageResult>
}
