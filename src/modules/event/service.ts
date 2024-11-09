'use server';

import { Invoice } from 'crypto-bot-api';
import * as repository from '@/modules/event/repository';
import { EventAction, UserGift } from '@/modules/event/types';
import { reactToBuyEvent, reactToReceiveEvent, reactToSendEvent } from '@/modules/bot/service';
import { faker } from '@faker-js/faker';
import { getUsers } from '@/modules/user/repository';
import { getGifts } from '@/modules/gift/service';
import { ErrorCode, Pagination } from '@/modules/types';
import { Prisma } from '@prisma/client';
import EventInclude = Prisma.EventInclude;
import EventGetPayload = Prisma.EventGetPayload;
import { incrementReceivedGifts } from '@/modules/user/service';

export const createBuyEvent = async (invoice: Invoice) => {
  try {
    const { giftId, userId } = invoice.payload as { giftId: string; userId: string };

    const event = await repository.createEvent({
      action: EventAction.buy,
      giftId,
      buyerId: userId,
      isGiftSent: false,
      invoiceId: invoice.id,
    });

    reactToBuyEvent(event.id);

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
}: {
  buyEventId: string;
  giftId: string;
  remitterId: string;
  beneficiaryId?: string;
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
      reactToSendEvent(event.id);
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
  giftId?: string,
): Promise<Pagination<UserGift> | null> => {
  try {
    const events = await repository.getEvents({
      where: {
        buyerId: userId,
        action: EventAction.buy,
        isGiftSent: false,
        giftId,
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
        OR: [{ beneficiaryId: userId }, { buyerId: userId }, { remitterId: userId }],
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

export const createSampleEvents = async () => {
  const pickRandomValue = <T>(values: T[]): T => values[Math.floor(Math.random() * values.length)];
  const getEventByAction = (
    action: EventAction,
    firstUserId: string,
    secondUserId: string,
    giftId: string,
  ) => {
    switch (action) {
      case EventAction.buy:
        return {
          action,
          buyerId: firstUserId,
          giftId,
          isGiftSent: faker.datatype.boolean(),
          invoiceId: BigInt(faker.number.int({ min: -10000, max: -1 })),
          createdAt: faker.date.past(),
          updatedAt: faker.date.past(),
        };
      case EventAction.send:
        return {
          action,
          giftId,
          remitterId: firstUserId,
          isGiftReceived: faker.datatype.boolean(),
          beneficiaryId: secondUserId,
          createdAt: faker.date.past(),
          updatedAt: faker.date.past(),
        };
      case EventAction.receive:
        return {
          action,
          giftId,
          remitterId: secondUserId,
          beneficiaryId: firstUserId,
          createdAt: faker.date.past(),
          updatedAt: faker.date.past(),
        };
    }
  };

  try {
    const events: any[] = [];

    const users = await getUsers();
    const gifts = await getGifts();
    const userIds = users.list.map((user) => user.id);
    const actions = [EventAction.buy, EventAction.send, EventAction.receive];

    userIds.forEach((userId) => {
      for (let i = 0; i < 30; i++) {
        const randomUserId = pickRandomValue(userIds.filter((id) => id !== userId));
        const randomAction = pickRandomValue(actions);
        const randomGift = pickRandomValue(gifts || []);

        events.push(getEventByAction(randomAction, userId, randomUserId, randomGift.id));
      }
    });

    return repository.createEvents(events);
  } catch (error) {
    console.error(error);
    return null;
  }
};
