import {FC} from 'react'
import {Handle, Position} from 'reactflow'

export const ChapterNode: FC<{data: {label: string; chapterID: string}}> = () => {
  return (
    <div aria-live="assertive" className="pointer-events-none  inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6">
      <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
        <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="p-4">
            <div className="flex items-center">
              <div className="flex w-0 flex-1 justify-between">
                <p className=" flex-1 text-sm font-medium text-gray-900">Discussion archived</p>
                <button
                  type="button"
                  className="ml-3 flex-shrink-0 rounded-md bg-white text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Undo
                </button>
              </div>
            </div>
          </div>
        </div>
        <Handle type="target" position={Position.Top} className="w-16 !bg-teal-500" />
        <Handle type="source" position={Position.Bottom} className="w-16 !bg-teal-500" />
      </div>
    </div>
  )
}
