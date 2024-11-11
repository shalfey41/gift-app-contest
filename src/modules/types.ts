export type Pagination<T> = { list: T[]; total: number; page: number; totalPages: number };

import { Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/binary';

export type PrismaTxn = Omit<
  PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;

export type AppError = {
  code: ErrorCode;
};

export enum ErrorCode {
  unknown = 'unknown',
  entityNotFound = 'entityNotFound',
  eventReceiveRemitterIsBeneficiary = 'eventReceiveRemitterIsBeneficiary',
  eventReceiveWrongBeneficiary = 'eventReceiveWrongBeneficiary',
  eventReceiveGiftAlreadyReceived = 'eventReceiveGiftAlreadyReceived',
  giftIsSoldOut = 'giftIsSoldOut',
}

export enum Page {
  store = 'store',
  gifts = 'gifts',
  leaderboard = 'leaderboard',
  profile = 'profile',
  receiveGift = 'receiveGift',
}

export const pages = Object.values(Page);

export type Route = {
  page: Page;
  params?: Record<string, string>;
};
