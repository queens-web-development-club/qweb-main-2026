import { useEffect, useState } from 'react';

type ContentLoader<T> = () => PromiseLike<{ data: T[] | null; error: unknown }>;

/** Empty results stay empty; unavailable content never falls back to old records. */
export function useContentList<T>(load: ContentLoader<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setHasError(false);
    setItems([]);

    async function fetchContent() {
      try {
        const { data, error } = await load();
        if (!active) return;
        if (error) setHasError(true);
        else setItems(data ?? []);
      } catch {
        if (active) setHasError(true);
      } finally {
        if (active) setIsLoading(false);
      }
    }

    void fetchContent();
    return () => { active = false; };
  }, [load]);

  return { items, isLoading, hasError };
}
