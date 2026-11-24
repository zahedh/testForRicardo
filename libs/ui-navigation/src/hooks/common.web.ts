import {useRouter} from 'next/navigation';
import {useCallback} from 'react';

/**
 * A custom hook that returns a callback function to handle back navigation for web.
 *
 * @returns A callback function that will be called when back navigation is needed.
 */
export function useOnBackNavigation(): () => void {
  const router = useRouter();

  return useCallback(() => {
    router.back();
  }, [router]);
}
