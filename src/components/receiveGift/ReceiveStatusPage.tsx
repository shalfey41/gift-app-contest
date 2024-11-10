import React, { useContext, useEffect } from 'react';
import { Prisma } from '@prisma/client';
import EventGetPayload = Prisma.EventGetPayload;
import EventInclude = Prisma.EventInclude;
import { PageContext } from '@/components/app/PageContext';
import useToast from '@/hooks/useToast';
import { getGiftAnimationBySymbol, giftPreviewIcon, parseError } from '@/components/utils';
import { useLottie } from 'lottie-react';
import giftPurchasedAnimation from '@/lottie/effect-gift-purchased.json';
import Button from '@/components/ui/Button';
import Loader from '@/components/ui/Loader';
import { ErrorCode, Page } from '@/modules/types';
import { Trans, useTranslation } from 'react-i18next';

type Props = {
  event?: EventGetPayload<{ include: EventInclude }> | null;
  isLoading: boolean;
  error?: ErrorCode;
};

export default function ReceiveStatusPage({ event, isLoading, error }: Props) {
  const { t } = useTranslation();
  const { setBottomBar, setRoute } = useContext(PageContext);
  const { showToast } = useToast();
  const giftAnimation = getGiftAnimationBySymbol(event?.gift.symbol);

  useEffect(() => {
    setBottomBar(
      <div className="grid gap-2 px-4">
        <Button size="large" onClick={() => setRoute({ page: Page.profile })}>
          {t('giftStatus.openProfile')}
        </Button>
      </div>,
    );

    if (!event) {
      return;
    }

    setTimeout(() => {
      showToast({
        iconSrc: giftPreviewIcon[event.gift.symbol],
        title: t('giftStatus.received.toast.title'),
        text: t('giftStatus.received.toast.message', {
          gift: event.gift.name,
          user: event.remitter?.name || t('user.anonymous'),
        }),
        buttonText: t('giftStatus.received.toast.button'),
        // todo send param to giftId
        onClick: () => setRoute({ page: Page.profile }),
      });
    }, 500);
  }, [t, setRoute, showToast, setBottomBar, event]);

  return (
    <div className="relative flex h-full flex-col items-center justify-center px-4 text-center">
      {(() => {
        if (isLoading) {
          return <Loader />;
        }

        if (error) {
          return <h1 className="mb-2 text-lg font-semibold">{t(parseError(error))}</h1>;
        }

        return (
          <>
            <Animations giftAnimation={giftAnimation} />
            <h1 className="mb-2 text-lg font-semibold">{t('giftStatus.received.page.title')}</h1>
            <p className="text-balance">
              <Trans
                i18nKey="giftStatus.received.page.message"
                values={{ gift: event?.gift.name }}
                components={[<span key="1" className="font-medium" />]}
              />
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
