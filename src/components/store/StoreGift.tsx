import React, { lazy, Suspense, useRef, useState } from 'react';
import { Gift } from '@prisma/client';
import Button from '@/components/ui/Button';
import {
  assetOutlineIcon,
  firstNonZeroDigit,
  getGiftAnimationBySymbol,
  getGiftPatternBackgroundBySymbol,
  giftPreviewImg,
} from '@/components/utils';
import { useTranslation } from 'react-i18next';
import { useInView } from 'framer-motion';
import Image from 'next/image';

const LazyGiftLottie = lazy(() => import('@/components/ui/LazyGiftLottie'));

type Props = {
  gift: Gift;
  selectGift: (gift: Gift) => void;
};

export default function StoreGift({ gift, selectGift }: Props) {
  const { t } = useTranslation();
  const isSoldOut = gift.availableAmount === 0;
  const animation = getGiftAnimationBySymbol(gift.symbol);
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useInView(ref, { margin: '200px 0px', once: true });
  const [showPlaceholder, setShowPlaceholder] = useState(true);

  return (
    <article
      ref={ref}
      onClick={() => selectGift(gift)}
      className="grid cursor-pointer justify-items-center rounded-xl px-3 pb-4 pt-2"
      style={{
        background: getGiftPatternBackgroundBySymbol(gift.symbol),
      }}
    >
      <p className="justify-self-end text-xs text-label-secondary dark:text-white/50">
        {isSoldOut
          ? t('gift.soldOut')
          : t('gift.available', { amount: gift.availableAmount, total: gift.totalAmount })}
      </p>
      <div className="flex h-32 w-32 items-center justify-center p-2.5">
        {showPlaceholder && (
          <Image width={128} height={128} src={giftPreviewImg[gift.symbol]} alt="icon" />
        )}
        {isVisible && (
          <Suspense>
            <LazyGiftLottie
              animationData={animation}
              onLoad={() => setShowPlaceholder(false)}
              className="h-full w-full"
            />
          </Suspense>
        )}
      </div>
      <h2 className="mb-3 mt-1 font-semibold">{gift.name}</h2>
      <Button disabled={isSoldOut} iconPath={assetOutlineIcon[gift.asset]} className="pl-3">
        {firstNonZeroDigit(gift.price)} {gift.asset}
      </Button>
    </article>
  );
}
