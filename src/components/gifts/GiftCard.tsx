import React from 'react';
import { Gift } from '@prisma/client';
import Button from '@/components/ui/Button';
import { getGiftAnimationBySymbol } from '@/components/utils';
import { useLottie } from 'lottie-react';
import { useTranslation } from 'react-i18next';

type Props = {
  gift: Gift;
  selectGift: (gift: Gift) => void;
};

export default function GiftCard({ gift, selectGift }: Props) {
  const { t } = useTranslation();
  const animation = getGiftAnimationBySymbol(gift.symbol);
  const { View } = useLottie({
    animationData: animation,
    renderer: 'canvas',
    className: 'h-full w-full',
  });

  return (
    <article
      onClick={() => selectGift(gift)}
      className="grid cursor-pointer justify-items-center rounded-xl bg-secondary px-4 pb-3 pt-2"
    >
      <h2 className="mb-1 overflow-hidden text-ellipsis text-nowrap text-center text-xxs text-label-secondary">
        {gift.name}
      </h2>
      <div className="mb-2 flex h-20 w-20 items-center justify-center p-1">{View}</div>
      <Button>{t('gift.send')}</Button>
    </article>
  );
}
