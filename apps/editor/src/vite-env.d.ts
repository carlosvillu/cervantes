/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STAGE: string
  readonly VITE_NODE_ENV: string
  readonly VITE_API_HOST: string
  readonly VITE_IMAGE_CDN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
