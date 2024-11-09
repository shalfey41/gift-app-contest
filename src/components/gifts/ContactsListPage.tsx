import React, { useCallback, useContext, useEffect } from 'react';
import { BackButton } from '@twa-dev/sdk/react';
import WebApp from '@twa-dev/sdk';
import { useDebounce } from 'use-debounce';
import { UserGift } from '@/modules/event/types';
import { useBotInfoQuery } from '@/queries/useBotQuery';
import { useCurrentUserQuery, useUsersWithoutMeQuery } from '@/queries/useUserQuery';
import { useBoughtGiftsByUserIdQueryKey, useSendGiftMutation } from '@/queries/useEventQuery';
import Button from '@/components/ui/Button';
import { PageContext } from '@/components/app/PageContext';
import SearchInput from '@/components/ui/SearchInput';
import { getCssVar } from '@/components/utils';
import Row from '@/components/ui/Row';
import { User } from '@prisma/client';
import { useQueryClient } from '@tanstack/react-query';

type Props = {
  selectedGift: UserGift;
  goBack: () => void;
  goNext: (eventId: string) => void;
};

export default function ContactsListPage({ selectedGift, goBack, goNext }: Props) {
  const { setBottomBar } = useContext(PageContext);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);
  const { data: botInfo } = useBotInfoQuery();
  const { data: user } = useCurrentUserQuery();
  const { data: users } = useUsersWithoutMeQuery(user?.id, debouncedSearchQuery);
  const sendGiftMutation = useSendGiftMutation();
  const queryClient = useQueryClient();

  const sendGift = useCallback(
    async (selectedUser: User) => {
      if (!user?.id) {
        return;
      }

      WebApp.showConfirm(
        `You're going to send the gift of ${selectedGift.gift.name} to ${selectedUser.name}`,
        (isConfirmed) => {
          if (!isConfirmed) {
            return;
          }

          (async () => {
            try {
              const event = await sendGiftMutation.mutateAsync({
                buyEventId: selectedGift.id,
                giftId: selectedGift.gift.id,
                remitterId: user.id,
                beneficiaryId: selectedUser.id,
              });

              if (event?.id) {
                queryClient.invalidateQueries({ queryKey: [useBoughtGiftsByUserIdQueryKey] });
                goNext(event.id);
              } else {
                WebApp.showAlert('Error happened');
                goBack();
              }
            } catch (error) {
              console.error(error);
              WebApp.showAlert('Error happened');
              goBack();
            }
          })();
        },
      );
    },
    [goBack, goNext, queryClient, selectedGift, sendGiftMutation, user],
  );

  const copyContent = useCallback(async () => {
    await navigator.clipboard.writeText(`@${botInfo?.username} ${selectedGift.id}`);
    WebApp.close();
  }, [botInfo, selectedGift]);

  useEffect(() => {
    setBottomBar(
      <div className="grid justify-items-center gap-2 px-4 pt-2">
        <h2 className="mb-1 font-semibold">Select a user from the list or…</h2>

        <ol className="mb-2 list-decimal text-balance px-6 text-m/[25px]">
          <li>Open a chat with your friend</li>
          <li>
            Send them the following message:
            <br />
            <span className="text-nowrap rounded border border-primary bg-primary/10 p-0.5 text-s text-primary">
              {botInfo?.username ? `@${botInfo?.username}` : ''} {selectedGift.id}
            </span>
          </li>
          <li>Done! Your friend will receive the gift</li>
        </ol>

        <Button size="large" className="w-full" onClick={() => copyContent()} disabled={!botInfo}>
          Copy the message
        </Button>
      </div>,
    );
  }, [botInfo, copyContent, selectedGift, setBottomBar]);

  useEffect(() => {
    WebApp.setHeaderColor(getCssVar('--color-bg-tab-bar'));

    return () => {
      WebApp.setHeaderColor(getCssVar('--white'));
    };
  }, []);

  return (
    <>
      <SearchInput value={searchQuery} onChange={setSearchQuery} />
      <div className="mb-6">
        {Array.isArray(users?.list) &&
          users?.list.map((user) => (
            <Row
              py={1}
              key={user.id}
              left={<img className="rounded-full" src={user.avatarUrl} alt={user.name} />}
              onClick={() => {
                if (sendGiftMutation.isPending || sendGiftMutation.isSuccess) {
                  return;
                }

                sendGift(user);
              }}
            >
              <span>
                {user.name}{' '}
                {user.telegramId < 0 && (
                  <span className="font-normal text-label-secondary">(not real user)</span>
                )}
              </span>
            </Row>
          ))}
      </div>

      <BackButton onClick={() => goBack()} />
    </>
  );
}
