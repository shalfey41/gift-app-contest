import React, { PropsWithChildren } from 'react';
import classNames from 'classnames';
import { motion } from 'framer-motion';

type Props = {
  left: React.ReactNode;
  subtitle?: string;
  right?: React.ReactNode;
  separator?: boolean;
  py?: number;
  onClick?: () => void;
  className?: string;
};

export default function Row({
  children,
  left,
  right,
  subtitle,
  className,
  separator = true,
  py = 3,
  onClick,
  ...rest
}: PropsWithChildren<Props>) {
  return (
    <motion.div
      layout
      {...rest}
      className={classNames(
        'flex items-center gap-3 bg-background px-4',
        {
          'cursor-pointer transition-opacity hover:opacity-80': onClick,
        },
        className,
      )}
      onClick={() => onClick?.()}
    >
      <div className={`py-${py}`}>
        <div className="h-10 w-10">{left}</div>
      </div>
      <div
        className={classNames(`relative flex grow items-center gap-3 py-3`, {
          'after:absolute after:bottom-0 after:block after:h-px after:w-full after:scale-y-[0.5] after:bg-separator/35':
            separator,
        })}
      >
        <div className="grow">
          {Boolean(subtitle) && <p className="text-xs text-label-secondary">{subtitle}</p>}
          <p className="font-medium">{children}</p>
        </div>
        {right && <div>{right}</div>}
      </div>
    </motion.div>
  );
}
