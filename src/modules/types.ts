export type Pagination<T> = { list: T[]; total: number; page: number; totalPages: number };

export enum ErrorCode {
  unknown = 'unknown',
  entityNotFound = 'entityNotFound',
  eventReceiveRemitterIsBeneficiary = 'eventReceiveRemitterIsBeneficiary',
  eventReceiveWrongBeneficiary = 'eventReceiveWrongBeneficiary',
  eventReceiveGiftAlreadyReceived = 'eventReceiveGiftAlreadyReceived',
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
