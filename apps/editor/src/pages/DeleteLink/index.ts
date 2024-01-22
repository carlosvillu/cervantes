import {ActionFunctionArgs, redirect} from 'react-router-dom'

export const action = async ({params}: ActionFunctionArgs) => {
  const {bookID, chapterID, linkID} = params as {bookID: string; chapterID: string; linkID: string}

  await window.domain.RemoveByIDLinkUseCase.execute({id: linkID})
  return redirect(`/book/${bookID}/chapter/${chapterID}`)
}
