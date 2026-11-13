interface ImportMetaEnv {
  /** Formspree form ID, from .env.local (never committed). */
  readonly VITE_FORMSPREE_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
