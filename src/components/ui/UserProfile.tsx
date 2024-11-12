import React from 'react';
import { LeaderboardProfile } from '@/modules/user/types';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import classNames from 'classnames';

type Props = {
  profile: LeaderboardProfile;
  layoutId?: string;
};

const prizePlace: Record<string, string> = {
  1: '🥇',
  2: '🥈',
  3: '🥉',
};

export default function UserProfile({ profile, layoutId }: Props) {
  const { t } = useTranslation();

  return (
    <div className="grid w-full max-w-52 justify-items-center text-center">
      <div className="relative mb-5">
        <div className="h-[100px] w-[100px]">
          <motion.img
            layoutId={layoutId}
            className="rounded-full"
            src={profile.user.avatarUrl}
            alt={profile.user?.name || t('user.avatar')}
          />
        </div>
        <span
          className={classNames(
            'absolute left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white px-2 text-s font-medium text-white dark:border-background',
            {
              'bg-label-secondary': profile.place > 3,
              'bg-accent-gold': profile.place <= 3,
            },
          )}
        >
          #{profile.place}
        </span>
      </div>
      <h1 className="mb-1 text-lg font-semibold">
        {profile.user.name}
        {prizePlace[profile.place] ? prizePlace[profile.place] : ''}
      </h1>
      <p className="text-label-secondary">
        {t('user.giftReceived', { count: profile.giftsReceived })}
      </p>
    </div>
  );
}
