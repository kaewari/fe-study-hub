/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GEMINI_KEY_1?: string;
  readonly VITE_GEMINI_KEY_1_NAME?: string;
  readonly VITE_GEMINI_KEY_2?: string;
  readonly VITE_GEMINI_KEY_2_NAME?: string;
  readonly VITE_GEMINI_KEY_3?: string;
  readonly VITE_GEMINI_KEY_3_NAME?: string;
  readonly VITE_GEMINI_KEY_4?: string;
  readonly VITE_GEMINI_KEY_4_NAME?: string;
  readonly VITE_GEMINI_KEY_5?: string;
  readonly VITE_GEMINI_KEY_5_NAME?: string;
  readonly VITE_GEMINI_KEY_6?: string;
  readonly VITE_GEMINI_KEY_6_NAME?: string;
  [key: string]: any;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
