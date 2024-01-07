import {FC, useState} from 'react'
import {Form, useLoaderData} from 'react-router-dom'

import {ulid} from 'ulid'

import type {BookJSON} from '../../domain/book/Models/Book'
import {ChapterJSON} from '../../domain/chapter/Models/Chapter'
import {Link} from '../../domain/link/Models/Link'
import type {UserJSON} from '../../domain/user/Models/User'
import {capitalizaFirstLetter} from '../../js/string'
import {ComboBoxSimple} from '../ComboBoxSimple'
import {Item, SelectMenuSimpleCustom} from '../SelectMenuSimpleCustom'

export const FormNewLink: FC<{onClickCancel: () => void}> = ({onClickCancel}) => {
  const kinds = Link.Kinds.map(kind => {
    return {id: kind, name: capitalizaFirstLetter(kind)}
  }) as Item[]

  const {book, user, chapter, chapters} = useLoaderData() as {
    book: BookJSON
    user: UserJSON
    chapter: ChapterJSON
    chapters: ChapterJSON[]
  }
  const [kindID, setKindID] = useState<string | number>(Link.Kinds[0])

  return (
    <>
      <Form
        id="form-new-link"
        method="post"
        action={`/book/${book.id as string}/chapter/${chapter.id as string}?index`}
      >
        <input id="id" name="id" type="hidden" value={ulid()} />
        <input id="intent" name="intent" type="hidden" value="new-link" />
        <input id="userID" name="userID" type="hidden" value={user.id} />
        <input id="bookID" name="bookID" type="hidden" value={book.id} />
        <input id="chapterID" name="chapterID" type="hidden" value={chapter.id} />
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">New Link</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">Define a link between two chapters</p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <SelectMenuSimpleCustom
                  name="kind"
                  label="Kind of link"
                  items={kinds}
                  defaultItem={kinds[0]}
                  onChange={setKindID}
                />
              </div>
              <div className="col-span-full" hidden={kindID !== 'options'}>
                <div className="mt-2">
                  <ComboBoxSimple
                    name="to"
                    label="Chapter to link"
                    items={chapters.map(chapter => {
                      return {id: chapter.id, name: capitalizaFirstLetter(chapter.title)}
                    })}
                    defaultItem={{id: chapters[0].id, name: capitalizaFirstLetter(chapters[0].title)}}
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label htmlFor="about" className="block text-sm font-medium leading-6 text-gray-900">
                  Caption
                </label>
                <div className="mt-2">
                  <textarea
                    id="body"
                    name="body"
                    rows={3}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    defaultValue={''}
                    required
                  />
                </div>
                <p className="mt-3 text-sm leading-6 text-gray-600">
                  Write a few words explain to your reader with option he has.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="button"
            className="text-sm font-semibold leading-6 text-gray-900"
            onClick={() => onClickCancel()}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Save
          </button>
        </div>
      </Form>
    </>
  )
}
