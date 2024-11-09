import React, { useMemo } from 'react';
import Row from '@/components/ui/Row';
import { Prisma } from '@prisma/client';
import { EventAction } from '@/modules/event/types';
import classNames from 'classnames';
import EventGetPayload = Prisma.EventGetPayload;
import EventInclude = Prisma.EventInclude;
import { giftPreviewIcon } from '@/components/utils';

type Props = {
  event: EventGetPayload<{ include: EventInclude }>;
  separator?: boolean;
};

export default function HistoryEventRow({ separator, event }: Props) {
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
          return '/buy.svg';
        case EventAction.send:
          return '/send.svg';
        case EventAction.receive:
          return '/receive.svg';
        default:
          return null;
      }
    };
    const user = getUser();
    const url = giftPreviewIcon[event.gift.symbol] || null;
    const icon = getIcon();

    return (
      <div className="relative h-full w-full rounded-[10px] bg-secondary p-1.5">
        {url && <img src={url} alt={user?.name || 'User avatar'} />}
        <div className="absolute -bottom-0.5 -right-0.5">
          {icon && <img src={icon} alt={`${event.action} icon`} />}
        </div>
      </div>
    );
  }, [event]);

  const subtitle = useMemo(() => {
    switch (event.action) {
      case EventAction.buy:
        return 'Buy';
      case EventAction.send:
        return 'Sent';
      case EventAction.receive:
        return 'Received';
      default:
        return '';
    }
  }, [event]);

  const right = useMemo(() => {
    switch (event.action) {
      case EventAction.buy:
        return (
          <span className="text-[15px]/[22px]">
            −{event.gift.price} {event.gift.asset}
          </span>
        );
      case EventAction.send:
        return (
          <span className="text-[15px]/[22px]">
            to <span className="text-primary">{event.beneficiary?.name || 'Anonymous'}</span>
          </span>
        );
      case EventAction.receive:
        return (
          <span className="text-[15px]/[22px]">
            from <span className="text-primary">{event.remitter?.name || 'Anonymous'}</span>
          </span>
        );
      default:
        return null;
    }
  }, [event]);

  return (
    <Row left={left} right={right} subtitle={subtitle} separator={separator}>
      {event.gift.name}
    </Row>
  );
}
