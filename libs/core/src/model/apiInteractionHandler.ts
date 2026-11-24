/**
 * Generic handler contract for invoking an API action and tracking progress.
 *
 * @template T - Request payload type passed to the API callback
 */
export interface ApiInteractionHandler<T> {
  onInvokeApi: (data: T) => void;
  isApiUpdating: boolean;
  isApiSuccess: boolean;
}
