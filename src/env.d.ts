/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DISCORD_BASE_URL: string;
  readonly VITE_DISCORD_CDN_BASE_URL: string;
  readonly VITE_DISCORD_CLIENT_ID: string;
  readonly VITE_DISCORD_SCOPES: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly DISCORD_CLIENT_SECRET: string;
    }
  }
}

export {};
