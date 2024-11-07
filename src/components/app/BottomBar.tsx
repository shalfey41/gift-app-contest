import React, { PropsWithChildren } from 'react';

export default function BottomBar({ children }: PropsWithChildren) {
  return (
    <div className="relative z-20 grid gap-2 bg-tab-bar py-2 before:absolute before:top-0 before:block before:h-px before:w-full before:scale-y-[0.5] before:bg-separator/35">
      {children}
    </div>
  );
}
