import {RefObject, useCallback, useEffect, useRef} from 'react';
import {AccessibilityInfo, HostInstance, Platform} from 'react-native';

/**
 * How long to wait before moving screen reader focus.  An immediate focus event is often ignored, as the screen
 * reader is still settling on a view that has just appeared.
 */
const ACCESSIBILITY_FOCUS_DELAY_MS = 250;

/**
 * Returns a ref to attach to an element, and a stable callback that moves screen reader focus to that element after
 * a short delay - call it when the element has just appeared, such as when a dialog or sheet opens.
 *
 * Does nothing on web, where focus is managed through the DOM instead.
 *
 * Calling the callback again restarts the delay, and a pending focus is cancelled if the calling component unmounts.
 *
 * @param delayMillis The delay in milliseconds before moving screen reader focus.
 * @returns The ref to attach, and the callback that focuses it.
 */
export function useAccessibilityFocus<T extends HostInstance>(
  delayMillis = ACCESSIBILITY_FOCUS_DELAY_MS,
): {
  ref: RefObject<T | null>;
  focus: () => void;
} {
  const ref = useRef<T>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const focus = useCallback(() => {
    if (Platform.OS === 'web') {
      return;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = null;
      if (ref.current) {
        AccessibilityInfo.sendAccessibilityEvent(ref.current, 'focus');
      }
    }, delayMillis);
  }, [delayMillis]);

  return {ref, focus};
}
