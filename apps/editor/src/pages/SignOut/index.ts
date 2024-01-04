import {redirect} from 'react-router-dom'

export const loader = async () => {
  const authTokens = await window.domain.LogoutAuthUseCase.execute()

  if (!authTokens.isEmpty()) throw new Error('Something was wrong with the Logout')
  return redirect('/')
}
