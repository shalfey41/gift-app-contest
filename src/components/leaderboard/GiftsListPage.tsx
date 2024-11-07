import React from 'react';
import { UserGift } from '@/modules/event/types';

type Props = {
  userGifts: UserGift[];
  selectUserGift: (userGift: UserGift) => void;
};

export default function GiftsListPage({ userGifts, selectUserGift }: Props) {
  return (
    <div className="grid grid-cols-2 gap-2 p-2">
      {userGifts.map((userGift) => {
        return (
          <div key={userGift.id} className="rounded border">
            <p>{userGift.gift.name}</p>
            <button onClick={() => selectUserGift(userGift)}>Send</button>
          </div>
        );
      })}
    </div>
  );
}
