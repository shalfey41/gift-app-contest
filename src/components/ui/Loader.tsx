import React, { HTMLAttributes } from 'react';
import classNames from 'classnames';

export default function Loader({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...rest}
      className={classNames(
        `inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-primary motion-reduce:animate-[spin_1.5s_linear_infinite]`,
        className,
      )}
      role="status"
    />
  );
}
