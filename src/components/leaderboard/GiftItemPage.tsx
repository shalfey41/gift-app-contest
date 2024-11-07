import React from 'react';
import { MainButton, BackButton } from '@twa-dev/sdk/react';
import { UserGift } from '@/modules/event/types';

type Props = {
  selectedGift: UserGift;
  goNext: () => void;
  goBack: () => void;
};

export default function GiftItemPage({ selectedGift, goNext, goBack }: Props) {
  return (
    <div>
      <h2>Send Gift</h2>

      <table>
        <tbody>
          <tr>
            <td>Gift</td>
            <td>{selectedGift.gift.name}</td>
          </tr>
          <tr>
            <td>Date</td>
            <td>
              {new Intl.DateTimeFormat('en', {
                dateStyle: 'long',
                timeStyle: 'short',
              }).format(selectedGift.boughtAt)}
            </td>
          </tr>
          <tr>
            <td>Price</td>
            <td>
              {selectedGift.gift.price} {selectedGift.gift.asset}
            </td>
          </tr>
          <tr>
            <td>Availability</td>
            <td>
              {selectedGift.gift.availableAmount} of {selectedGift.gift.totalAmount}
            </td>
          </tr>
        </tbody>
      </table>

      <BackButton onClick={() => goBack()} />
      <MainButton text="Send Gift to Contact" onClick={() => goNext()} />
    </div>
  );
}
