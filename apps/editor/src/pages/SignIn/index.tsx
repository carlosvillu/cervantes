import {type FC, useState} from 'react'
import {ActionFunctionArgs, Form, Link, redirect, useActionData} from 'react-router-dom'

import debug from 'debug'

import {DomainError} from '../../domain/_kernel/DomainError'
import {ErrorCodes} from '../../domain/_kernel/ErrorCodes'
import {User} from '../../domain/user/Models/User'
import logoURL from '../../statics/logobandwhite.png'
import {SubmitButton} from '../../ui/SubmitButton'

const log = debug('cervantes:editor:pages:SignIn')

export const loader = async () => {
  const currentUser = await window.domain.CurrentUserUseCase.execute()

  if (currentUser instanceof DomainError && currentUser.has(ErrorCodes.USER_LOGIN_NOT_VERIFIED)) {
    return redirect('/no-verified-user')
  }

  if (!(currentUser instanceof User)) throw new Error('Unexpecter Error')

  if (!currentUser.isEmpty()) {
    log('There is an user already on the Page.')
    return redirect('/')
  }

  return null
}

export const action = async ({request}: ActionFunctionArgs) => {
  const {email, password} = Object.fromEntries(await request.formData()) as {email: string; password: string}
  const authTokens = await window.domain.LoginAuthUseCase.execute({email, password})

  if (authTokens.isEmpty()) return {success: false}
  return redirect('/')
}

export const Component: FC<{}> = () => {
  const [passwordHidden, setPasswordHidden] = useState<boolean>(true)
  const {success} = (useActionData() ?? {}) as {success?: boolean}

  const loginFailed = success === false

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img className="mx-auto w-auto" style={{height: '230px'}} src={logoURL} alt="Your Company" />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <Form className="space-y-6" method="POST">
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  placeholder="user@server.com"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="current-password" className="block text-sm font-medium leading-6 text-gray-900">
                  Password
                </label>
                <div className="text-sm">
                  <a
                    href="#"
                    onClick={() => setPasswordHidden(v => !v)}
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    {passwordHidden ? 'Show password' : 'Hide password'}
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="current-password"
                  name="password"
                  type={passwordHidden ? 'password' : 'text'}
                  autoComplete="current-password"
                  placeholder="Entry a new password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <SubmitButton
                label="Sign in"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              />
            </div>
          </Form>
          <p className="mt-5 text-center text-sm text-red-500" hidden={!loginFailed}>
            Email / Password incorrect
          </p>
          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?{' '}
            <Link to="/sign-up" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              Create a new account
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}
