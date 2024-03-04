import {FC} from 'react'

import {FormCreateOrDeleteCoverImage} from '../../ui/FormCreateOrDeleteCoverImage'

export const loader = () => {
  return {imageURL: ''}
}

export const Component: FC<{}> = () => {
  return <FormCreateOrDeleteCoverImage />
}
