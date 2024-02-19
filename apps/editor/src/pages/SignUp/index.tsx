import {type FC, useState} from 'react'
import {ActionFunctionArgs, Form, Link, redirect, useActionData} from 'react-router-dom'

import {ulid} from 'ulid'

import {DomainError} from '../../domain/_kernel/DomainError'
import {ErrorCodes} from '../../domain/_kernel/ErrorCodes'
import logoURL from '../../statics/logobandwhite.png'
import {SubmitButton} from '../../ui/SubmitButton'

export const action = async ({request}: ActionFunctionArgs) => {
  const {id, username, email, password} = Object.fromEntries(await request.formData()) as {
    email: string
    password: string
    username: string
    id: string
  }

  const user = await window.domain.CreateUserUseCase.execute({id, email, username, password})

  if (user instanceof DomainError && user.errors.find(error => error.message === ErrorCodes.USER_LOGIN_NOT_VERIFIED))
    return redirect('/no-verified-user')

  if (user instanceof DomainError) throw user

  if (user.isEmpty()) return {success: false}
  return redirect('/')
}

export const Component: FC<{}> = () => {
  const [passwordHidden, setPasswordHidden] = useState<boolean>(true)
  const {success} = (useActionData() ?? {}) as {success?: boolean}

  const createdFailed = success === false

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img className="mx-auto w-auto" style={{height: '230px'}} src={logoURL} alt="Your Company" />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign up a new account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <Form className="space-y-6" method="POST">
            <input id="id" name="id" type="hidden" value={ulid()} />
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                User name
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  placeholder="Jhon Doe"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

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
                <label htmlFor="new-password" className="block text-sm font-medium leading-6 text-gray-900">
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
                  id="new-password"
                  name="password"
                  type={passwordHidden ? 'password' : 'text'}
                  autoComplete="new-password"
                  placeholder="Entry a new password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <SubmitButton
                label="Sign up"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              />
            </div>
          </Form>
          <p className="mt-5 text-center text-sm text-red-500" hidden={!createdFailed}>
            Something was wrong
          </p>
          <p className="mt-10 text-center text-sm text-gray-500">
            Are you a member?{' '}
            <Link to="/sign-in" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              Sign in to your account
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}
