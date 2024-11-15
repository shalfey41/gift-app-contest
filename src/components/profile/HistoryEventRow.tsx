import React, { useMemo } from 'react';
import Row from '@/components/ui/Row';
import { Prisma } from '@prisma/client';
import { EventAction } from '@/modules/event/types';
import EventGetPayload = Prisma.EventGetPayload;
import EventInclude = Prisma.EventInclude;
import { giftPreviewIcon } from '@/components/utils';
import { Trans, useTranslation } from 'react-i18next';
import { BuyIcon } from '@/components/icons/Buy';
import { SendIcon } from '@/components/icons/Send';
import { ReceiveIcon } from '@/components/icons/Receive';

type Props = {
  event: EventGetPayload<{ include: EventInclude }>;
  separator?: boolean;
};

export default function HistoryEventRow({ separator, event }: Props) {
  const { t } = useTranslation();
  const left = useMemo(() => {
    const getUser = () => {
      switch (event.action) {
        case EventAction.buy:
          return event.buyer;
        case EventAction.send:
          return event.remitter;
        case EventAction.receive:
          return event.beneficiary;
        default:
          return null;
      }
    };
    const getIcon = () => {
      switch (event.action) {
        case EventAction.buy:
          return <BuyIcon />;
        case EventAction.send:
          return <SendIcon />;
        case EventAction.receive:
          return <ReceiveIcon />;
        default:
          return null;
      }
    };
    const user = getUser();
    const url = giftPreviewIcon[event.gift.symbol] || null;
    const Icon = getIcon();

    return (
      <div className="relative h-full w-full rounded-[10px] bg-secondary p-1.5">
        {url && <img src={url} alt={user?.name || t('user.avatar')} />}
        <div className="absolute -bottom-0.5 -right-0.5 text-white dark:text-background">
          {Icon}
        </div>
      </div>
    );
  }, [t, event]);

  const subtitle = useMemo(() => {
    switch (event.action) {
      case EventAction.buy:
        return t('history.buy.title');
      case EventAction.send:
        return t('history.send.title');
      case EventAction.receive:
        return t('history.receive.title');
      default:
        return '';
    }
  }, [t, event]);

  const right = useMemo(() => {
    switch (event.action) {
      case EventAction.buy:
        return (
          <span className="text-[15px]/[22px]">
            {t('history.buy.text', { price: event.gift.price, asset: event.gift.asset })}
          </span>
        );
      case EventAction.send:
        return (
          <span className="text-[15px]/[22px]">
            <Trans
              i18nKey="history.send.text"
              values={{ user: event.beneficiary?.name || t('user.anonymous') }}
              components={[<span key="1" className="text-primary" />]}
            />
          </span>
        );
      case EventAction.receive:
        return (
          <span className="text-[15px]/[22px]">
            <Trans
              i18nKey="history.receive.text"
              values={{ user: event.remitter?.name || t('user.anonymous') }}
              components={[<span key="1" className="text-primary" />]}
            />
          </span>
        );
      default:
        return null;
    }
  }, [t, event]);

  return (
    <Row left={left} right={right} subtitle={subtitle} separator={separator}>
      {event.gift.name}
    </Row>
  );
}
