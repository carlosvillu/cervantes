import {FC} from 'react'
import {useNavigation} from 'react-router-dom'

const SVGComponent: FC<{}> = props => (
  <svg
    width={22}
    height={22}
    viewBox="0 0 22 22"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    style={{fill: 'currentcolor'}}
    className="text-sm font-semibold"
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

export const SubmitButton: FC<{label: string; show?: boolean; className: string}> = ({
  label,
  show = false,
  className
}) => {
  const navigation = useNavigation()

  const showSpinner = show || navigation.state === 'submitting' || navigation.state === 'loading'

  return (
    <button type="submit" disabled={showSpinner} className={className}>
      {!showSpinner && label}
      {showSpinner && <SVGComponent />}
    </button>
  )
}
