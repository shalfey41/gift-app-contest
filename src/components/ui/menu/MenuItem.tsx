import React from 'react';
import classNames from 'classnames';
import { useLottie } from 'lottie-react';
import './style.css';

export default function MenuItem({
  animation,
  label,
  isActive,
  onClick,
}: {
  animation: unknown;
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  const { View, goToAndPlay } = useLottie({
    animationData: animation,
    loop: false,
    autoplay: false,
    className: 'menu-item-animation',
  });

  const playAnimationOnce = () => {
    goToAndPlay(0);
    onClick();
  };

  return (
    <button
      className="grid justify-items-center font-medium transition-colors hover:opacity-80"
      onClick={playAnimationOnce}
    >
      <span
        className={classNames(
          'flex h-[26px] w-[26px] items-center justify-center text-icons dark:text-white/40',
          {
            '!text-primary': isActive,
          },
        )}
      >
        {View}
      </span>
      <span
        className={classNames(
          'mt-1 flex text-[10px]/[12px] text-label-tab-bar/65 dark:text-white/40',
          {
            '!text-primary': isActive,
          },
        )}
      >
        {label}
      </span>
    </button>
  );
}
