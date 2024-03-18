import {Fetcher} from '../../../_fetcher/Fetcher.js'
import {NodeFetcher} from '../../../_fetcher/NodeFetcher.js'
import {ID} from '../../../_kernel/ID.js'
import {BookCover} from '../../Models/BookCover.js'
import {ChapterCover} from '../../Models/ChapterCover.js'
import {ListURL} from '../../Models/ListURL.js'
import {Prompt} from '../../Models/Prompt.js'
import {URL} from '../../Models/URL.js'
import {ImageRepository} from '../ImageRepository.js'
import {ImageGenerationBodySchema, ImageGenerationBodyType} from './schemas.js'

const {FOOOCUS_API_URL} = process.env

export class HTTPImageRepository implements ImageRepository {
  static create() {
    return new HTTPImageRepository(NodeFetcher.create())
  }

  constructor(private readonly fetcher: Fetcher) {}

  async generateimage(userID: ID, prompt: Prompt): Promise<ListURL> {
    const [error, resp] = await this.fetcher.post<ImageGenerationBodyType>(
      FOOOCUS_API_URL + '/v1/generation/text-to-image',
      {
        body: {
          prompt: prompt.value,
          negative_prompt: "team's shield",
          performance_selection: 'Extreme Speed',
          image_number: 2,
          aspect_ratios_selection: '1024*1024',
          style_selections: ['Fooocus V2', 'Fooocus Enhance', 'Fooocus Photograph', 'Fooocus Negative']
        }
      },
      // @ts-expect-error
      ImageGenerationBodySchema
    )

    if (error) return ListURL.empty()

    return ListURL.create({urls: resp.map(generation => URL.create({value: generation.url}))})
  }

  async createBookCover() {
    return BookCover.empty()
  }

  async createChapterCover() {
    return ChapterCover.empty()
  }

  async findBookCover() {
    return BookCover.empty()
  }

  async findChapterCover() {
    return ChapterCover.empty()
  }

  async deleteBookCover() {
    return BookCover.empty()
  }

  async deleteChapterCover() {
    return ChapterCover.empty()
  }
}
