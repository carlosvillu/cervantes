import {ActionFunctionArgs, redirect} from 'react-router-dom'

// @ts-expect-error
import {deleteContact} from '../contacts'

export async function action({params}: ActionFunctionArgs) {
  await deleteContact(params.contactId)
  return redirect('/')
}
