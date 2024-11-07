import React, { HTMLAttributes } from 'react';
import classNames from 'classnames';
import './style.css';

type Props = { width?: number } & HTMLAttributes<HTMLDivElement>;

export default function Loader({ width = 50, className, ...rest }: Props) {
  return <div {...rest} className={classNames('loader', className)} style={{ width }} />;
}
