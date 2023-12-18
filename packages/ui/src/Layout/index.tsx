import type {ReactChild} from 'react'

export interface ILayoutProps {
  children: ReactChild
}

export function Layout({children}: ILayoutProps) {
  return (
    <>
      <h1>Layout</h1>
      {children}
    </>
  )
}
