import React, { useContext, useEffect } from 'react';
import { PageContext } from '@/components/app/PageContext';
import MenuBar from '@/components/ui/menu/MenuBar';
import Loader from '@/components/ui/Loader';
import UserProfile from '@/components/ui/UserProfile';
import UserEvents from '@/components/ui/UserEvents';
import { LeaderboardProfile } from '@/modules/user/types';
import ThemeToggle from '@/components/profile/ThemeToggle';
import LanguageToggle from '@/components/profile/LanguageToggle';

type Props = {
  profile?: LeaderboardProfile | null;
  isLoading: boolean;
  goNext: () => void;
};

export default function UserProfilePage({ profile, goNext, isLoading }: Props) {
  const { setBottomBar } = useContext(PageContext);

  useEffect(() => {
    setBottomBar(<MenuBar />);
  }, [setBottomBar]);

  if (isLoading || !profile) {
    return (
      <div className="mt-10 flex w-full justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-start justify-between gap-4 px-4 pb-6 pt-2">
        <div>
          <ThemeToggle />
        </div>

        <UserProfile profile={profile} />

        <div>
          <LanguageToggle />
        </div>
      </div>

      <div className="mb-6 grid justify-items-center">
        <button onClick={goNext} className="flex items-center gap-0.5 text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 25 24" className="w-6">
            <path
              fill="currentColor"
              d="M13 20c-4.416 0-8-3.584-8-8s3.584-8 8-8 8 3.584 8 8-3.584 8-8 8Zm0-1.333A6.661 6.661 0 0 0 19.667 12 6.661 6.661 0 0 0 13 5.333 6.661 6.661 0 0 0 6.333 12 6.661 6.661 0 0 0 13 18.667Zm-4.102-5.82a.536.536 0 0 1-.549-.549c0-.306.235-.541.549-.541h3.553V7.012c0-.306.235-.541.541-.541a.54.54 0 0 1 .55.54v5.287a.54.54 0 0 1-.55.55H8.898Z"
            />
          </svg>
          <span>Recent Actions ›</span>
        </button>
      </div>

      <div className="mb-8 px-4">
        <UserEvents userId={profile.id} />
      </div>
    </>
  );
}
