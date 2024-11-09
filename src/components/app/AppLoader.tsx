'use client';

import React from 'react';
import { useLottie } from 'lottie-react';
import animation from '@/lottie/emoji-balloons.json';

export default function AppLoader() {
  const { View } = useLottie({
    animationData: animation,
    renderer: 'canvas',
    className: 'w-full h-full',
  });

  return (
    <section className="grid h-full items-center justify-items-center">
      <div className="h-[100px] w-[100px]">{View}</div>
    </section>
  );
}
