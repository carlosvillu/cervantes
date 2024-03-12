import {FC, FormEventHandler, useCallback, useReducer} from 'react'
import {useDropzone} from 'react-dropzone'
import {useLoaderData, useRevalidator} from 'react-router-dom'

import {PhotoIcon, SparklesIcon} from '@heroicons/react/20/solid'

import {BookCover} from '../../domain/image/Models/BookCover'
import {UploadImageResult} from '../../domain/statics/Models/UploadImageResult'
import {fromURLtoFile} from '../../js/file'
import {LoaderGenerateImage} from '../LoaderGenerateImage'
import {Notification} from '../Notification'
import {SubmitButton} from '../SubmitButton'

const _10_MB = 10000000
interface FormState {
  image: File | undefined
  imageURL: string | undefined
  showError: boolean
  submitting: boolean
  forbiddenFile: boolean
  generating: boolean
  generatedFiles: File[] | undefined
  generatedURLs: string[] | undefined
}
type FormAction =
  | {type: 'error'}
  | {type: 'submitting'}
  | {type: 'changeFile'; payload: {file: File}}
  | {type: 'submitted'}
  | {type: 'forbiddenFile'}
  | {type: 'reset'}
  | {type: 'generating'}
  | {type: 'generatedImages'; payload: {generatedFiles: File[]}}

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
    case 'generating':
      return {...state, generating: true}
    case 'generatedImages':
      return {
        ...state,
        generatedFiles: action.payload.generatedFiles,
        generatedURLs: action.payload.generatedFiles.map(file => URL.createObjectURL(file)),
        imageURL: undefined,
        generating: false,
        forbiddenFile: false
      }
    case 'reset':
      return {
        image: undefined,
        imageURL: undefined,
        showError: false,
        submitting: false,
        forbiddenFile: false,
        generating: false,
        generatedFiles: undefined,
        generatedURLs: undefined
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
    forbiddenFile: false,
    generating: false,
    generatedFiles: undefined,
    generatedURLs: undefined
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

  const handlerClickPrompt = useCallback(async () => {
    dispatch({type: 'generating'})
    const input = document.getElementById('prompt') as HTMLInputElement
    const imagesURLSs = await window.domain.GenerateFromPromptImageUseCase.execute({prompt: input.value})
    const files = await Promise.all(imagesURLSs.urls().map(url => fromURLtoFile(url)))

    dispatch({type: 'generatedImages', payload: {generatedFiles: files}})
  }, [])

  const previewGeneratedImages = formState.generatedURLs ? 'flex' : 'hidden'
  const placeHolderGenerationDisplay = !formState.generatedURLs && formState.generating ? 'flex' : 'hidden'
  const inputPromptDisplay = !formState.generatedURLs && !formState.generating ? 'block' : 'hidden'
  const uploaderDisplay = formState.imageURL ? 'hidden' : 'flex'
  const previewDisplay = formState.imageURL ? 'grid' : 'hidden'
  const submitButtoncolor = imageURL ? 'bg-red-600 hover:bg-red-500' : 'bg-indigo-600 hover:bg-indigo-500'

  return (
    <>
      {formState.showError && <Notification status="error" title="Error creating or Updating the cover" />}
      <form onSubmit={handlerSubmit}>
        <input type="hidden" name="intent" value={imageURL ? 'remove' : 'create'} />
        <div className="space-y-12">
          <div className=" border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">{title}</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Enhance your book's visual appeal by adding a captivating cover image. Ensure your image has an aspect
              ratio of 1:1.5 for a flawless fit.
            </p>
            <div className={`${uploaderDisplay} mt-10 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-6`}>
              <div className="col-span-3 flex justify-center items-center border-b sm:border-b-0 sm:border-r border-gray-300">
                <div className={`${previewGeneratedImages} w-full justify-around mb-6 sm:mb-0 sm:justify-evenly`}>
                  {formState.generatedURLs?.map(url => {
                    return (
                      <img
                        className="aspect-[1/1.5] h-[215px] rounded-2xl object-cover"
                        src={url}
                        alt=""
                        onLoad={() => {
                          URL.revokeObjectURL(url)
                        }}
                      />
                    )
                  })}
                </div>
                <div className={`${placeHolderGenerationDisplay} w-full px-6 py-6 mt-2  justify-center items-center`}>
                  <LoaderGenerateImage />
                </div>
                <div className={`${inputPromptDisplay} w-full p-6`}>
                  <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                    Prompt
                  </label>
                  <div className="mt-2 flex rounded-md shadow-sm">
                    <div className="relative flex flex-grow items-stretch focus-within:z-10">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <PhotoIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                      <input
                        type="text"
                        name="prompt"
                        id="prompt"
                        className="block w-full rounded-none rounded-l-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        placeholder="Prompt of your image"
                        autoComplete="off"
                        autoCapitalize="off"
                        onKeyDown={async e => e.key === 'Enter' && handlerClickPrompt()}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handlerClickPrompt}
                      className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                      <SparklesIcon className="-ml-0.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                      Generate
                    </button>
                  </div>
                  <p className="mt-2 text-sm text-gray-500" id="email-description">
                    Choose your image wisely, as it will be universally applied for all users.
                  </p>
                </div>
              </div>
              <div className="col-span-3 flex items-center justify-center">
                <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900 sr-only">
                  Cover photo
                </label>
                <div
                  className={`${uploaderDisplay} mt-2 justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 w-full`}
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
            <div className={`${previewDisplay} mt-10 flex items-center justify-center`}>
              <img
                className="aspect-[1/1.5] h-[430px] rounded-2xl object-cover"
                src={formState.imageURL}
                alt=""
                onLoad={() => {
                  URL.revokeObjectURL(formState.imageURL)
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
