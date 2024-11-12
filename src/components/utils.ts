import { GiftSymbol } from '@/modules/gift/types';
import giftDeliciousCakeAnimation from '@/lottie/gift-delicious-cake.json';
import giftBlueStarAnimation from '@/lottie/gift-blue-star.json';
import giftGreenStarAnimation from '@/lottie/gift-green-star.json';
import giftRedStarAnimation from '@/lottie/gift-red-star.json';
import { ErrorCode, Page, pages, Route } from '@/modules/types';
import { StartParam, startParamArray } from '@/modules/bot/types';

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
  [GiftSymbol.cake]: '/cake.svg',
  [GiftSymbol.greenStar]: '/green-star.svg',
  [GiftSymbol.blueStar]: '/blue-star.svg',
  [GiftSymbol.redStar]: '/red-star.svg',
};

export const giftPreviewPng: Record<string, string> = {
  [GiftSymbol.cake]: '/cake.jpg',
  [GiftSymbol.greenStar]: '/green-star.jpg',
  [GiftSymbol.blueStar]: '/blue-star.jpg',
  [GiftSymbol.redStar]: '/red-star.jpg',
};

export const giftPreviewImg: Record<string, string> = {
  [GiftSymbol.cake]: '/cake-placeholder.svg',
  [GiftSymbol.greenStar]: '/star-placeholder.svg',
  [GiftSymbol.blueStar]: '/star-placeholder.svg',
  [GiftSymbol.redStar]: '/star-placeholder.svg',
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

export const getGiftAnimationBySymbol = (symbol?: string) => {
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

export const parseError = (error: ErrorCode) => {
  switch (error) {
    case ErrorCode.entityNotFound: {
      return 'error.entityNotFound';
    }

    case ErrorCode.eventReceiveRemitterIsBeneficiary: {
      return 'error.eventReceiveRemitterIsBeneficiary';
    }

    case ErrorCode.eventReceiveWrongBeneficiary: {
      return 'error.eventReceiveWrongBeneficiary';
    }

    case ErrorCode.eventReceiveGiftAlreadyReceived: {
      return 'error.eventReceiveGiftAlreadyReceived';
    }

    case ErrorCode.giftIsSoldOut: {
      return 'error.giftIsSoldOut';
    }

    case ErrorCode.unknown:
    default: {
      return 'error.unknown';
    }
  }
};

export const parseStartParam = (startParam?: string): Route => {
  const defaultRoute = {
    page: Page.store,
  };

  if (!startParam) {
    return defaultRoute;
  }

  let command: StartParam;
  let params: string;

  try {
    [command, params] = startParam.split('_') as [StartParam, string];

    if (!startParamArray.includes(command) || !params) {
      return defaultRoute;
    }
  } catch {
    return defaultRoute;
  }

  switch (command) {
    case StartParam.receiveGift: {
      return {
        page: Page.receiveGift,
        params: { eventId: params },
      };
    }

    case StartParam.viewGift: {
      return {
        page: Page.profile,
        params: { eventId: params },
      };
    }

    case StartParam.openPage: {
      if (!pages.includes(params as Page)) {
        return defaultRoute;
      }

      return { page: params as unknown as Page };
    }

    default:
      return defaultRoute;
  }
};

export const pageAnimation = {
  initial: { opacity: 0, scale: 0.9, filter: 'blur(4px)' },
  animate: { opacity: 1, scale: 1, filter: 'blur(0)' },
  exit: { opacity: 0, scale: 0.9, filter: 'blur(4px)' },
  transition: { type: 'spring', stiffness: 300, damping: 30 },
};
