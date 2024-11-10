import React, { useMemo } from 'react';
import Row from '@/components/ui/Row';
import { Event, User } from '@prisma/client';
import { EventAction } from '@/modules/event/types';
import classNames from 'classnames';
import { Trans, useTranslation } from 'react-i18next';

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
          {url && <img src={url} alt={user?.name || t('user.avatar')} />}
        </div>
        <div className="absolute -bottom-0.5 -right-0.5">
          {icon && <img src={icon} alt={event.action} />}
        </div>
      </div>
    );
  }, [t, event]);

  const subtitle = useMemo(() => {
    switch (event.action) {
      case EventAction.buy:
        return t('store.event.buy.title');
      case EventAction.send:
        return t('store.event.send.title');
      case EventAction.receive:
        return t('store.event.receive.title');
      default:
        return '';
    }
  }, [t, event]);

  const text = useMemo(() => {
    switch (event.action) {
      case EventAction.buy:
        return (
          <span>
            <Trans
              i18nKey="store.event.buy.text"
              values={{ user: event.buyer?.name || t('user.anonymous') }}
              components={[<span key="1" className="text-primary" />]}
            />
          </span>
        );
      case EventAction.send:
        return (
          <span>
            <Trans
              i18nKey="store.event.send.text"
              values={{
                remitter: event.remitter?.name || t('user.anonymous'),
                beneficiary: event.beneficiary?.name || t('user.anonymous'),
              }}
              components={[
                <span key="1" className="text-primary" />,
                <span key="2" className="text-primary" />,
              ]}
            />
          </span>
        );
      case EventAction.receive:
        return (
          <span>
            <Trans
              i18nKey="store.event.receive.text"
              values={{
                beneficiary: event.beneficiary?.name || t('user.anonymous'),
                remitter: event.remitter?.name || t('user.anonymous'),
              }}
              components={[
                <span key="1" className="text-primary" />,
                <span key="2" className="text-primary" />,
              ]}
            />
          </span>
        );
      default:
        return null;
    }
  }, [t, event]);

  return (
    <Row left={left} subtitle={subtitle} separator={separator}>
      {text}
    </Row>
  );
}
