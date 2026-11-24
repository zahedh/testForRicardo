import {useRouter} from 'next/navigation';
import {useCallback} from 'react';

/**
 * Hook to create a callback for when the user presses "Payment History" in the You menu.
 *
 * @returns The callback.
 */
export function useOnPaymentHistoryNavigation(): () => void {
  const router = useRouter();

  return useCallback(() => {
    router.push('/dashboard/account/payment-history');
  }, [router]);
}

/**
 * Hook to create a callback for when the user presses "Change email" in the You menu.
 *
 * @returns The callback.
 */
export function useOnNavigateToEmailAddressEdit(): () => void {
  const router = useRouter();

  return useCallback(() => {
    router.push('/dashboard/account/change-email');
  }, [router]);
}
