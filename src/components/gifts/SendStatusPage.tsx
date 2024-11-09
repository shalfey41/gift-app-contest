import React, { useContext, useEffect, useMemo } from 'react';
import { BackButton } from '@twa-dev/sdk/react';
import { Prisma } from '@prisma/client';
import EventGetPayload = Prisma.EventGetPayload;
import EventInclude = Prisma.EventInclude;
import { Page, PageContext } from '@/components/app/PageContext';
import useToast from '@/hooks/useToast';
import { getGiftAnimationBySymbol, giftPreviewIcon } from '@/components/utils';
import { useLottie } from 'lottie-react';
import giftPurchasedAnimation from '@/lottie/effect-gift-purchased.json';
import Button from '@/components/ui/Button';
import Loader from '@/components/ui/Loader';
import { useCurrentUserQuery } from '@/queries/useUserQuery';

type Props = {
  event?: EventGetPayload<{ include: EventInclude }> | null;
  isLoading: boolean;
  goBack: () => void;
};

export default function SendStatusPage({ event, isLoading, goBack }: Props) {
  const { setBottomBar, setPage } = useContext(PageContext);
  const { data: currentUser, isLoading: isLoadingCurrentUser } = useCurrentUserQuery();
  const { showToast } = useToast();
  const giftAnimation = getGiftAnimationBySymbol(event?.gift.symbol);
  const showAnimation = useMemo(() => {
    if (!event || !currentUser) {
      return false;
    }

    return currentUser.id === event.remitterId || currentUser.id === event.beneficiaryId;
  }, [currentUser, event]);
  const toastMessage = useMemo(() => {
    if (!event || !currentUser) {
      return null;
    }

    if (currentUser.id === event.remitterId) {
      return {
        title: 'Gift Sent',
        text: `${event.gift.name} to ${event.beneficiary?.name || 'Anonymous'}`,
      };
    }

    if (currentUser.id === event.beneficiaryId) {
      return {
        title: 'Gift Received',
        text: `${event.gift.name} from ${event.remitter?.name || 'Anonymous'}`,
        buttonText: 'View',
      };
    }

    return null;
  }, [currentUser, event]);
  const pageMessage = useMemo(() => {
    if (!event || !currentUser) {
      return null;
    }

    if (currentUser.id === event.remitterId) {
      return {
        title: 'Gift Sent',
        text: (
          <span>
            You have sent the gift <span className="font-medium">{event.gift.name}</span>.
          </span>
        ),
      };
    }

    if (currentUser.id === event.beneficiaryId) {
      return {
        title: 'Gift Received',
        text: (
          <span>
            You have received the gift <span className="font-medium">{event.gift.name}</span>.
          </span>
        ),
      };
    }

    return {
      title: `Looks like you've landed on the wrong page`,
      text: (
        <span>
          Are you a <span className="font-medium">hacker?</span>
        </span>
      ),
    };
  }, [currentUser, event]);

  useEffect(() => {
    setBottomBar(
      <div className="grid gap-2 px-4">
        <Button size="large" onClick={() => setPage(Page.profile)}>
          Open Profile
        </Button>
      </div>,
    );

    if (!event || !toastMessage) {
      return;
    }

    setTimeout(() => {
      showToast({
        iconSrc: giftPreviewIcon[event.gift.symbol],
        title: toastMessage.title,
        text: toastMessage.text,
        buttonText: toastMessage.buttonText,
        // todo send param to giftId
        onClick: () => setPage(Page.profile),
      });
    }, 500);
  }, [setPage, showToast, setBottomBar, event, toastMessage]);

  return (
    <div className="relative flex h-full flex-col items-center justify-center px-4 text-center">
      {(() => {
        if (isLoading || isLoadingCurrentUser) {
          return <Loader />;
        }

        return (
          <>
            {showAnimation && <Animations giftAnimation={giftAnimation} />}
            {pageMessage && (
              <>
                <h1 className="mb-2 text-lg font-semibold">{pageMessage.title}</h1>
                <p className="text-balance">{pageMessage.text}</p>
              </>
            )}
          </>
        );
      })()}

      <BackButton onClick={() => goBack()} />
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
