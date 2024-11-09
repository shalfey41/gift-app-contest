import { useCallback, useContext } from 'react';
import { PageContext, PopupOptions } from '@/components/app/PageContext';

export default function usePopup() {
  const { setPopup, toggleBottomBar } = useContext(PageContext);
  const closePopup = useCallback(() => {
    setPopup(null);
    toggleBottomBar(true);
  }, [setPopup, toggleBottomBar]);

  const showPopup = useCallback(
    (options: Omit<PopupOptions, 'onClose'>) => {
      toggleBottomBar(false);

      setPopup({
        ...options,
        onClose: closePopup,
      });
    },
    [closePopup, setPopup, toggleBottomBar],
  );

  return { showPopup, closePopup };
}
