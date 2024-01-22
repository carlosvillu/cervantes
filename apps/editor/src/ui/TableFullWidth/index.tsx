import {FC} from 'react'
import {Form} from 'react-router-dom'

import {capitalizaFirstLetter} from '../../js/string'

const kindActionsCLX = {
  info: 'text-indigo-600 hover:text-indigo-900',
  alert: 'text-red-600 hover:text-red-900'
}

export const TableFullWidth: FC<{
  title: string
  subtitle: string
  headers: string[]
  rows: string[][]
  actionButton?: boolean
  actionButtonText: string
  onClickActionButton: () => void
  rowAction: string
  kindAction: 'info' | 'alert'
}> = ({
  title,
  subtitle,
  headers,
  actionButton = false,
  rowAction,
  rows,
  kindAction,
  actionButtonText,
  onClickActionButton
}) => {
  const [firstHeader, ...restHeaders] = headers
  return (
    <div className="mt-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">{title}</h1>
          <p className="mt-2 text-sm text-gray-700">{subtitle}</p>
        </div>
        {actionButton ? (
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              onClick={onClickActionButton}
              type="button"
              className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {actionButtonText}
            </button>
          </div>
        ) : null}
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:pl-8"
                  >
                    {capitalizaFirstLetter(firstHeader)}
                  </th>
                  {restHeaders.map((header, key) => {
                    return (
                      <th key={key} scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        {capitalizaFirstLetter(header)}
                      </th>
                    )
                  })}
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 lg:pr-8">
                    <span className="sr-only">{rowAction}</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {rows.map((row, index) => {
                  const [firstCell, ...restCells] = row
                  const [urlAction, ...rest] = restCells.reverse()
                  return (
                    <tr key={index}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
                        {firstCell}
                      </td>
                      {rest.reverse().map((cell, key) => (
                        <td key={key} className="px-3 py-4 text-sm text-gray-500">
                          {cell}
                        </td>
                      ))}
                      <td className="relative text-ellipsis py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8">
                        <Form method="delete" action={urlAction}>
                          <button type="submit" className={kindActionsCLX[kindAction]}>
                            {rowAction}
                          </button>
                        </Form>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
