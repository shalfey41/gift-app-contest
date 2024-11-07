'use client';

import { PropsWithChildren, useEffect, useState } from 'react';

export default function ClientComponentContainer({ children }: PropsWithChildren) {
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return isLoading ? null : children;
}
