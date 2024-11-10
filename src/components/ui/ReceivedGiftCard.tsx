import React from 'react';
import { Gift, User } from '@prisma/client';
import { getGiftAnimationBySymbol } from '@/components/utils';
import { useLottie } from 'lottie-react';
import { useTranslation } from 'react-i18next';
import { getLanguage } from '@/modules/i18n/client';

type Props = {
  gift: Gift;
  user?: User | null;
  selectGift: () => void;
};

export default function ReceivedGiftCard({ user, gift, selectGift }: Props) {
  const { t } = useTranslation();
  const animation = getGiftAnimationBySymbol(gift.symbol);
  const { View } = useLottie({
    animationData: animation,
    renderer: 'canvas',
    className: 'h-full w-full',
  });

  return (
    <article onClick={selectGift} className="cursor-pointer rounded-xl bg-secondary pb-3 pt-2">
      <div className="mb-1 flex w-full items-center justify-between pl-1.5 pr-3">
        <div className="h-4 w-4">
          {user && (
            <img
              className="rounded-full"
              src={user.avatarUrl}
              alt={user.name || t('user.avatar')}
            />
          )}
        </div>
        <p className="text-xxs text-label-secondary">
          {t('gift.oneOfTotal', {
            total: Intl.NumberFormat(getLanguage(), { notation: 'compact' }).format(
              gift.totalAmount,
            ),
          })}
        </p>
      </div>

      <div className="m-auto mb-0.5 flex h-20 w-20 items-center justify-center p-1">{View}</div>

      <h2 className="text-balance px-3 text-center text-s font-medium">{gift.name}</h2>
    </article>
  );
}
