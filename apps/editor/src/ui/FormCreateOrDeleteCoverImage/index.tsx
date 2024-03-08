import {FC, FormEventHandler, useCallback, useReducer} from 'react'
import {useDropzone} from 'react-dropzone'
import {useLoaderData, useRevalidator} from 'react-router-dom'

import {PhotoIcon} from '@heroicons/react/20/solid'

import {BookCover} from '../../domain/image/Models/BookCover'
import {UploadImageResult} from '../../domain/statics/Models/UploadImageResult'
import {Notification} from '../Notification'
import {SubmitButton} from '../SubmitButton'

const _10_MB = 10000000
interface FormState {
  image: File | undefined
  imageURL: string | undefined
  showError: boolean
  submitting: boolean
  forbiddenFile: boolean
}
type FormAction =
  | {type: 'error'}
  | {type: 'submitting'}
  | {type: 'changeFile'; payload: {file: File}}
  | {type: 'submitted'}
  | {type: 'forbiddenFile'}
  | {type: 'reset'}

const formReducer = (state: FormState, action: FormAction) => {
  const {type} = action
  switch (type) {
    case 'error':
      return {...state, showError: true, submitting: false}
    case 'submitting':
      return {...state, showError: false, submitting: true}
    case 'submitted':
      return {...state, submitting: false}
    case 'changeFile':
      return {
        ...state,
        image: action.payload.file,
        imageURL: URL.createObjectURL(action.payload.file),
        forbiddenFile: false
      }
    case 'forbiddenFile':
      return {...state, forbiddenFile: true}
    case 'reset':
      return {
        image: undefined,
        imageURL: undefined,
        showError: false,
        submitting: false,
        forbiddenFile: false
      }
  }
}

export const FormCreateOrDeleteCoverImage: FC<{
  handlerDelete: () => Promise<unknown>
  handlerCreate: (image: UploadImageResult) => Promise<BookCover>
  title: string
}> = ({handlerDelete, handlerCreate, title}) => {
  const revalidator = useRevalidator()
  const {imageURL} = useLoaderData() as {imageURL: string}
  const [formState, dispatch] = useReducer(formReducer, {
    image: undefined,
    imageURL,
    showError: false,
    submitting: false,
    forbiddenFile: false
  })

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return

    const [file] = acceptedFiles ?? []
    const {size = 0} = file ?? {}

    if (size > _10_MB) return dispatch({type: 'forbiddenFile'})

    dispatch({type: 'changeFile', payload: {file}})
  }, [])

  const {getRootProps, getInputProps, isDragAccept, isDragReject} = useDropzone({
    maxFiles: 1,
    accept: {'image/*': []},
    onDrop
  })

  const handlerSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    async evt => {
      evt.preventDefault()
      dispatch({type: 'submitting'})
      const {intent} = Object.fromEntries(new FormData(evt.currentTarget)) as {intent: 'create' | 'remove'}

      if (intent === 'remove') {
        await handlerDelete()
        dispatch({type: 'reset'})
      }

      if (intent === 'create' && formState.image) {
        const imageUploaded = await window.domain.UploadImageStaticsUseCase.execute({file: formState.image})
        if (imageUploaded.isEmpty()) {return dispatch({type: 'error'})} // eslint-disable-line 

        const model = await handlerCreate(imageUploaded)
        if (model.isEmpty()) {return dispatch({type: 'error'})} // eslint-disable-line 
      }

      dispatch({type: 'submitted'})
      revalidator.revalidate()
    },
    [formState.image, revalidator, handlerCreate, handlerDelete]
  )

  const uploaderDisplay = formState.imageURL ? 'hidden' : 'flex'
  const previewDisplay = formState.imageURL ? 'grid' : 'hidden'
  const submitButtoncolor = imageURL ? 'bg-red-600 hover:bg-red-500' : 'bg-indigo-600 hover:bg-indigo-500'

  return (
    <>
      {formState.showError && <Notification status="error" title="Error creating or Updating the cover" />}
      <form onSubmit={handlerSubmit}>
        <input type="hidden" name="intent" value={imageURL ? 'remove' : 'create'} />
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">{title}</h2>
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
                    {formState.forbiddenFile && <p className="pl-1 text-red-300">The file is bigger than 10Mb</p>}
                    <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF</p>
                  </div>
                </div>
              </div>
            </div>
            <div className={`${previewDisplay} flex items-center justify-center`}>
              <img
                className="aspect-[1/1.5] h-[430px] rounded-2xl object-cover"
                src={formState.imageURL}
                alt=""
                onLoad={() => {
                  URL.revokeObjectURL(formState.imageURL!)
                }}
              />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button
              hidden={Boolean(imageURL)}
              type="button"
              className="text-sm font-semibold leading-6 text-gray-900"
              onClick={() => dispatch({type: 'reset'})}
            >
              Cancel
            </button>
            <SubmitButton
              show={formState.submitting}
              className={`${submitButtoncolor} rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
              label={imageURL ? 'Delete' : 'Save'}
            />
          </div>
        </div>
      </form>
    </>
  )
}
