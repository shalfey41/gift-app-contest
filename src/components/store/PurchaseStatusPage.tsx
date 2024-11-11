import React, { useContext, useEffect } from 'react';
import { BackButton } from '@twa-dev/sdk/react';
import { Gift } from '@prisma/client';
import { PageContext } from '@/components/app/PageContext';
import Button from '@/components/ui/Button';
import { useLottie } from 'lottie-react';
import { getGiftAnimationBySymbol, giftPreviewIcon } from '@/components/utils';
import useToast from '@/hooks/useToast';
import giftPurchasedAnimation from '@/lottie/effect-gift-purchased.json';
import { Page } from '@/modules/types';
import { Trans, useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

type Props = {
  gift: Gift;
  goBack: () => void;
};

export default function PurchaseStatusPage({ gift, goBack }: Props) {
  const { t } = useTranslation();
  const { setBottomBar, setRoute } = useContext(PageContext);
  const { showToast } = useToast();
  const giftAnimation = getGiftAnimationBySymbol(gift.symbol);
  const { View: GiftAnimation } = useLottie({
    animationData: giftAnimation,
    loop: false,
    renderer: 'canvas',
    className: 'h-[100px] w-[100px]',
  });
  const { View: PurchasedAnimation } = useLottie({
    animationData: giftPurchasedAnimation,
    renderer: 'canvas',
    loop: false,
    className: 'absolute top-0 left-0 aspect-square w-full',
  });

  useEffect(() => {
    setBottomBar(
      <motion.div
        className="grid gap-2 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Button size="large" onClick={() => setRoute({ page: Page.gifts })}>
          {t('gift.sendGift')}
        </Button>
        <Button variant="outline" size="large" onClick={() => setRoute({ page: Page.gifts })}>
          {t('gift.openStore')}
        </Button>
      </motion.div>,
    );

    setTimeout(() => {
      showToast({
        iconSrc: giftPreviewIcon[gift.symbol],
        title: t('giftStatus.buy.toast.title'),
        text: t('giftStatus.buy.toast.message'),
        buttonText: t('giftStatus.buy.toast.button'),
        // todo send param to giftId
        onClick: () => setRoute({ page: Page.gifts }),
      });
    }, 500);
  }, [t, setRoute, showToast, setBottomBar, gift]);

  return (
    <div className="relative flex h-full flex-col items-center justify-center px-4 text-center">
      {PurchasedAnimation}
      <div className="mb-4">{GiftAnimation}</div>
      <h1 className="mb-2 text-lg font-semibold">{t('giftStatus.buy.page.title')}</h1>
      <p className="text-balance">
        <Trans
          i18nKey="giftStatus.buy.page.message"
          values={{ gift: gift.name, price: gift.price, asset: gift.asset }}
          components={[
            <span key="1" className="font-medium" />,
            <span key="2" className="font-medium" />,
          ]}
        />
      </p>

      <BackButton onClick={() => goBack()} />
    </div>
  );
}
