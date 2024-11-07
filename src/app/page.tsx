import React from 'react';
import ClientComponentContainer from '@/components/app/ClientComponentContainer';
import WebAppWrapper from '@/components/app/WebAppWrapper';
import App from '@/components/app/App';

export default function Page() {
  return (
    <ClientComponentContainer>
      <WebAppWrapper>
        <App />
      </WebAppWrapper>
    </ClientComponentContainer>
  );
}
