import type {Config} from '../../_config/index.js'
import {UseCase} from '../../_kernel/architecture.js'
import {Image} from '../Models/Image.js'
import {UploadImageResult} from '../Models/UploadImageResult.js'
import {HTTPStaticsRepository} from '../Repositories/HTTPStaticsRepository.js'
import type {StaticsRepository} from '../Repositories/StaticsRepository.js'

export interface UploadImageStaticsUseCaseInput {
  file: File
}

export class UploadImageStaticsUseCase implements UseCase<UploadImageStaticsUseCaseInput, UploadImageResult> {
  static create({config}: {config: Config}) {
    return new UploadImageStaticsUseCase(HTTPStaticsRepository.create(config))
  }

  constructor(private readonly repository: StaticsRepository) {}

  async execute({file}: UploadImageStaticsUseCaseInput): Promise<UploadImageResult> {
    return this.repository.uploadImage(Image.create({value: file}))
  }
}
