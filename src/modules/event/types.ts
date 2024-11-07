import { Gift } from '@prisma/client';

export enum EventAction {
  buy = 'buy',
  send = 'send',
  receive = 'receive',
}

export type UserGift = {
  id: string;
  boughtAt: Date;
  gift: Gift;
};
