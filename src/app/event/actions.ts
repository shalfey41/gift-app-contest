'use server';

import * as service from '@/modules/event/service';
import { Prisma } from '@prisma/client';
import { AppError, getAppError, Pagination } from '@/modules/types';
import { UserGift } from '@/modules/event/types';
import EventGetPayload = Prisma.EventGetPayload;
import EventInclude = Prisma.EventInclude;

export const createSendEvent = async (params: {
  buyEventId: string;
  giftId: string;
  remitterId: string;
  beneficiaryId?: string;
  lang?: string;
}) => {
  try {
    return await service.createSendEvent(params);
  } catch (error) {
    return getAppError(error);
  }
};

export const receiveGiftByEventId = async (
  eventId: string,
  beneficiaryId: string,
): Promise<EventGetPayload<{ include: EventInclude }> | AppError> => {
  try {
    return await service.receiveGiftByEventId(eventId, beneficiaryId);
  } catch (error) {
    return getAppError(error);
  }
};

export const getEventById = async (
  id: string,
  options?: {
    include?: EventInclude;
  },
) => {
  return service.getEventById(id, options);
};

export const getRecentEventsByGiftId = async (giftId: string) => {
  return service.getRecentEventsByGiftId(giftId);
};

export const getBoughtGiftsByUserId = async (
  userId: string,
): Promise<Pagination<UserGift> | null> => {
  return service.getBoughtGiftsByUserId(userId);
};

export const getReceivedGiftsByUserId = async (
  userId: string,
): Promise<Pagination<EventGetPayload<{ include: EventInclude }>> | null> => {
  return service.getReceivedGiftsByUserId(userId);
};

export const getAllEventsByUserId = async (
  userId: string,
): Promise<Pagination<EventGetPayload<{ include: EventInclude }>> | null> => {
  return service.getAllEventsByUserId(userId);
};
