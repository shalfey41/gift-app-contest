import { useCallback, useContext } from 'react';
import { PageContext, ToastOptions } from '@/components/app/PageContext';

export default function useToast() {
  const { setToast } = useContext(PageContext);

  const showToast = useCallback(
    (toastOptions: ToastOptions, duration = 2000) => {
      setToast(toastOptions);

      setTimeout(() => {
        setToast(null);
      }, duration);
    },
    [setToast],
  );

  return { showToast };
}
