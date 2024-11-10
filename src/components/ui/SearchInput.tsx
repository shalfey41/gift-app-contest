import React, { useState } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

type Props = {
  value: string;
  onChange: (value: string) => void;
  variant?: 'default' | 'background';
};

export default function SearchInput({ value, onChange, variant = 'default' }: Props) {
  const { t } = useTranslation();
  const [isFocused, toggleFocus] = useState(false);
  const hasValue = value.length > 0;

  const hideKeyboard = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // @ts-ignore
    document.activeElement?.blur?.();
  };

  return (
    <form
      className={classNames(
        'relative before:absolute before:bottom-0 before:block before:h-px before:w-full before:scale-y-[0.5] before:bg-separator/35',
        { 'bg-tab-bar': variant === 'default' },
        { 'bg-background': variant === 'background' },
      )}
      onSubmit={hideKeyboard}
    >
      <div className="relative p-2.5">
        <div
          className={classNames(
            'pointer-events-none absolute inset-y-0 left-5 flex items-center transition-all duration-300',
            {
              '!left-1/2 !-translate-x-1/2': !isFocused && !hasValue,
            },
          )}
        >
          <div className="flex items-center gap-1.5">
            <svg
              className="h-4 w-4 shrink-0 text-separator/60"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
            {!hasValue && <p className="text-separator/60">{t('search')}</p>}
          </div>
        </div>
        <input
          type="search"
          inputMode="search"
          className="bg-close-button w-full rounded-[10px] p-2 pl-8 outline-none placeholder:text-separator/60"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onFocus={() => toggleFocus(true)}
          onBlur={() => toggleFocus(false)}
        />
      </div>
    </form>
  );
}
