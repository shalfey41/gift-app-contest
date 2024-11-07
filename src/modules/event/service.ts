'use server';

import { Invoice } from 'crypto-bot-api';
import * as repository from '@/modules/event/repository';
import { EventAction, UserGift } from '@/modules/event/types';
import { reactToBuyEvent, reactToSendEvent } from '@/modules/bot/service';
import { faker } from '@faker-js/faker';
import { getUsers } from '@/modules/user/repository';
import { getGifts } from '@/modules/gift/service';

export const createBuyEvent = async (invoice: Invoice) => {
  try {
    const { giftId, userId } = invoice.payload as { giftId: string; userId: string };

    const event = await repository.createBuyEvent({ giftId, userId, invoiceId: invoice.id });

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
    const event = await repository.createSendEvent({ giftId, remitterId, beneficiaryId });

    repository.updateEventById(buyEventId, { isGiftSent: true });

    if (event.beneficiaryId) {
      reactToSendEvent(event.id);
    }

    return event;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getEventById = async (
  id: string,
  options?: {
    include?: {
      buyer?: boolean;
      gift?: boolean;
      remitter?: boolean;
      beneficiary?: boolean;
    };
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
  options?: { limit?: number; id?: string },
): Promise<UserGift[] | null> => {
  try {
    const events = await repository.getBoughtGiftsByUserId(userId, {
      orderBy: 'desc',
      limit: options?.limit,
      id: options?.id,
    });

    return events.map((event) => ({
      id: event.id,
      boughtAt: event.createdAt,
      gift: event.gift,
    }));
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
