import React, { useContext, useEffect, useMemo } from 'react';
import { BackButton } from '@twa-dev/sdk/react';
import { Prisma } from '@prisma/client';
import EventGetPayload = Prisma.EventGetPayload;
import EventInclude = Prisma.EventInclude;
import { PageContext } from '@/components/app/PageContext';
import useToast from '@/hooks/useToast';
import { getGiftAnimationBySymbol, giftPreviewIcon } from '@/components/utils';
import { useLottie } from 'lottie-react';
import giftPurchasedAnimation from '@/lottie/effect-gift-purchased.json';
import Button from '@/components/ui/Button';
import Loader from '@/components/ui/Loader';
import { useCurrentUserQuery } from '@/queries/useUserQuery';
import { Page } from '@/modules/types';
import { Trans, useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

type Props = {
  event?: EventGetPayload<{ include: EventInclude }> | null;
  isLoading: boolean;
  goBack: () => void;
};

export default function SendStatusPage({ event, isLoading, goBack }: Props) {
  const { setBottomBar, setRoute } = useContext(PageContext);
  const { t } = useTranslation();
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
        title: t('giftStatus.sent.toast.title'),
        text: t('giftStatus.sent.toast.message', {
          gift: event.gift.name,
          user: event.beneficiary?.name || t('user.anonymous'),
        }),
      };
    }

    if (currentUser.id === event.beneficiaryId) {
      return {
        title: t('giftStatus.received.toast.title'),
        text: t('giftStatus.received.toast.message', {
          gift: event.gift.name,
          user: event.beneficiary?.name || t('user.anonymous'),
        }),
        buttonText: t('giftStatus.received.toast.button'),
      };
    }

    return null;
  }, [t, currentUser, event]);
  const pageMessage = useMemo(() => {
    if (!event || !currentUser) {
      return null;
    }

    if (currentUser.id === event.remitterId) {
      return {
        title: t('giftStatus.sent.page.title'),
        text: (
          <Trans
            i18nKey="giftStatus.sent.page.message"
            values={{ gift: event.gift.name }}
            components={[<span key="1" className="font-medium" />]}
          />
        ),
      };
    }

    if (currentUser.id === event.beneficiaryId) {
      return {
        title: t('giftStatus.received.page.title'),
        text: (
          <Trans
            i18nKey="giftStatus.received.page.message"
            values={{ gift: event.gift.name }}
            components={[<span key="1" className="font-medium" />]}
          />
        ),
      };
    }

    return {
      title: t('giftStatus.error.page.title'),
      text: t('giftStatus.error.page.message'),
    };
  }, [t, currentUser, event]);

  useEffect(() => {
    setBottomBar(
      <motion.div
        className="grid gap-2 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Button size="large" onClick={() => setRoute({ page: Page.profile })}>
          {t('giftStatus.openProfile')}
        </Button>
      </motion.div>,
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
        onClick: () => setRoute({ page: Page.profile }),
      });
    }, 500);
  }, [t, setRoute, showToast, setBottomBar, event, toastMessage]);

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
