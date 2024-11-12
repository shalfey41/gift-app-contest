import { useCallback, useContext, useRef } from 'react';
import { PageContext, ToastOptions } from '@/components/app/PageContext';

export default function useToast() {
  const { setToast } = useContext(PageContext);
  const timeoutRef = useRef<number | null>(null);

  const showToast = useCallback(
    (toastOptions: ToastOptions, duration = 2000) => {
      setToast(toastOptions);

      timeoutRef.current = window.setTimeout(() => {
        setToast(null);
      }, duration);
    },
    [setToast],
  );

  return { showToast };
}
