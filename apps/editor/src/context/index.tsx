import {createContext, FC, ReactNode} from 'react'

import {Domain} from '../domain'

export interface InnerContext {
  domain: Domain
}

window.domain = window.domain ?? Domain.create({API_HOST: import.meta.env.VITE_API_HOST})

const innerContext: InnerContext = {
  domain: window.domain
}

const Context = createContext<InnerContext>(innerContext)

export const EditorContext: FC<{children: ReactNode}> = ({children}) => {
  return <Context.Provider value={innerContext}>{children}</Context.Provider>
}
