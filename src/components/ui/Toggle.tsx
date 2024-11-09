import React from 'react';
import classNames from 'classnames';

type Props = {
  isChecked: boolean;
  onChange: (isChecked: boolean) => void;
  icons: React.ReactNode[];
};

export default function Toggle({ isChecked, onChange, icons }: Props) {
  return (
    <label className="relative flex cursor-pointer items-center transition-opacity hover:opacity-80">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={() => onChange(!isChecked)}
        className="peer sr-only"
      />
      <div className="peer grid h-8 w-20 grid-cols-2 rounded-full bg-secondary after:absolute after:left-0.5 after:top-0.5 after:z-0 after:h-[28px] after:w-[38px] after:rounded-full after:border after:border-black/5 after:bg-white after:shadow-toggle after:transition-transform peer-checked:after:translate-x-full">
        {icons.map((icon, index) => (
          <div
            key={index}
            className={classNames(
              'relative z-10 flex items-center justify-center transition-colors',
              {
                'text-label-secondary': isChecked !== Boolean(index),
                'text-black': isChecked === Boolean(index),
              },
            )}
          >
            {icon}
          </div>
        ))}
      </div>
    </label>
  );
}
