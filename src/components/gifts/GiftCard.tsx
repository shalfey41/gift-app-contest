import React, { lazy, Suspense, useRef, useState } from 'react';
import { Gift } from '@prisma/client';
import Button from '@/components/ui/Button';
import { getGiftAnimationBySymbol, giftPreviewImg } from '@/components/utils';
import { useTranslation } from 'react-i18next';
import { useInView } from 'framer-motion';
import Image from 'next/image';

const LazyGiftLottie = lazy(() => import('@/components/ui/LazyGiftLottie'));

type Props = {
  gift: Gift;
  selectGift: (gift: Gift) => void;
};

export default function GiftCard({ gift, selectGift }: Props) {
  const { t } = useTranslation();
  const animation = getGiftAnimationBySymbol(gift.symbol);
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useInView(ref, { margin: '200px 0px', once: true });
  const [showPlaceholder, setShowPlaceholder] = useState(true);

  return (
    <article
      ref={ref}
      onClick={() => selectGift(gift)}
      className="grid cursor-pointer justify-items-center rounded-xl bg-secondary px-4 pb-3 pt-2"
    >
      <h2 className="mb-1 overflow-hidden text-ellipsis text-nowrap text-center text-xxs text-label-secondary">
        {gift.name}
      </h2>
      <div className="mb-2 flex h-20 w-20 items-center justify-center p-1">
        {showPlaceholder && (
          <Image width={80} height={80} src={giftPreviewImg[gift.symbol]} alt="icon" />
        )}
        {isVisible && (
          <Suspense>
            <LazyGiftLottie
              animationData={animation}
              className="h-full w-full"
              renderer="canvas"
              onLoad={() => setShowPlaceholder(false)}
            />
          </Suspense>
        )}
      </div>
      <Button>{t('gift.send')}</Button>
    </article>
  );
}
