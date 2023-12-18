import {useEffect} from 'react'
import {
  Form,
  LoaderFunctionArgs,
  NavLink,
  Outlet,
  redirect,
  useLoaderData,
  useNavigation,
  useSubmit
} from 'react-router-dom'

// @ts-expect-error
import {createContact, getContacts} from '../contacts'
import type {IContact} from './contact'

export async function loader({request}: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const q = url.searchParams.get('q')
  const contacts = await getContacts(q)
  return {contacts, q}
}

export async function action() {
  const contact = await createContact()
  return redirect(`/contacts/${contact.id as string}/edit`)
}

export default function Root() {
  const {contacts, q} = useLoaderData() as {contacts: IContact[]; q: string}
  const navigation = useNavigation()
  const submit = useSubmit()

  const searching =
    navigation.location != null &&
    new URLSearchParams(navigation.location.search).has('q')

  useEffect(() => {
    // @ts-expect-error
    document.getElementById('q').value = q
  }, [q])

  return (
    <>
      <div id="sidebar">
        <h1>React Router Contacts</h1>
        <div>
          <Form id="search-form" role="search">
            <input
              className={searching ? 'loading' : ''}
              id="q"
              aria-label="Search contacts"
              placeholder="Search"
              type="search"
              name="q"
              defaultValue={q}
              onChange={event => {
                const isFirstSearch = q == null
                submit(event.currentTarget.form, {
                  replace: !isFirstSearch
                })
              }}
            />
            <div id="search-spinner" aria-hidden hidden={!searching} />
            <div className="sr-only" aria-live="polite"></div>
          </Form>
          <Form method="post">
            <button type="submit">New</button>
          </Form>
        </div>
        <nav>
          {contacts.length !== 0 ? (
            <ul>
              {contacts.map(contact => (
                <li key={contact.id}>
                  <NavLink
                    to={`contacts/${contact.id as string}`}
                    className={({isActive, isPending}) =>
                      isActive ? 'active' : isPending ? 'pending' : ''
                    }
                  >
                    {contact.first !== undefined ||
                    contact.last !== undefined ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}{' '}
                    {contact.favorite ?? <span>★</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No contacts</i>
            </p>
          )}
        </nav>
      </div>
      <div
        id="detail"
        className={navigation.state === 'loading' ? 'loading' : ''}
      >
        <Outlet />
      </div>
    </>
  )
}