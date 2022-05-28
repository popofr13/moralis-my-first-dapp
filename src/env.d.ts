/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_MORALIS_APPID: string
    readonly VITE_MORALIS_SERVERURL: string
    readonly VITE_SMARTCONTRACT_ADDRESS: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}