import React from 'react';
import { LeaderboardProfile } from '@/modules/user/types';
import { useTranslation } from 'react-i18next';

type Props = {
  profile: LeaderboardProfile;
};

const prizePlace: Record<string, string> = {
  1: '🥇',
  2: '🥈',
  3: '🥉',
};

export default function UserProfile({ profile }: Props) {
  const { t } = useTranslation();

  return (
    <div className="grid w-full max-w-52 justify-items-center text-center">
      <div className="relative mb-5">
        <div className="h-[100px] w-[100px]">
          <img
            className="rounded-full"
            src={profile.user.avatarUrl}
            alt={profile.user?.name || t('user.avatar')}
          />
        </div>
        {profile.place > 3 && (
          <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-label-secondary px-2 text-s font-medium text-white dark:border-background">
            #{profile.place}
          </span>
        )}
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
