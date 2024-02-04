import {FC} from 'react'
import {useNavigation} from 'react-router-dom'

const SVGComponent: FC<{}> = props => (
  <svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    style={{fill: 'currentcolor'}}
  >
    <style>
      {
        '.spinner_S1WN{animation:spinner_MGfb .8s linear infinite;animation-delay:-.8s}.spinner_Km9P{animation-delay:-.65s}.spinner_JApP{animation-delay:-.5s}@keyframes spinner_MGfb{93.75%,100%{opacity:.2}}'
      }
    </style>
    <circle className="spinner_S1WN" cx={4} cy={12} r={3} />
    <circle className="spinner_S1WN spinner_Km9P" cx={12} cy={12} r={3} />
    <circle className="spinner_S1WN spinner_JApP" cx={20} cy={12} r={3} />
  </svg>
)

export const SubmitButton: FC<{label: string}> = ({label}) => {
  const navigation = useNavigation()

  const showSpinner = navigation.state === 'submitting' || navigation.state === 'loading'

  return (
    <button
      type="submit"
      disabled={showSpinner}
      className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    >
      {!showSpinner && label}
      {showSpinner && <SVGComponent />}
    </button>
  )
}
