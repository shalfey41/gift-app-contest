'use server';

import { PrismaClient } from '@prisma/client';
import { EventAction } from '@/modules/event/types';

const prisma = new PrismaClient();

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
  return prisma.event.findFirst({
    where: {
      id,
    },
    include: {
      buyer: options?.include?.buyer,
      gift: options?.include?.gift,
      remitter: options?.include?.remitter,
      beneficiary: options?.include?.beneficiary,
    },
  });
};

export const createBuyEvent = async ({
  giftId,
  userId,
  invoiceId,
}: {
  giftId: string;
  userId: string;
  invoiceId: number;
}) => {
  return prisma.event.create({
    data: {
      action: EventAction.buy,
      giftId,
      buyerId: userId,
      isGiftSent: false,
      invoiceId,
    },
  });
};

export const createSendEvent = async ({
  giftId,
  remitterId,
  beneficiaryId,
}: {
  giftId: string;
  remitterId: string;
  beneficiaryId?: string;
}) => {
  return prisma.event.create({
    data: {
      action: EventAction.send,
      giftId,
      remitterId,
      beneficiaryId,
    },
  });
};

export const getEventsByGiftId = async (
  giftId: string,
  options?: { limit?: number; orderBy?: 'asc' | 'desc' },
) => {
  return prisma.event.findMany({
    where: {
      giftId,
      action: {
        in: [EventAction.buy, EventAction.send],
      },
    },
    include: {
      buyer: true,
      remitter: true,
      beneficiary: true,
    },
    take: options?.limit,
    ...(options?.orderBy ? { orderBy: { createdAt: options.orderBy } } : {}),
  });
};

export const getBoughtGiftsByUserId = async (
  userId: string,
  options?: { limit?: number; orderBy?: 'asc' | 'desc'; id?: string },
) => {
  return prisma.event.findMany({
    where: {
      buyerId: userId,
      id: options?.id,
      action: EventAction.buy,
      isGiftSent: false,
    },
    include: {
      gift: true,
    },
    take: options?.limit,
    ...(options?.orderBy ? { orderBy: { createdAt: options.orderBy } } : {}),
  });
};

export const updateEventById = async (id: string, data: { isGiftSent: boolean }) => {
  return prisma.event.update({
    where: {
      id,
    },
    data,
  });
};

export const createEvents = async (
  data: Array<{
    action: EventAction;
    buyerId?: string;
    remitterId?: string;
    beneficiaryId?: string;
    giftId: string;
    isGiftSent: boolean;
    invoiceId: number;
    createdAt: Date;
    updatedAt: Date;
  }>,
) => {
  return prisma.event.createMany({ data });
};
