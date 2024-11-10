import React, { useContext, useEffect } from 'react';
import { PageContext } from '@/components/app/PageContext';
import { useLottie } from 'lottie-react';
import animation from '@/lottie/emoji-balloons.json';
import Button from '@/components/ui/Button';
import { Page } from '@/modules/types';
import { useTranslation } from 'react-i18next';

export default function HistoryEmpty() {
  const { t } = useTranslation();
  const { setBottomBar, setRoute } = useContext(PageContext);
  const { View } = useLottie({
    animationData: animation,
    renderer: 'canvas',
    className: 'w-full h-full',
    loop: false,
  });

  useEffect(() => {
    setBottomBar(
      <div className="px-4">
        <Button size="large" className="w-full" onClick={() => setRoute({ page: Page.store })}>
          Open Store
        </Button>
      </div>,
    );
  }, [setBottomBar, setRoute]);

  return (
    <section className="flex h-full items-center justify-center px-4">
      <div className="grid justify-items-center">
        <div className="mb-4 h-[100px] w-[100px]">{View}</div>
        <h1 className="mb-2 text-lg font-semibold">{t('history.empty.title')}</h1>
        <p className="text-balance text-center">{t('history.empty.text')}</p>
      </div>
    </section>
  );
}
