import React from 'react';
import Button from '@/components/ui/Button';
import { useLottie } from 'lottie-react';
import animation from '@/lottie/emoji-balloons.json';
import { useTranslation } from 'react-i18next';

type Props = {
  title: string;
  onClick: () => void;
};

export default function ListEmpty({ title, onClick }: Props) {
  const { t } = useTranslation();
  const { View } = useLottie({
    animationData: animation,
    renderer: 'canvas',
    className: 'w-full h-full',
    loop: false,
  });

  return (
    <div className="grid justify-items-center rounded-xl bg-secondary px-4 py-8">
      <div className="mb-4 h-[100px] w-[100px]">{View}</div>
      <h2 className="mb-3 text-balance text-center">{title}</h2>
      <Button variant="outline" size="medium" onClick={onClick}>
        {t('gift.openStore')}
      </Button>
    </div>
  );
}
