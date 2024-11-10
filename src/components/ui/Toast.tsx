import React, { PropsWithChildren } from 'react';
import classNames from 'classnames';
import Button from '@/components/ui/Button';
import Image from 'next/image';
import { motion } from 'framer-motion';

type Props = {
  iconSrc: string;
  title: string;
  text: string;
  buttonText?: string;
  onClick?: () => void;
  className?: string;
};

export default function Toast({
  iconSrc,
  buttonText,
  onClick,
  title,
  text,
  className,
}: PropsWithChildren<Props>) {
  return (
    <div
      className={classNames(
        'flex w-full items-center gap-3 rounded-[14px] bg-notification/80 px-4 py-3 text-s text-white dark:bg-black/80',
        className,
      )}
    >
      <motion.div
        key="toast-icon"
        className="h-[26px] w-[26px]"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Image width={26} height={26} src={iconSrc} alt="icon" />
      </motion.div>
      <div className="grow text-left">
        {Boolean(title) && <p className="font-semibold">{title}</p>}
        {Boolean(text) && <p>{text}</p>}
      </div>
      {buttonText && onClick && (
        <div>
          <Button className="text-accent-cyan" size="medium" variant="outline" onClick={onClick}>
            {buttonText}
          </Button>
        </div>
      )}
    </div>
  );
}
