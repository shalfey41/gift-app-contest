import React from 'react';
import { MainButton, BackButton } from '@twa-dev/sdk/react';
import { UserGift } from '@/modules/event/types';

type Props = {
  selectedGift: UserGift;
  goBack: () => void;
  goNext: () => void;
};

export default function SendStatusPage({ selectedGift, goBack, goNext }: Props) {
  return (
    <div>
      <div className="rounded border">
        <h2>Gift Sent</h2>
        <p>The {selectedGift.gift.name} gift was sent to THE USER.</p>
      </div>

      <BackButton onClick={() => goBack()} />
      <MainButton text="Send Gift" onClick={() => goNext()} />
    </div>
  );
}
