import React, { PropsWithChildren } from 'react';
import classNames from 'classnames';

type Props = {
  left: React.ReactNode;
  subtitle: string;
  right?: React.ReactNode;
  separator?: boolean;
};

export default function Row({
  children,
  left,
  right,
  subtitle,
  separator = true,
}: PropsWithChildren<Props>) {
  return (
    <div className="flex items-center gap-3 px-4">
      <div className="py-3">
        <div className="h-10 w-10">{left}</div>
      </div>
      <div
        className={classNames('relative flex grow items-center gap-3 py-3', {
          'after:bg-separator/35 after:absolute after:bottom-0 after:block after:h-px after:w-full after:scale-y-[0.3]':
            separator,
        })}
      >
        <div className="grow">
          {Boolean(subtitle) && <p className="text-xs text-label-secondary">{subtitle}</p>}
          <p className="font-medium">{children}</p>
        </div>
        {right && <div>{right}</div>}
      </div>
    </div>
  );
}
