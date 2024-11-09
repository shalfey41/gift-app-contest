'use client';

import React, { PropsWithChildren } from 'react';

export default function AppError({ children }: PropsWithChildren) {
  return (
    <section className="grid h-full items-center justify-items-center">
      <p className="text-balance">{children}</p>
    </section>
  );
}
