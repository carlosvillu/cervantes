import {ActionFunctionArgs, redirect} from 'react-router-dom'

export const action = async ({params}: ActionFunctionArgs) => {
  const {bookID} = params as {bookID: string}

  return redirect(`/book/${bookID}`)
}
