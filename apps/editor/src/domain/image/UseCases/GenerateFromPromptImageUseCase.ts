import type {Config} from '../../_config/index.js'
import {UseCase} from '../../_kernel/architecture.js'
import {ImagesURLs} from '../Models/ImagesURLs.ts'
import {ImageURL} from '../Models/ImageURL.ts'
import {Prompt} from '../Models/Prompt.ts'
import {HTTPImageRepository} from '../Repositories/HTTPImageRepository/index.js'
import type {ImageRepository} from '../Repositories/ImageRepository.js'

export interface GenerateFromPromptImageUseCaseInput {
  prompt: string
}

export class GenerateFromPromptImageUseCase implements UseCase<GenerateFromPromptImageUseCaseInput, ImagesURLs> {
  static create({config}: {config: Config}) {
    return new GenerateFromPromptImageUseCase(HTTPImageRepository.create(config))
  }

  constructor(private readonly repository: ImageRepository) {}

  async execute({prompt}: GenerateFromPromptImageUseCaseInput): Promise<ImagesURLs> {
    return ImagesURLs.create({
      urls: [
        ImageURL.create({
          value:
            'https://cervantes.imglab-cdn.net/development/01HS1J14NBGY56R2AJ26V5WK0S.jpeg?height=430&aspect-ratio=1%3A1.5&mode=crop&format=webp'
        }),
        ImageURL.create({
          value:
            'https://cervantes.imglab-cdn.net/development/01HS1J26G5AZEHR9ESYE1PDTYM.jpeg?height=430&aspect-ratio=1%3A1.5&mode=crop&format=webp'
        })
      ]
    })
    // return this.repository.generateFromPrompt(Prompt.create({value: prompt}))
  }
}
