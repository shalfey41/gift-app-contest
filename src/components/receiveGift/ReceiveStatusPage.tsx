import React, { useContext, useEffect } from 'react';
import { Prisma } from '@prisma/client';
import EventGetPayload = Prisma.EventGetPayload;
import EventInclude = Prisma.EventInclude;
import { Page, PageContext } from '@/components/app/PageContext';
import useToast from '@/hooks/useToast';
import { getGiftAnimationBySymbol, giftPreviewIcon, parseError } from '@/components/utils';
import { useLottie } from 'lottie-react';
import giftPurchasedAnimation from '@/lottie/effect-gift-purchased.json';
import Button from '@/components/ui/Button';
import Loader from '@/components/ui/Loader';
import { ErrorCode } from '@/modules/types';

type Props = {
  event?: EventGetPayload<{ include: EventInclude }> | null;
  isLoading: boolean;
  error?: ErrorCode;
};

export default function ReceiveStatusPage({ event, isLoading, error }: Props) {
  const { setBottomBar, setPage } = useContext(PageContext);
  const { showToast } = useToast();
  const giftAnimation = getGiftAnimationBySymbol(event?.gift.symbol);

  useEffect(() => {
    setBottomBar(
      <div className="grid gap-2 px-4">
        <Button size="large" onClick={() => setPage(Page.profile)}>
          Open Profile
        </Button>
      </div>,
    );

    if (!event) {
      return;
    }

    setTimeout(() => {
      showToast({
        iconSrc: giftPreviewIcon[event.gift.symbol],
        title: 'Gift Received',
        text: `${event.gift.name} from ${event.remitter?.name || 'Anonymous'}`,
        buttonText: 'View',
        // todo send param to giftId
        onClick: () => setPage(Page.profile),
      });
    }, 500);
  }, [setPage, showToast, setBottomBar, event]);

  return (
    <div className="relative flex h-full flex-col items-center justify-center px-4 text-center">
      {(() => {
        if (isLoading) {
          return <Loader />;
        }

        if (error) {
          return <h1 className="mb-2 text-lg font-semibold">{parseError(error)}</h1>;
        }

        return (
          <>
            <Animations giftAnimation={giftAnimation} />
            <h1 className="mb-2 text-lg font-semibold">Gift Received</h1>
            <p className="text-balance">
              <span>
                You have received the gift <span className="font-medium">{event?.gift.name}</span>.
              </span>
            </p>
          </>
        );
      })()}
    </div>
  );
}

const Animations = ({ giftAnimation }: { giftAnimation: any }) => {
  const { View: GiftAnimation } = useLottie({
    animationData: giftAnimation,
    loop: false,
    renderer: 'canvas',
    className: 'h-[100px] w-[100px]',
  });
  const { View: BackgroundAnimation } = useLottie({
    animationData: giftPurchasedAnimation,
    renderer: 'canvas',
    loop: false,
    className: 'absolute top-0 left-0 aspect-square w-full',
  });

  return (
    <>
      {BackgroundAnimation}
      <div className="mb-4">{GiftAnimation}</div>
    </>
  );
};
