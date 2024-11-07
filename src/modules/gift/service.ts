'use server';

import * as repository from '@/modules/gift/repository';
import { Asset, GiftSymbol } from '@/modules/gift/types';

export const getGifts = async () => {
  try {
    return repository.getGifts();
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const decrementGiftAvailableAmount = async (giftId: string) => {
  try {
    const result = await repository.decrementAvailableGiftById(giftId);

    return result.count > 0;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const createSampleGifts = async () => {
  try {
    return repository.createGifts([
      {
        symbol: GiftSymbol.cake,
        name: 'Delicious Cake',
        price: 0.2,
        asset: Asset.USDT,
        totalAmount: 500,
        availableAmount: 5,
      },
      {
        symbol: GiftSymbol.greenStar,
        name: 'Green Star',
        price: 0.1,
        asset: Asset.TON,
        totalAmount: 3000,
        availableAmount: 0,
      },
      {
        symbol: GiftSymbol.blueStar,
        name: 'Blue Star',
        price: 0.5,
        asset: Asset.USDT,
        totalAmount: 5000,
        availableAmount: 458,
      },
      {
        symbol: GiftSymbol.redStar,
        name: 'Red Star',
        price: 0.0000821018,
        asset: Asset.ETH,
        totalAmount: 10000,
        availableAmount: 10000,
      },
      {
        symbol: GiftSymbol.cake,
        name: 'Delicious Cake 2',
        price: 0.2,
        asset: Asset.USDT,
        totalAmount: 500,
        availableAmount: 0,
      },
      {
        symbol: GiftSymbol.greenStar,
        name: 'Green Star 2',
        price: 0.1,
        asset: Asset.TON,
        totalAmount: 3000,
        availableAmount: 802,
      },
      {
        symbol: GiftSymbol.blueStar,
        name: 'Blue Star 2',
        price: 0.5,
        asset: Asset.USDT,
        totalAmount: 5000,
        availableAmount: 5000,
      },
      {
        symbol: GiftSymbol.redStar,
        name: 'Red Star 2',
        price: 0.0000821018,
        asset: Asset.ETH,
        totalAmount: 10000,
        availableAmount: 10000,
      },
      {
        symbol: GiftSymbol.cake,
        name: 'Delicious Cake 3',
        price: 0.2,
        asset: Asset.USDT,
        totalAmount: 500,
        availableAmount: 5,
      },
      {
        symbol: GiftSymbol.greenStar,
        name: 'Green Star 3',
        price: 0.1,
        asset: Asset.TON,
        totalAmount: 3000,
        availableAmount: 802,
      },
      {
        symbol: GiftSymbol.blueStar,
        name: 'Blue Star 3',
        price: 0.5,
        asset: Asset.USDT,
        totalAmount: 5000,
        availableAmount: 458,
      },
      {
        symbol: GiftSymbol.redStar,
        name: 'Red Star 3',
        price: 0.0000821018,
        asset: Asset.ETH,
        totalAmount: 10000,
        availableAmount: 10000,
      },
      {
        symbol: GiftSymbol.cake,
        name: 'Delicious Cake 4',
        price: 0.2,
        asset: Asset.USDT,
        totalAmount: 500,
        availableAmount: 5,
      },
      {
        symbol: GiftSymbol.greenStar,
        name: 'Green Star 4',
        price: 0.1,
        asset: Asset.TON,
        totalAmount: 3000,
        availableAmount: 802,
      },
      {
        symbol: GiftSymbol.blueStar,
        name: 'Blue Star 4',
        price: 0.5,
        asset: Asset.USDT,
        totalAmount: 5000,
        availableAmount: 458,
      },
      {
        symbol: GiftSymbol.redStar,
        name: 'Red Star 4',
        price: 0.0000821018,
        asset: Asset.ETH,
        totalAmount: 10000,
        availableAmount: 10000,
      },
      {
        symbol: GiftSymbol.cake,
        name: 'Delicious Cake 5',
        price: 0.2,
        asset: Asset.USDT,
        totalAmount: 500,
        availableAmount: 5,
      },
      {
        symbol: GiftSymbol.greenStar,
        name: 'Green Star 5',
        price: 0.1,
        asset: Asset.TON,
        totalAmount: 3000,
        availableAmount: 802,
      },
      {
        symbol: GiftSymbol.blueStar,
        name: 'Blue Star 5',
        price: 0.5,
        asset: Asset.USDT,
        totalAmount: 5000,
        availableAmount: 458,
      },
      {
        symbol: GiftSymbol.redStar,
        name: 'Red Star 5',
        price: 0.0000821018,
        asset: Asset.ETH,
        totalAmount: 10000,
        availableAmount: 10000,
      },
    ]);
  } catch (error) {
    console.error(error);
    return null;
  }
};
