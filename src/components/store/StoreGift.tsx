import React from 'react';
import { Gift } from '@prisma/client';
import Button from '@/components/ui/Button';
import {
  assetOutlineIcon,
  firstNonZeroDigit,
  getGiftAnimationBySymbol,
  getGiftPatternBackgroundBySymbol,
} from '@/components/utils';
import { useLottie } from 'lottie-react';

type Props = {
  gift: Gift;
  selectGift: (gift: Gift) => void;
};

export default function StoreGift({ gift, selectGift }: Props) {
  const isSoldOut = gift.availableAmount === 0;
  const animation = getGiftAnimationBySymbol(gift.symbol);
  const { View } = useLottie({
    animationData: animation,
    renderer: 'canvas',
    className: 'h-full w-full',
  });

  return (
    <article
      onClick={() => selectGift(gift)}
      className="grid cursor-pointer justify-items-center rounded-xl px-3 pb-4 pt-2"
      style={{
        background: getGiftPatternBackgroundBySymbol(gift.symbol),
      }}
    >
      <p className="justify-self-end text-xs text-label-secondary">
        {isSoldOut ? 'Sold out' : `${gift.availableAmount} of ${gift.totalAmount}`}
      </p>
      <div className="flex h-32 w-32 items-center justify-center p-2.5">{View}</div>
      <h2 className="mb-3 mt-1 font-semibold">{gift.name}</h2>
      <Button disabled={isSoldOut} iconPath={assetOutlineIcon[gift.asset]} className="pl-3">
        {firstNonZeroDigit(gift.price)} {gift.asset}
      </Button>
    </article>
  );
}
