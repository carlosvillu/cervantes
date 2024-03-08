import {FC, useCallback} from 'react'
import {LoaderFunctionArgs, useParams} from 'react-router-dom'

import {UploadImageResult} from '../../domain/statics/Models/UploadImageResult'
import {FormCreateOrDeleteCoverImage} from '../../ui/FormCreateOrDeleteCoverImage'

export const loader = async ({params}: LoaderFunctionArgs) => {
  const {bookID} = params as {bookID: string}

  const bookcover = await window.domain.FindBookCoverByBookIDImageUseCase.execute({bookID})

  return {imageURL: bookcover.url()}
}

export const Component: FC<{}> = () => {
  const {bookID} = useParams() as {bookID: string}

  const handlerDelete = useCallback(() => {
    return window.domain.DeleteBookCoverByBookIDImageUseCase.execute({bookID})
  }, [bookID])

  const handlerCreate = useCallback(
    (imageUploaded: UploadImageResult) => {
      return window.domain.CreateBookCoverImageUseCase.execute({bookID, key: imageUploaded.key!})
    },
    [bookID]
  )

  return <FormCreateOrDeleteCoverImage title="Book Cover" handlerDelete={handlerDelete} handlerCreate={handlerCreate} />
}
