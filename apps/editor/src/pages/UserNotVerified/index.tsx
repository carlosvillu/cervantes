import {FC} from 'react'
import {ActionFunctionArgs, Form, Link, redirect} from 'react-router-dom'

import logoURL from '../../statics/logobandwhite.png'
import {SubmitButton} from '../../ui/SubmitButton'

export const action = async ({request}: ActionFunctionArgs) => {
  const validationToken = await window.domain.CreateValidationTokenAuthUseCase.execute()

  return redirect(`/verify-email/${validationToken.id as string}`)
}

export const Component: FC<{}> = () => {
  return (
    <>
      <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
        <img className="mx-auto w-auto" style={{height: '230px'}} src={logoURL} alt="Your Company" />
        <div className="text-center">
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            The user has not yet verified their email address.
          </h1>
          <p className="mt-6 text-base leading-7 text-gray-600">
            I'm sorry, but it is necessary for you to verify your email address. Please click the button below to
            request a verification code be sent to your email inbox.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Form method="post">
              <SubmitButton
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                label="Send Verification Code"
              />
            </Form>

            <Link to="/" className="text-sm font-semibold text-gray-900">
              Go to homepage <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
