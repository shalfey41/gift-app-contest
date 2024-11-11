import { Prisma } from '@prisma/client';
import { EventAction } from '@/modules/event/types';
import { Pagination, PrismaTxn } from '@/modules/types';
import EventWhereInput = Prisma.EventWhereInput;
import EventGetPayload = Prisma.EventGetPayload;
import EventInclude = Prisma.EventInclude;
import EventUncheckedCreateInput = Prisma.EventUncheckedCreateInput;
import EventOrderByWithAggregationInput = Prisma.EventOrderByWithAggregationInput;
import prisma from '@/modules/prisma/prisma';

export const getEventById = async (
  id: string,
  options?: {
    include?: EventInclude;
  },
  prismaTxn?: PrismaTxn,
) => {
  return (prismaTxn || prisma).event.findUnique({
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

export const createEvent = async (
  data: EventUncheckedCreateInput,
  include?: EventInclude,
  prismaTxn?: PrismaTxn,
) => {
  return (prismaTxn || prisma).event.create({
    data,
    include: {
      buyer: include?.buyer,
      gift: include?.gift,
      remitter: include?.remitter,
      beneficiary: include?.beneficiary,
    },
  });
};

export const getEventsByGiftId = async (
  giftId: string,
  options?: { limit?: number; orderBy?: 'asc' | 'desc' },
  prismaTxn?: PrismaTxn,
) => {
  return (prismaTxn || prisma).event.findMany({
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

export const getEvents = async (
  options?: {
    page?: number;
    limit?: number;
    orderBy?: EventOrderByWithAggregationInput;
    include?: EventInclude;
    where?: EventWhereInput;
  },
  prismaTxn?: PrismaTxn,
): Promise<Pagination<EventGetPayload<{ include: EventInclude }>>> => {
  const page = options?.page ?? 1;
  const limit = options?.limit ?? 50;
  const orderBy = options?.orderBy;
  const include = options?.include;
  const where = options?.where;

  const take = Math.max(limit, 1);
  const skip = (Math.max(page, 1) - 1) * take;
  const query = {
    skip: skip,
    take: limit,
    where,
    ...(orderBy ? { orderBy } : {}),
  };

  const [list, total] = await Promise.all([
    (prismaTxn || prisma).event.findMany({
      ...query,
      include: {
        gift: include?.gift,
        buyer: include?.buyer,
        remitter: include?.remitter,
        beneficiary: include?.beneficiary,
      },
    }),
    (prismaTxn || prisma).event.count(query),
  ]);
  const totalPages = Math.ceil(total / take);

  return {
    list,
    total,
    page,
    totalPages,
  };
};

export const updateBuyEventById = async (id: string, prismaTxn?: PrismaTxn) => {
  return (prismaTxn || prisma).event.updateMany({
    where: {
      id,
      isGiftSent: false,
    },
    data: {
      isGiftSent: true,
    },
  });
};

export const updateSendEventById = async (id: string, prismaTxn?: PrismaTxn) => {
  return (prismaTxn || prisma).event.updateMany({
    where: {
      id,
      isGiftReceived: false,
    },
    data: {
      isGiftReceived: true,
    },
  });
};
