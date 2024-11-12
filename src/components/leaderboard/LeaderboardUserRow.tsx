import React, { useEffect, useMemo, useRef, useState } from 'react';
import Row from '@/components/ui/Row';
import { LeaderboardProfile } from '@/modules/user/types';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

type Props = {
  profile: LeaderboardProfile;
  isCurrentUser?: boolean;
  separator?: boolean;
  onClick: () => void;
};

export default function LeaderboardUserRow({ profile, isCurrentUser, separator, onClick }: Props) {
  const { t } = useTranslation();
  const timeoutRef = useRef<number | null>(null);
  const [rowClassName, setRowClassName] = useState('');
  const place = useMemo(() => {
    switch (profile.place) {
      case 1:
        return <span className="text-[22px]/[22px] font-medium text-label-secondary">🥇</span>;
      case 2:
        return <span className="text-[22px]/[22px] font-medium text-label-secondary">🥈</span>;
      case 3:
        return <span className="text-[22px]/[22px] font-medium text-label-secondary">🥉</span>;
      default:
        return (
          <span className="text-[15px]/[22px] font-medium text-label-secondary">
            #{profile.place}
          </span>
        );
    }
  }, [profile]);

  useEffect(() => {
    // for smooth animation
    if (isCurrentUser) {
      timeoutRef.current = window.setTimeout(() => {
        setRowClassName(
          'currentUser sticky -bottom-px hover:opacity-100 before:absolute before:-top-px before:left-0 before:block before:h-px before:w-full before:scale-y-[0.3] before:bg-separator/35',
        );
      }, 250);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isCurrentUser]);

  return (
    <Row
      left={
        <motion.img
          layoutId={profile.id}
          className="rounded-full"
          src={profile.user.avatarUrl}
          alt={profile.user.name || t('user.avatar')}
        />
      }
      right={place}
      separator={separator}
      onClick={onClick}
      className={rowClassName}
    >
      <span className="flex items-center gap-1.5">
        <span className="block">{profile.user.name}</span>
        {isCurrentUser && (
          <span className="block rounded bg-label-secondary/20 px-1 text-[11px]/[14px] text-label-secondary">
            {t('user.you')}
          </span>
        )}
      </span>
      <span className="flex items-center gap-1.5 text-xs font-normal text-primary">
        <span className="block w-3">
          <svg fill="none" viewBox="0 0 45 48" xmlns="http://www.w3.org/2000/svg">
            <path
              d="m13.728 0.080879c-3.0262 0.41922-5.5484 2.7334-6.3505 5.8265-0.41659 1.6067-0.06917 3.8751 0.80597 5.262 0.20444 0.3239 0.47135 0.7679 0.59325 0.9865l0.22144 0.3977-2.8509-0.0142c-1.568-0.0079-2.647 0.0211-2.3975 0.0645l0.45355 0.0787-0.71015 0.0924c-1.2636 0.1642-2.504 1.1836-2.8506 2.3428-0.18154 0.6071-0.19322 7.3803-0.013834 8.0478 0.15364 0.5717 0.88058 1.4099 1.4951 1.724 0.23393 0.1197 0.77196 0.2677 1.1957 0.329 0.44687 0.0648 4.2144 0.1126 8.9733 0.1139l8.2029 0.0022-0.0389-6.2485-0.0389-6.2486h4.2468l-0.0026 6.2202-0.0026 6.2201h17.416l0.5927-0.2684c0.6186-0.2803 1.4152-1.0444 1.6456-1.5786 0.184-0.4266 0.2621-7.1348 0.0937-8.0509-0.1458-0.7936-0.5525-1.4092-1.3187-1.9968-0.8346-0.6399-1.3098-0.716-4.4717-0.716-1.5279 0-2.6504-0.0192-2.4945-0.0426 0.2293-0.0344 0.2456-0.0564 0.0857-0.1149-0.174-0.0636-0.1486-0.1405 0.2108-0.639 1.3925-1.9317 1.7532-4.3426 0.9941-6.6438-0.6759-2.0494-2.4464-3.9562-4.3279-4.6615-2.1793-0.81697-5.0603-0.74153-6.924 0.18144-1.209 0.59861-2.5215 1.9355-3.1351 3.1931-0.2495 0.51125-0.4864 0.93297-0.5263 0.93729-0.04 0.0042-0.158-0.20587-0.2623-0.46694-0.288-0.7212-1.2808-2.0954-1.9248-2.6645-0.7413-0.65473-2.1744-1.3643-3.1829-1.5758-0.7301-0.15303-2.5889-0.20177-3.4016-0.089071zm0.8913 4.2305c-1.2519 0.19586-2.4935 1.2153-2.8195 2.3149-0.4476 1.5099-0.0915 3.2819 0.8715 4.3375 1.1419 1.252 2.4178 1.5765 5.9324 1.5089l1.7008-0.0327-0.0301-1.761c-0.0366-2.123-0.1772-3.2678-0.473-3.8488-0.3273-0.64281-1.8233-2.1328-1.9818-1.9739-0.0365 0.03647-0.0663 0.00818-0.0663-0.06294 0-0.32538-2.0853-0.64598-3.134-0.48204zm13.932 0.00749c-0.8877 0.12975-1.7219 0.59169-2.4509 1.3575-1.1439 1.2016-1.4201 2.1951-1.4267 5.1325-0.0029 1.3107 0.0242 1.5606 0.1759 1.6189 0.0986 0.038 1.1876 0.069 2.42 0.069 1.9306 0 2.3303-0.0308 2.887-0.2228 1.0277-0.3542 1.759-0.8066 2.2934-1.4189 0.6867-0.7864 0.8923-1.4457 0.8874-2.8459-0.0045-1.3309-0.2076-1.91-0.9325-2.6584-0.5437-0.56135-1.1889-0.86515-2.1793-1.0261-0.8081-0.13145-0.8143-0.13145-1.6743-0.0058zm-11.568 8.3757c0.4183 0.0217 1.1326 0.0219 1.5874 2e-4 0.455-0.0216 0.1359 0.0162-0.7372 0.0161-0.8731-3e-4 -1.2684-0.0381-0.8502-0.0163zm-7.3653 15.338-6.038 0.0304v7.4349c0 4.9727 0.04139 7.6342 0.12485 8.0369 0.32383 1.5607 1.4797 3.1581 2.7268 3.7679 1.0875 0.5318 1.3922 0.5552 7.892 0.6069l6.1513 0.0489-0.0012-9.5795c-7e-4 -5.2687-0.0329-9.7712-0.0716-10.006l-0.0703-0.426-2.338 0.0274c-1.2858 0.0151-5.055 0.0411-8.3759 0.0578zm14.977 3.1804c0.0412 1.7344 0.0749 6.2208 0.0749 9.97l2e-4 6.8166 6.0946-0.0654c6.879-0.0739 7.0044-0.0879 8.2847-0.9236 0.8596-0.561 1.3695-1.1588 1.8308-2.1464 0.5242-1.1226 0.5823-2.1786 0.5464-9.9298l-0.0315-6.8166-8.4374-0.0291-8.4374-0.0292 0.0747 3.1535z"
              clipRule="evenodd"
              fill="currentColor"
              fillRule="evenodd"
            />
          </svg>
        </span>{' '}
        {t('leaderboard.gift', { count: profile.giftsReceived })}
      </span>
    </Row>
  );
}
