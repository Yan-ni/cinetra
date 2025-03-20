interface ImportMetaEnv {
    readonly VITE_API_PATH: string;
    readonly DEV: boolean;
}

interface ImportMeta {
readonly env: ImportMetaEnv;
}