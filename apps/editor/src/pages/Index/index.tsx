import {redirect} from 'react-router-dom'

import {DomainError} from '../../domain/_kernel/DomainError'
import {ErrorCodes} from '../../domain/_kernel/ErrorCodes'
import {FeedbackEmptyState} from '../../ui/FeedBackEmptyState'

export async function loader() {
  const currentUser = await window.domain.CurrentUserUseCase.execute()

  if (
    currentUser instanceof DomainError &&
    currentUser.errors.find(error => error.message === ErrorCodes.USER_LOGIN_NOT_VERIFIED)
  ) {
    return redirect('/no-verified-user')
  }

  return null
}

export function Component() {
  return (
    <div className="h-full flex justify-center items-center" style={{height: 'calc(-64px + 100vh)'}}>
      <FeedbackEmptyState />
    </div>
  )
}
