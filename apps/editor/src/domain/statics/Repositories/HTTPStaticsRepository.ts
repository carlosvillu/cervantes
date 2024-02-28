import {z} from 'zod'

import {Config} from '../../_config'
import {Fetcher} from '../../_fetcher/Fetcher'
import {WindowFetcher} from '../../_fetcher/WindowFetcher'
import {ID} from '../../_kernel/ID'
import {Image} from '../Models/Image'
import {Key} from '../Models/Key'
import {Result} from '../Models/Result'
import {UploadImageResult} from '../Models/UploadImageResult'
import {StaticsRepository} from './StaticsRepository'

const UploadImageResponseSchema = z.object({
  id: z.string({required_error: 'id required'}),
  image: z.object({
    id: z.string({required_error: 'id required'}),
    name: z.string({required_error: 'name required'}),
    stage: z.string({required_error: 'mimetype required'})
  }),
  result: z.boolean({required_error: 'result require'}),
  key: z.string({required_error: 'key required'})
})
type UploadImageSchemaType = z.infer<typeof UploadImageResponseSchema>

export class HTTPStaticsRepository implements StaticsRepository {
  static create(config: Config) {
    return new HTTPStaticsRepository(config, WindowFetcher.create(config))
  }

  constructor(private readonly config: Config, private readonly fetcher: Fetcher) {}

  async uploadImage(image: Image): Promise<UploadImageResult> {
    const form = new FormData()
    form.append('image', image.value)

    const [error, resp] = await this.fetcher.post<UploadImageSchemaType>(
      this.config.get('API_HOST') + '/upload/image',
      {body: form},
      UploadImageResponseSchema
    )

    if (error) return UploadImageResult.empty()

    return UploadImageResult.create({
      id: ID.create({value: resp.id}),
      key: Key.create({value: resp.key}),
      result: Result.create({value: resp.result})
    })
  }
}
