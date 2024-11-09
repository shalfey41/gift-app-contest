import React from 'react';
import Button from '@/components/ui/Button';
import { useLottie } from 'lottie-react';
import animation from '@/lottie/emoji-balloons.json';

type Props = {
  title: string;
  onClick: () => void;
};

export default function ListEmpty({ title, onClick }: Props) {
  const { View } = useLottie({
    animationData: animation,
    renderer: 'canvas',
    className: 'w-full h-full',
    loop: false,
  });

  return (
    <div className="grid justify-items-center rounded-xl bg-secondary px-4 py-8">
      <div className="mb-4 h-[100px] w-[100px]">{View}</div>
      <h2 className="mb-3">{title}</h2>
      <Button variant="outline" size="medium" onClick={onClick}>
        Open Store
      </Button>
    </div>
  );
}
