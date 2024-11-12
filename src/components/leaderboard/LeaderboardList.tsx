import React, { Fragment, useContext, useRef } from 'react';
import { PageContext } from '@/components/app/PageContext';
import { LeaderboardProfile } from '@/modules/user/types';
import LeaderboardUserRow from '@/components/leaderboard/LeaderboardUserRow';
import { useInView } from 'framer-motion';
import './style.css';

type Props = {
  leaderboard: LeaderboardProfile[];
  me: LeaderboardProfile;
  goNext: (profile: LeaderboardProfile) => void;
  showMyRow: boolean;
};

export default function LeaderboardList({ goNext, showMyRow, leaderboard, me }: Props) {
  const { bottomBarHeight } = useContext(PageContext);
  const stickyTrigger = useRef<HTMLDivElement>(null);
  const isStickyTriggerVisible = useInView(stickyTrigger, {
    // @ts-ignore
    margin: `0px 0px -${bottomBarHeight}px`,
  });

  return (
    <div className={isStickyTriggerVisible ? 'stickyTrigger' : ''}>
      {leaderboard.map((profile, index) => (
        <Fragment key={profile.id}>
          {profile.id === me.id && (
            <div ref={stickyTrigger} className="invisible bottom-0 h-px w-full" />
          )}
          <LeaderboardUserRow
            profile={profile}
            isCurrentUser={profile.id === me.id}
            separator={index !== leaderboard.length - 1 && !showMyRow}
            onClick={() => goNext(profile)}
          />
        </Fragment>
      ))}
      {showMyRow && (
        <>
          <div ref={stickyTrigger} className="invisible bottom-0 h-px w-full" />
          <LeaderboardUserRow
            profile={me}
            isCurrentUser
            separator={false}
            onClick={() => goNext(me)}
          />
        </>
      )}
    </div>
  );
}
