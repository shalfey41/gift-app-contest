import React, { useState } from 'react';
import Toggle from '@/components/ui/Toggle';
import { changeLanguage, getLanguage } from '@/modules/i18n/client';

export default function LanguageToggle() {
  const [isRussianLanguage, toggleRussianLanguage] = useState(getLanguage() === 'ru');

  const toggleLanguage = (russianLanguage: boolean) => {
    const lang = russianLanguage ? 'ru' : 'en';
    toggleRussianLanguage(russianLanguage);

    changeLanguage(lang);
  };

  return (
    <Toggle
      isChecked={isRussianLanguage}
      onChange={toggleLanguage}
      icons={[
        <span key="en" className="pl-0.5 text-s font-semibold uppercase">
          en
        </span>,
        <span key="ru" className="text-s font-semibold uppercase">
          ru
        </span>,
      ]}
    />
  );
}
