import {FC, useReducer} from 'react'
import {ActionFunctionArgs, Form, Link, LoaderFunctionArgs} from 'react-router-dom'

import logoURL from '../../statics/logobandwhite.png'
import {SubmitButton} from '../../ui/SubmitButton'

export const loader = ({params}: LoaderFunctionArgs) => {
  const {tokenID} = params as {tokenID: string}

  debugger
  return null
}

export const action = ({request}: ActionFunctionArgs) => {
  return null
}

const STATE_INIT = {first: '', second: '', third: '', fourth: '', fifth: '', sixth: ''}
enum ActionKind {
  COPY = 'COPY'
}
interface Action {
  type: ActionKind
  payload: {code: string}
}
interface State {
  first: string
  second: string
  third: string
  fourth: string
  fifth: string
  sixth: string
}

const reducer = (state: State, action: Action) => {
  try {
    if (action.type !== ActionKind.COPY) return state
    if (action.payload.code.length !== 6) return state

    const code = parseInt(action.payload.code, 10)
    if (Number.isNaN(code)) return state

    const [first, second, third, fourth, fifth, sixth] = action.payload.code.split('')
    return {first, second, third, fourth, fifth, sixth}
  } catch (error) {
    return state
  }
}

export const Component: FC<{}> = () => {
  const [state, dispatch] = useReducer(reducer, STATE_INIT)
  const code = Object.values(state).join('')

  return (
    <>
      <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
        <img className="mx-auto w-auto" style={{height: '230px'}} src={logoURL} alt="Your Company" />
        <div className="text-center">
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Please paste the code than we have send to your Email.
          </h1>
          <p className="mt-6 text-base leading-7 text-gray-600">Your code only will be valid for 5 minutes</p>

          <Form className="max-w-sm mx-auto" key={code} method="post">
            <input type="hidden" name="code" value={code} />
            <div className="flex my-5 space-x-2 rtl:space-x-reverse justify-around">
              <div>
                <label htmlFor="code-1" className="sr-only">
                  First code
                </label>
                <input
                  autoFocus
                  onPaste={evt => dispatch({type: ActionKind.COPY, payload: {code: evt.clipboardData.getData('Text')}})}
                  type="text"
                  maxLength={1}
                  id="code-1"
                  className="block w-9 h-9 py-3 text-sm font-extrabold text-center text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  required
                  defaultValue={state.first}
                />
              </div>
              <div>
                <label htmlFor="code-2" className="sr-only">
                  Second code
                </label>
                <input
                  onPaste={evt => dispatch({type: ActionKind.COPY, payload: {code: evt.clipboardData.getData('Text')}})}
                  type="text"
                  maxLength={1}
                  id="code-2"
                  className="block w-9 h-9 py-3 text-sm font-extrabold text-center text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 "
                  required
                  defaultValue={state.second}
                />
              </div>
              <div>
                <label htmlFor="code-3" className="sr-only">
                  Third code
                </label>
                <input
                  onPaste={evt => dispatch({type: ActionKind.COPY, payload: {code: evt.clipboardData.getData('Text')}})}
                  type="text"
                  maxLength={1}
                  id="code-3"
                  className="block w-9 h-9 py-3 text-sm font-extrabold text-center text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 "
                  required
                  defaultValue={state.third}
                />
              </div>
              <div>
                <label htmlFor="code-4" className="sr-only">
                  Fourth code
                </label>
                <input
                  onPaste={evt => dispatch({type: ActionKind.COPY, payload: {code: evt.clipboardData.getData('Text')}})}
                  type="text"
                  maxLength={1}
                  id="code-4"
                  className="block w-9 h-9 py-3 text-sm font-extrabold text-center text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 "
                  required
                  defaultValue={state.fourth}
                />
              </div>
              <div>
                <label htmlFor="code-5" className="sr-only">
                  Fivth code
                </label>
                <input
                  onPaste={evt => dispatch({type: ActionKind.COPY, payload: {code: evt.clipboardData.getData('Text')}})}
                  type="text"
                  maxLength={1}
                  id="code-5"
                  className="block w-9 h-9 py-3 text-sm font-extrabold text-center text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 "
                  required
                  defaultValue={state.fifth}
                />
              </div>
              <div>
                <label htmlFor="code-6" className="sr-only">
                  Sixth code
                </label>
                <input
                  onPaste={evt => dispatch({type: ActionKind.COPY, payload: {code: evt.clipboardData.getData('Text')}})}
                  type="text"
                  maxLength={1}
                  id="code-6"
                  className="block w-9 h-9 py-3 text-sm font-extrabold text-center text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 "
                  required
                  defaultValue={state.sixth}
                />
              </div>
            </div>
            <p id="helper-text-explanation" className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              remaining time XXX
            </p>

            <div className="mt-10 flex items-center justify-center gap-x-6">
              <SubmitButton
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                label="Validate code"
              />

              <Link to="/" className="text-sm font-semibold text-gray-900">
                Go to homepage <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </Form>
        </div>
      </main>
    </>
  )
}
