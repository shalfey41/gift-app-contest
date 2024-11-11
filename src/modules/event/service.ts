import { Invoice } from 'crypto-bot-api';
import * as repository from '@/modules/event/repository';
import { EventAction, UserGift } from '@/modules/event/types';
import { reactToBuyEvent, reactToReceiveEvent, reactToSendEvent } from '@/modules/bot/service';
import { ErrorCode, Pagination } from '@/modules/types';
import { Prisma } from '@prisma/client';
import EventInclude = Prisma.EventInclude;
import EventGetPayload = Prisma.EventGetPayload;
import { incrementReceivedGifts } from '@/modules/user/service';

export const createBuyEvent = async (invoice: Invoice) => {
  try {
    const { giftId, userId, lang } = invoice.payload as {
      giftId: string;
      userId: string;
      lang: string;
    };

    const event = await repository.createEvent({
      action: EventAction.buy,
      giftId,
      buyerId: userId,
      isGiftSent: false,
      invoiceId: invoice.id,
    });

    reactToBuyEvent(event.id, lang);

    return event;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const createSendEvent = async ({
  buyEventId,
  giftId,
  remitterId,
  beneficiaryId,
  lang,
}: {
  buyEventId: string;
  giftId: string;
  remitterId: string;
  beneficiaryId?: string;
  lang?: string;
}) => {
  try {
    // todo transaction
    const buyEventUpdate = await repository.updateBuyEventById(buyEventId);
    const isGiftAlreadySent = buyEventUpdate.count === 0;

    if (isGiftAlreadySent) {
      throw new Error('Gift already sent');
    }

    const event = await repository.createEvent({
      action: EventAction.send,
      giftId,
      remitterId,
      beneficiaryId,
      isGiftReceived: false,
    });

    if (event.beneficiaryId) {
      reactToSendEvent(event.id, lang);
    }

    return event;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const createReceiveEvent = async ({
  giftId,
  remitterId,
  beneficiaryId,
  include,
}: {
  giftId: string;
  remitterId: string;
  beneficiaryId: string;
  include?: EventInclude;
}): Promise<EventGetPayload<{ include: EventInclude }> | null> => {
  try {
    const event = await repository.createEvent(
      {
        giftId,
        remitterId,
        beneficiaryId,
        action: EventAction.receive,
      },
      include,
    );

    reactToReceiveEvent(event.id);

    return event;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const receiveGiftByEventId = async (
  eventId: string,
  beneficiaryId: string,
): Promise<EventGetPayload<{ include: EventInclude }>> => {
  try {
    // todo transaction
    const sendEvent = await getEventById(eventId);

    if (!sendEvent) {
      console.error('Send event not found');
      throw ErrorCode.entityNotFound;
    }

    if (sendEvent.remitterId === beneficiaryId) {
      throw ErrorCode.eventReceiveRemitterIsBeneficiary;
    }

    if (sendEvent.beneficiaryId && sendEvent.beneficiaryId !== beneficiaryId) {
      throw ErrorCode.eventReceiveWrongBeneficiary;
    }

    if (!sendEvent.remitterId) {
      console.error('No remitter found');
      throw ErrorCode.entityNotFound;
    }

    const sendEventUpdate = await repository.updateSendEventById(eventId);
    const isGiftAlreadyReceived = sendEventUpdate.count === 0;

    if (isGiftAlreadyReceived) {
      throw ErrorCode.eventReceiveGiftAlreadyReceived;
    }

    const event = await createReceiveEvent({
      giftId: sendEvent.giftId,
      remitterId: sendEvent.remitterId,
      beneficiaryId,
      include: { gift: true, remitter: true, beneficiary: true },
    });

    if (!event || !event?.beneficiaryId) {
      console.error('Receive event not found');
      throw ErrorCode.entityNotFound;
    }

    await incrementReceivedGifts(event.beneficiaryId);

    return event;
  } catch (error: unknown) {
    if (typeof error === 'string' && error in ErrorCode) {
      throw new Error(error);
    }

    console.error(error);
    throw new Error(ErrorCode.unknown);
  }
};

export const getEventById = async (
  id: string,
  options?: {
    include?: EventInclude;
  },
) => {
  try {
    return repository.getEventById(id, options);
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getRecentEventsByGiftId = async (giftId: string) => {
  try {
    return repository.getEventsByGiftId(giftId, { limit: 10, orderBy: 'desc' });
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getBoughtGiftsByUserId = async (
  userId: string,
): Promise<Pagination<UserGift> | null> => {
  try {
    const events = await repository.getEvents({
      where: {
        buyerId: userId,
        action: EventAction.buy,
        isGiftSent: false,
      },
      orderBy: { createdAt: 'desc' },
      include: {
        gift: true,
      },
      page: 1,
      limit: 50,
    });

    return {
      ...events,
      list: events.list.map((event) => ({
        id: event.id,
        boughtAt: event.createdAt,
        gift: event.gift,
      })),
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getReceivedGiftsByUserId = async (
  userId: string,
): Promise<Pagination<EventGetPayload<{ include: EventInclude }>> | null> => {
  try {
    return repository.getEvents({
      where: {
        beneficiaryId: userId,
        action: EventAction.receive,
      },
      orderBy: { createdAt: 'desc' },
      include: {
        gift: true,
        remitter: true,
      },
      page: 1,
      limit: 20,
    });
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getAllEventsByUserId = async (
  userId: string,
): Promise<Pagination<EventGetPayload<{ include: EventInclude }>> | null> => {
  try {
    return repository.getEvents({
      where: {
        OR: [
          { beneficiaryId: userId, action: { not: 'send' } },
          { buyerId: userId },
          { remitterId: userId, action: { not: 'receive' } },
        ],
      },
      orderBy: { createdAt: 'desc' },
      include: {
        gift: true,
        remitter: true,
        beneficiary: true,
      },
      page: 1,
      limit: 20,
    });
  } catch (error) {
    console.error(error);
    return null;
  }
};
