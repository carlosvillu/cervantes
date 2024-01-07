import {Link, useRouteError} from 'react-router-dom'

const ErrorMessagesByHTTPCode: {[key: number]: {[key: string]: string}} = {
  406: {title: 'Forbidden user', subtitle: 'Please, login in your account'}
}

const UNKONW_ERROR = {
  title: 'Unkown error',
  subtitle: 'Sorry, but try a different page'
}

export function Component() {
  const error = useRouteError() as {status: number}
  const {title, subtitle} = ErrorMessagesByHTTPCode[error.status] ?? UNKONW_ERROR
  return (
    <>
      <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <p className="text-base font-semibold text-indigo-600">{error.status ?? 'Unkown code'}</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">{title}</h1>
          <p className="mt-6 text-base leading-7 text-gray-600">{subtitle}</p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              to="/"
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Go back home
            </Link>
            <Link to="/sign-in" className="text-sm font-semibold text-gray-900">
              Sign in page <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
