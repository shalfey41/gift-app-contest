import React, { useContext, useEffect } from 'react';
import { BackButton } from '@twa-dev/sdk/react';
import { Gift } from '@prisma/client';
import { Page, PageContext } from '@/components/app/PageContext';
import Button from '@/components/ui/Button';
import { useLottie } from 'lottie-react';
import { getGiftAnimationBySymbol, giftPreviewIcon } from '@/components/utils';
import useToast from '@/hooks/useToast';
import giftPurchasedAnimation from '@/lottie/effect-gift-purchased.json';
import { fa } from '@faker-js/faker';

type Props = {
  gift: Gift;
  goBack: () => void;
};

export default function PurchaseStatusPage({ gift, goBack }: Props) {
  const { setBottomBar, setPage } = useContext(PageContext);
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
      <div className="grid gap-2 px-4">
        <Button size="large" onClick={() => setPage(Page.gifts)}>
          Send Gift
        </Button>
        <Button variant="outline" size="large" onClick={() => setPage(Page.gifts)}>
          Open Store
        </Button>
      </div>,
    );

    setTimeout(() => {
      showToast({
        iconSrc: giftPreviewIcon[gift.symbol],
        title: 'You Bought a Gift',
        text: 'Now send it to your friend.',
        buttonText: 'Send',
        onClick: () => setPage(Page.gifts),
      });
    }, 500);
  }, [setPage, showToast, setBottomBar, gift.symbol]);

  return (
    <div className="relative flex h-full flex-col items-center justify-center px-4 text-center">
      {PurchasedAnimation}
      <div className="mb-4">{GiftAnimation}</div>
      <h1 className="mb-2 text-lg font-semibold">Gift Purchased</h1>
      <p className="text-balance">
        The <span className="font-medium">{gift.name}</span> gift was purchased for{' '}
        <span className="font-medium">
          {gift.price} {gift.asset}.
        </span>
      </p>

      <BackButton onClick={() => goBack()} />
    </div>
  );
}
