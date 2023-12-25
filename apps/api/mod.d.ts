declare module '@crdtech/express-health-check-middleware'

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string | undefined
      PORT: string
      HOST: string
    }
  }
}
