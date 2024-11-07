import { GiftSymbol } from '@/modules/gift/types';
import giftDeliciousCakeAnimation from '@/lottie/gift-delicious-cake.json';
import giftBlueStarAnimation from '@/lottie/gift-blue-star.json';
import giftGreenStarAnimation from '@/lottie/gift-green-star.json';
import giftRedStarAnimation from '@/lottie/gift-red-star.json';

export const getCssVar = (name: string) => {
  return getComputedStyle(document.documentElement).getPropertyValue(name) as `#${string}`;
};

export const assetIcon: Record<string, string> = {
  TON: '/ton.svg',
  USDT: '/usdt.svg',
  ETH: '/eth.svg',
};

export const assetOutlineIcon: Record<string, string> = {
  TON: '/ton-outline.svg',
  USDT: '/usdt-outline.svg',
  ETH: '/eth-outline.svg',
};

export const giftPreviewIcon: Record<string, string> = {
  [GiftSymbol.cake]: '/preview-delicious-cake.png',
  [GiftSymbol.greenStar]: '/preview-green-star.png',
  [GiftSymbol.blueStar]: '/preview-blue-star.png',
  [GiftSymbol.redStar]: '/preview-red-star.png',
};

export const firstNonZeroDigit = (number: number) => {
  if (number === 0) return '0';

  let result = number;

  if (Math.abs(number) < 1) {
    result = Number.parseFloat(number.toPrecision(1));
  }

  return result.toString();
};

export const getGiftPatternBackgroundBySymbol = (symbol: string) => {
  return "url( '/gift-pattern.svg' )," + getGiftGradientBySymbol(symbol);
};

export const getGiftGradientBySymbol = (symbol: string) => {
  switch (symbol) {
    case GiftSymbol.cake: {
      return 'linear-gradient(180deg, rgba(254, 160, 65, 0.2) 0%, rgba(254, 159, 65, 0.1) 100%)';
    }

    case GiftSymbol.redStar: {
      return 'linear-gradient(180deg, rgba(255, 71, 71, 0.2) 0%, rgba(255, 71, 71, 0.05) 100%)';
    }

    case GiftSymbol.blueStar: {
      return 'linear-gradient(180deg, rgba(0, 122, 255, 0.2) 0%, rgba(0, 122, 255, 0.05) 100%)';
    }

    case GiftSymbol.greenStar: {
      return 'linear-gradient(180deg, rgba(70, 209, 0, 0.2) 0%, rgba(70, 209, 0, 0.06) 100%)';
    }

    default: {
      return '';
    }
  }
};

export const getGiftAnimationBySymbol = (symbol: string) => {
  switch (symbol) {
    case GiftSymbol.cake: {
      return giftDeliciousCakeAnimation;
    }

    case GiftSymbol.redStar: {
      return giftRedStarAnimation;
    }

    case GiftSymbol.blueStar: {
      return giftBlueStarAnimation;
    }

    case GiftSymbol.greenStar: {
      return giftGreenStarAnimation;
    }

    default: {
      return null;
    }
  }
};