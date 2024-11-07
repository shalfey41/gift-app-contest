import React, { useMemo } from 'react';
import Row from '@/components/ui/Row';
import { Event, User } from '@prisma/client';
import { EventAction } from '@/modules/event/types';
import classNames from 'classnames';

interface GiftEvent extends Event {
  buyer: User | null;
  remitter: User | null;
  beneficiary: User | null;
}

type Props = {
  event: GiftEvent;
  separator?: boolean;
};

export default function GiftEventsRow({ separator, event }: Props) {
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
    const url = getUser()?.avatarUrl || null;
    const icon = getIcon();

    return (
      <div className="relative h-full w-full">
        <div className={classNames('overflow-hidden rounded-full', { 'bg-secondary': !url })}>
          {url && <img src={url} alt={user?.name || 'User avatar'} />}
        </div>
        <div className="absolute -bottom-0.5 -right-0.5">
          {icon && <img src={icon} alt={`${event.action} icon`} />}
        </div>
      </div>
    );
  }, [event]);

  const subtitle = useMemo(() => {
    switch (event.action) {
      case EventAction.buy:
        return 'Buy gift';
      case EventAction.send:
        return 'Send gift';
      case EventAction.receive:
        return 'Receive gift';
      default:
        return '';
    }
  }, [event]);

  const text = useMemo(() => {
    switch (event.action) {
      case EventAction.buy:
        return (
          <span>
            <span className="text-primary">{event.buyer?.name || 'Anonymous'}</span> bought a gift
          </span>
        );
      case EventAction.send:
        return (
          <span>
            <span className="text-primary">{event.remitter?.name || 'Anonymous'}</span> sent gift to{' '}
            <span className="text-primary">{event.beneficiary?.name || 'Anonymous'}</span>
          </span>
        );
      case EventAction.receive:
        return (
          <span>
            <span className="text-primary">{event.beneficiary?.name || 'Anonymous'}</span> received
            gift from <span className="text-primary">{event.remitter?.name || 'Anonymous'}</span>
          </span>
        );
      default:
        return null;
    }
  }, [event]);

  return (
    <Row left={left} subtitle={subtitle} separator={separator}>
      {text}
    </Row>
  );
}
