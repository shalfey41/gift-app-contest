export type Pagination<T> = { list: T[]; total: number; page: number; totalPages: number };

export enum ErrorCode {
  unknown = 'unknown',
  entityNotFound = 'entityNotFound',
  eventReceiveRemitterIsBeneficiary = 'eventReceiveRemitterIsBeneficiary',
  eventReceiveWrongBeneficiary = 'eventReceiveWrongBeneficiary',
  eventReceiveGiftAlreadyReceived = 'eventReceiveGiftAlreadyReceived',
}
