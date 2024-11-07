import React from 'react';
import { MainButton, BackButton } from '@twa-dev/sdk/react';
import WebApp from '@twa-dev/sdk';
import { useDebounce } from 'use-debounce';
import { UserGift } from '@/modules/event/types';
import { useBotInfoQuery } from '@/queries/useBotQuery';
import { useCurrentUserQuery, useUsersWithoutMeQuery } from '@/queries/useUserQuery';
import { useSendGiftMutation } from '@/queries/useEventQuery';

type Props = {
  selectedGift: UserGift;
  goBack: () => void;
  goNext: () => void;
};

export default function ContactsListPage({ selectedGift, goBack }: Props) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);
  const { data: botInfo } = useBotInfoQuery();
  const { data: user } = useCurrentUserQuery();
  const { data: users } = useUsersWithoutMeQuery(user?.id, debouncedSearchQuery);
  const sendGiftMutation = useSendGiftMutation();

  const sendGift = async (beneficiaryId: string) => {
    if (!user?.id) {
      return;
    }

    try {
      await sendGiftMutation.mutateAsync({
        buyEventId: selectedGift.id,
        giftId: selectedGift.gift.id,
        remitterId: user.id,
        beneficiaryId,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const copyContent = async () => {
    await navigator.clipboard.writeText(`@${botInfo?.username} ${selectedGift.id}`);
    WebApp.close();
  };

  return (
    <div>
      <div>
        <input
          type="text"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
        />
        {Array.isArray(users?.list) &&
          users?.list.map((user) => (
            <div key={user.id}>
              <img src={user.avatarUrl} alt={user.name} />
              <span>{user.name}</span>
              <button onClick={() => sendGift(user.id)}>Send gift</button>
            </div>
          ))}
      </div>
      <div>
        <ol>
          <li>Find user from you contacts</li>
          <li>
            Type {botInfo?.username ? `@${botInfo?.username}` : ''} {selectedGift.id}
          </li>
          <li>Send the message</li>
          <li>Profit! The user will receive you gift</li>
        </ol>
      </div>

      <BackButton onClick={() => goBack()} />
      <MainButton
        disabled={!botInfo}
        text="Copy command"
        hasShineEffect
        onClick={() => copyContent()}
      />
    </div>
  );
}
