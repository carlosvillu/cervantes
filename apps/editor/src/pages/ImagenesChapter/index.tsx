import {FC, useCallback} from 'react'
import {LoaderFunctionArgs, useParams} from 'react-router-dom'

import {UploadImageResult} from '../../domain/statics/Models/UploadImageResult'
import {FormCreateOrDeleteCoverImage} from '../../ui/FormCreateOrDeleteCoverImage'

export const loader = async ({params}: LoaderFunctionArgs) => {
  const {bookID, chapterID} = params as {bookID: string; chapterID: string}

  const chaptercover = await window.domain.FindChapterCoverByChapterIDImageUseCase.execute({bookID, chapterID})

  return {imageURL: chaptercover.url()}
}

export const Component: FC<{}> = () => {
  const {bookID, chapterID} = useParams() as {bookID: string; chapterID: string}

  const handlerDelete = useCallback(() => {
    return window.domain.DeleteChapterCoverByChapterIDImageUseCase.execute({bookID, chapterID})
  }, [bookID, chapterID])

  const handlerCreate = useCallback(
    (imageUploaded: UploadImageResult) => {
      return window.domain.CreateChapterCoverImageUseCase.execute({bookID, chapterID, key: imageUploaded.key!})
    },
    [bookID, chapterID]
  )

  return (
    <FormCreateOrDeleteCoverImage title="Chapter Cover" handlerDelete={handlerDelete} handlerCreate={handlerCreate} />
  )
}
