import {UseCase} from '../../_kernel/architecture.js'
import {ID} from '../../_kernel/ID.js'
import {Stage} from '../../_kernel/Stage.js'
import {S3Uploader} from '../../_uploader/S3Uploader.js'
import {Uploader} from '../../_uploader/Uploader.js'
import {Data} from '../Models/Data.js'
import {Image} from '../Models/Image.js'
import {MimeType} from '../Models/MimeType.js'
import {Name} from '../Models/Name.js'
import {UploadImageResult} from '../Models/UploadImageResult.js'

export interface UploadImageStaticsUseCaseInput {
  file: {name: string; data: Buffer; mimetype: string}
}

export class UploadImageStaticsUseCase implements UseCase<UploadImageStaticsUseCaseInput, UploadImageResult> {
  static create() {
    return new UploadImageStaticsUseCase(S3Uploader.create())
  }

  constructor(private readonly uploader: Uploader) {}

  async execute({file}: UploadImageStaticsUseCaseInput): Promise<UploadImageResult> {
    const image = Image.create({
      id: ID.random(),
      name: Name.create({value: file.name}),
      data: Data.create({value: file.data}),
      stage: Stage.create({value: process.env.STAGE}),
      mimetype: MimeType.create({value: file.mimetype})
    })

    const result = this.uploader.image(image)

    return result
  }
}
