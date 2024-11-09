import React, { PropsWithChildren, useContext } from 'react';
import classNames from 'classnames';
import Button from '@/components/ui/Button';
import { useLottie } from 'lottie-react';
import { PageContext } from '@/components/app/PageContext';

type Props = {
  className?: string;
};

export default function Popup({ className }: PropsWithChildren<Props>) {
  const { popup, setPopup, toggleBottomBar } = useContext(PageContext);
  const { View } = useLottie({
    animationData: popup?.animation,
    renderer: 'canvas',
    className: 'h-full w-full',
  });

  return (
    <div className={classNames('relative rounded-[10px] bg-secondary pb-2 pt-4', className)}>
      {popup?.onClose && (
        <button
          className="absolute right-4 top-3 flex h-[30px] w-[30px] items-center justify-center rounded-full bg-close-button text-close-icon transition-opacity hover:opacity-80"
          onClick={popup.onClose}
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

      <div className="grid justify-items-center px-4">
        <div className="mb-3 h-[150px] w-[150px]">{popup?.animation && View}</div>

        <h2 className="mb-6 text-lg font-semibold">{popup?.title}</h2>

        {popup?.tableData && (
          <table className="mb-4 border-collapse rounded-xl bg-white">
            <tbody>
              {popup.tableData.map(({ key, value }, i) => (
                <tr key={key}>
                  <td
                    className={classNames('px-4 py-2.5 text-label-secondary', {
                      'border-t': i !== 0,
                    })}
                  >
                    {key}
                  </td>
                  <td className={classNames('border-l px-4 py-2.5', { 'border-t': i !== 0 })}>
                    {value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {popup?.buttonText && popup?.onClick && (
        <div className="relative w-full py-2 pb-4 before:absolute before:top-0 before:block before:h-px before:w-full before:scale-y-[0.5] before:bg-separator/35">
          <div className="px-4">
            <Button
              size="large"
              className="w-full"
              onClick={() => {
                popup.onClick();
                setPopup(null);
                toggleBottomBar(true);
              }}
            >
              {popup.buttonText}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
