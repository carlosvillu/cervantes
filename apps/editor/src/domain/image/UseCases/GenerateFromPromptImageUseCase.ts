import type {Config} from '../../_config/index.js'
import {UseCase} from '../../_kernel/architecture.js'
// import {Key} from '../Models/Key.ts'
import {ListKey} from '../Models/ListKey.ts'
import {Prompt} from '../Models/Prompt.ts'
import {HTTPImageRepository} from '../Repositories/HTTPImageRepository/index.js'
import type {ImageRepository} from '../Repositories/ImageRepository.js'

export interface GenerateFromPromptImageUseCaseInput {
  prompt: string
}

// const delay = async () => new Promise(res => window.setTimeout(res, 2000)) // eslint-disable-line

export class GenerateFromPromptImageUseCase implements UseCase<GenerateFromPromptImageUseCaseInput, ListKey> {
  static create({config}: {config: Config}) {
    return new GenerateFromPromptImageUseCase(HTTPImageRepository.create(config))
  }

  constructor(private readonly repository: ImageRepository) {}

  async execute({prompt}: GenerateFromPromptImageUseCaseInput): Promise<ListKey> {
    // await delay()
    // return ListKey.create({
    //   keys: [
    //     Key.create({value: 'development/01HS9RGVZHMDWKEXWZB2XCYQ3P.png'}),
    //     Key.create({value: 'development/01HS9RGVZHVY435711MKCDG740.png'})
    //   ]
    // })
    return this.repository.generateFromPrompt(Prompt.create({value: prompt}))
  }
}
