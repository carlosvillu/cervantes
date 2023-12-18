import {
  ActionFunctionArgs,
  Form,
  LoaderFunctionArgs,
  useFetcher,
  useLoaderData
} from 'react-router-dom'

// @ts-expect-error
import {getContact, updateContact} from '../contacts'

export interface IContact {
  id: number | string
  first: string
  last: string
  avatar: string
  twitter: string
  notes: string
  favorite: boolean
}

export async function action({request, params}: ActionFunctionArgs) {
  const formData = await request.formData()
  return updateContact(params.contactId, {
    favorite: formData.get('favorite') === 'true'
  })
}

export async function loader({params}: LoaderFunctionArgs): Promise<{
  contact: IContact
}> {
  const contact = await getContact(params.contactId)
  if (contact === null) {
    // eslint-disable-next-line
    throw new Response('', {
      status: 404,
      statusText: 'Not Found'
    })
  }
  return {contact}
}

export default function Contact() {
  const {contact} = useLoaderData() as {contact: IContact}

  return (
    <div id="contact">
      <div>
        <img key={contact.avatar} src={contact.avatar ?? null} />
      </div>

      <div>
        <h1>
          {contact.first !== undefined || contact.last !== undefined ? (
            <>
              {contact.first} {contact.last}
            </>
          ) : (
            <i>No Name</i>
          )}{' '}
          <Favorite contact={contact} />
        </h1>

        {contact.twitter ?? (
          <p>
            <a
              target="_blank"
              href={`https://twitter.com/${contact.twitter as string}`}
            >
              {contact.twitter}
            </a>
          </p>
        )}

        {contact.notes !== undefined && <p>{contact.notes}</p>}

        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>
          <Form
            method="post"
            action="destroy"
            onSubmit={event => {
              if (!confirm('Please confirm you want to delete this record.')) {
                event.preventDefault()
              }
            }}
          >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  )
}

function Favorite({contact}: {contact: IContact}) {
  const fetcher = useFetcher()

  let favorite = contact.favorite
  if (fetcher.formData != null) {
    favorite = fetcher.formData.get('favorite') === 'true'
  }

  return (
    <fetcher.Form method="post">
      <button
        name="favorite"
        value={favorite ? 'false' : 'true'}
        aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        {favorite ? '★' : '☆'}
      </button>
    </fetcher.Form>
  )
}
