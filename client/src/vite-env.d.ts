/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly VITE_YOUR_ENV_VAR_1: string
    readonly VITE_YOUR_ENV_VAR_2: string
    // more env variables...
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }