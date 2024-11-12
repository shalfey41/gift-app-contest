import React, { PropsWithChildren, useContext, useRef } from 'react';
import classNames from 'classnames';
import Button from '@/components/ui/Button';
import { useLottie } from 'lottie-react';
import { PageContext } from '@/components/app/PageContext';
import { motion } from 'framer-motion';
import giftStarsAnimation from '@/lottie/effect-stars.json';

type Props = {
  className?: string;
};

export default function Popup({ className }: PropsWithChildren<Props>) {
  const { popup, setPopup, toggleBottomBar } = useContext(PageContext);
  const data = useRef(popup);
  const { View } = useLottie({
    animationData: data.current?.animation,
    className: 'h-full w-full',
    loop: false,
  });
  const { View: BackgroundAnimation } = useLottie({
    animationData: giftStarsAnimation,
    renderer: 'canvas',
    className: 'absolute top-0 left-0 w-full',
  });

  return (
    <div
      className={classNames(
        'relative rounded-[10px] bg-secondary pb-2 pt-4 dark:bg-background',
        className,
      )}
    >
      {data.current?.onClose && (
        <button
          className="absolute right-4 top-3 z-10 flex h-[30px] w-[30px] items-center justify-center rounded-full bg-close-button text-close-icon transition-opacity hover:opacity-80 dark:bg-secondary dark:text-label-secondary"
          onClick={data.current.onClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="h-5 w-5"
          >
            <rect
              width="2"
              height="16"
              x="16.95"
              y="5.636"
              fill="currentColor"
              rx="1"
              transform="rotate(45 16.95 5.636)"
            />
            <rect
              width="2"
              height="16"
              x="18.364"
              y="16.95"
              fill="currentColor"
              rx="1"
              transform="rotate(135 18.364 16.95)"
            />
          </svg>
        </button>
      )}

      <div className="relative grid justify-items-center px-4">
        {BackgroundAnimation}
        <div className="mb-3 h-[150px] w-[150px]">
          {data.current?.animation && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="size-full"
            >
              {View}
            </motion.div>
          )}
        </div>

        <h2 className="mb-6 text-lg font-semibold">{data.current?.title}</h2>

        {data.current?.tableData && (
          <table className="mb-4 w-full border-collapse rounded-xl bg-white dark:bg-secondary">
            <tbody>
              {data.current.tableData.map(({ key, value }, i) => (
                <tr key={key}>
                  <td
                    className={classNames('px-4 py-2.5 text-label-secondary dark:border-white/10', {
                      'border-t': i !== 0,
                    })}
                  >
                    {key}
                  </td>
                  <td
                    className={classNames('border-l px-4 py-2.5 dark:border-white/10', {
                      'border-t': i !== 0,
                    })}
                  >
                    {value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {data.current?.buttonText && data.current?.onClick && (
        <div className="relative w-full py-2 pb-4 before:absolute before:top-0 before:block before:h-px before:w-full before:scale-y-[0.5] before:bg-separator/35">
          <div className="px-4">
            <Button
              size="large"
              className="w-full"
              onClick={() => {
                data.current?.onClick();
                setPopup(null);
                toggleBottomBar(true);
              }}
            >
              {data.current.buttonText}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
