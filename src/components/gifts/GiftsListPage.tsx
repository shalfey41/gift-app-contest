import React, { useContext, useEffect } from 'react';
import { UserGift } from '@/modules/event/types';
import Loader from '@/components/ui/Loader';
import { Pagination } from '@/modules/types';
import GiftCard from '@/components/gifts/GiftCard';
import ListEmpty from '@/components/ui/ListEmpty';
import { Page, PageContext } from '@/components/app/PageContext';
import MenuBar from '@/components/ui/menu/MenuBar';

type Props = {
  userGifts?: Pagination<UserGift> | null;
  goNext: (userGift: UserGift) => void;
  isLoading: boolean;
};

export default function GiftsListPage({ userGifts, goNext, isLoading }: Props) {
  const { setPage, setBottomBar } = useContext(PageContext);

  useEffect(() => {
    setBottomBar(<MenuBar />);
  }, [setBottomBar]);

  return (
    <section className="px-4 pb-4">
      <div className="mb-8 mt-6 grid justify-items-center gap-2 text-balance text-center">
        <h1 className="text-lg font-semibold">Send Gifts in Telegram</h1>
        <p className="text-label-secondary">
          Send gifts to users that can be stored in their app profile.
        </p>
      </div>

      {(() => {
        if (isLoading) {
          return (
            <div className="flex w-full justify-center">
              <Loader />
            </div>
          );
        }

        if (!userGifts || !userGifts.list.length) {
          return (
            <ListEmpty
              title={`You don't have any gifts yet.`}
              onClick={() => setPage(Page.store)}
            />
          );
        }

        return (
          <div className="grid grid-cols-3 gap-2">
            {userGifts.list.map((userGift) => {
              return (
                <GiftCard
                  key={userGift.id}
                  gift={userGift.gift}
                  selectGift={() => goNext(userGift)}
                />
              );
            })}
          </div>
        );
      })()}
    </section>
  );
}
