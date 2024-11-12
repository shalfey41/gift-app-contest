import React, { useContext, useEffect } from 'react';
import { PageContext } from '@/components/app/PageContext';
import { LeaderboardProfile } from '@/modules/user/types';
import MenuBar from '@/components/ui/menu/MenuBar';
import Loader from '@/components/ui/Loader';
import { BackButton } from '@twa-dev/sdk/react';
import UserProfile from '@/components/ui/UserProfile';
import UserEvents from '@/components/ui/UserEvents';

type Props = {
  profile: LeaderboardProfile | null;
  goBack: () => void;
};

export default function LeaderboardProfilePage({ goBack, profile }: Props) {
  const { setBottomBar, popup } = useContext(PageContext);

  useEffect(() => {
    setBottomBar(<MenuBar />);
  }, [setBottomBar]);

  if (!profile) {
    return (
      <div className="mt-10 flex w-full justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-start justify-center gap-4 px-4 pb-6 pt-2">
        <UserProfile profile={profile} layoutId={profile.id} />
      </div>

      <div className="mb-8 px-4">
        <UserEvents userId={profile.user.id} />
      </div>

      <BackButton
        onClick={() => {
          if (!popup) {
            goBack();
          }
        }}
      />
    </>
  );
}
