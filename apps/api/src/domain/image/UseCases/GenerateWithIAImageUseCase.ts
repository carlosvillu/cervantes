import {UseCase} from '../../_kernel/architecture.js'
import {ID} from '../../_kernel/ID.js'
import {ListURL} from '../Models/ListURL.js'
import {Prompt} from '../Models/Prompt.js'
import {HTTPImageRepository} from '../Repositories/HTTPImageRepository/index.js'
import {ImageRepository} from '../Repositories/ImageRepository.js'

export interface GenerateWithIAImageUseCaseInput {
  userID: string
  prompt: string
}

export class GenerateWithIAImageUseCase implements UseCase<GenerateWithIAImageUseCaseInput, ListURL> {
  static create() {
    return new GenerateWithIAImageUseCase(HTTPImageRepository.create())
  }

  constructor(private readonly repository: ImageRepository) {}

  async execute({userID, prompt}: GenerateWithIAImageUseCaseInput): Promise<ListURL> {
    return this.repository.generateimage(ID.create({value: userID}), Prompt.create({value: prompt}))
  }
}
