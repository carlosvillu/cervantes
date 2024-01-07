import {FeedbackEmptyState} from '../../ui/FeedBackEmptyState'

export async function loader() {
  // throw new Response('Forbidden User', {status: 406}) // eslint-disable-line
  return null
}

export function Component() {
  return (
    <div className="h-full flex justify-center items-center">
      <FeedbackEmptyState />
    </div>
  )
}
