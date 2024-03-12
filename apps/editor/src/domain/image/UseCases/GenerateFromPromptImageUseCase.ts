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
            'https://cdn.leonardo.ai/users/347d4213-ef52-4140-9d56-e456b4ba01d4/generations/12cbc9c1-6993-4072-8e19-6c0021582665/Default_Scifi_films_film_from_the_60s_full_body_visible_robot_1.jpg'
        }),
        ImageURL.create({
          value:
            'https://cdn.leonardo.ai/users/347d4213-ef52-4140-9d56-e456b4ba01d4/generations/12cbc9c1-6993-4072-8e19-6c0021582665/Default_Scifi_films_film_from_the_60s_full_body_visible_robot_0.jpg'
        })
      ]
    })
    // return this.repository.generateFromPrompt(Prompt.create({value: prompt}))
  }
}
