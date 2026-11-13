import { useEffect } from 'react';

/** Sets the browser tab title while the page is shown. */
export function useDocumentTitle(title: string): void {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
