import React, { PropsWithChildren, ButtonHTMLAttributes } from 'react';
import classNames from 'classnames';

type Props = {
  iconPath?: string;
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'outline';
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  iconPath,
  children,
  className,
  size = 'small',
  variant = 'primary',
  ...rest
}: PropsWithChildren<Props>) {
  return (
    <button
      className={classNames(
        'flex items-center justify-center transition-opacity hover:enabled:opacity-80 disabled:bg-label-secondary',
        {
          'h-[30px] rounded-full px-4 py-1.5 text-xs font-semibold': size === 'small',
          'p-1 text-m': size === 'medium',
          'h-[50px] rounded-xl p-3.5 text-m font-semibold': size === 'large',
          'bg-primary text-white': variant === 'primary',
          'text-primary': variant === 'outline',
        },
        className,
      )}
      {...rest}
    >
      {Boolean(iconPath) && <img width={24} src={iconPath} alt="icon" />}
      {children}
    </button>
  );
}
