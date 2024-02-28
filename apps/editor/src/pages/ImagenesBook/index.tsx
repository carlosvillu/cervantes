import {FC, useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import {useParams} from 'react-router-dom'

import {PhotoIcon} from '@heroicons/react/24/solid'

const _10_MB = 10000000

export const Component: FC<{}> = () => {
  const [forbiddenFileState, setForbiddenFileState] = useState(false)
  const [imageURL, setImageURL] = useState('')
  const [fileIMG, setFileIMG] = useState<File>()

  const {bookID} = useParams()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return

    const [file] = acceptedFiles ?? []
    const {size = 0} = file ?? {}

    if (size > _10_MB) return setForbiddenFileState(true)

    setForbiddenFileState(false)
    setImageURL(URL.createObjectURL(file))
    setFileIMG(file)
  }, [])

  const {getRootProps, getInputProps, isDragAccept, isDragReject} = useDropzone({
    maxFiles: 1,
    accept: {'image/*': []},
    onDrop
  })

  const uploaderDisplay = imageURL !== '' ? 'hidden' : 'flex'
  const previewDisplay = imageURL === '' ? 'hidden' : 'grid'

  return (
    <>
      <form
        onSubmit={async evt => {
          evt.preventDefault()
          const imageUploaded = await window.domain.UploadImageStaticsUseCase.execute({file: fileIMG!})
          debugger
        }}
      >
        <input type="hidden" name="bookID" value={bookID} />
        <input type="hidden" name="tenant" value="upload-cover-imageURL" />
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">Image cover</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Enhance your book's visual appeal by adding a captivating cover image. Ensure your image has an aspect
              ratio of 1:1.5 for a flawless fit.
            </p>
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="col-span-full">
                <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900 sr-only">
                  Cover photo
                </label>
                <div
                  className={`${uploaderDisplay} mt-2 justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10`}
                  {...getRootProps()}
                >
                  <div className="text-center">
                    <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                      <label
                        htmlFor="file"
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file"
                          name="file"
                          type="file"
                          className="sr-only"
                          accept="imageURL/*"
                          {...getInputProps()}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    {isDragAccept && <p className="pl-1">The file will be accepted</p>}
                    {isDragReject && <p className="pl-1">The file will be rejected</p>}
                    {forbiddenFileState && <p className="pl-1 text-red-300">The file is bigger than 10Mb</p>}
                    <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF</p>
                  </div>
                </div>
              </div>
            </div>
            <div className={`${previewDisplay} flex items-center justify-center`}>
              <img
                className="aspect-[1/1.5] h-[430px] rounded-2xl object-cover"
                src={imageURL}
                alt=""
                onLoad={() => {
                  URL.revokeObjectURL(imageURL)
                }}
              />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button
              type="button"
              className="text-sm font-semibold leading-6 text-gray-900"
              onClick={() => setImageURL('')}
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
        </div>
      </form>
    </>
  )
}
