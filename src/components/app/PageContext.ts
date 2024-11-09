import { createContext, ReactNode, JSX } from 'react';

export enum Page {
  store = 'store',
  gifts = 'gifts',
  leaderboard = 'leaderboard',
  profile = 'profile',
  receiveGift = 'receiveGift',
}

export const pages = Object.values(Page);

export type ToastOptions = {
  iconSrc: string;
  title: string;
  text: string;
  buttonText?: string;
  onClick?: () => void;
};

export type PopupOptions = {
  title: string;
  animation: any;
  tableData: Array<{ key: string; value: string | JSX.Element }>;
  buttonText: string;
  onClick: () => void;
  onClose: () => void;
};

export type Route = {
  page: Page;
  params?: Record<string, string>;
};

export const PageContext = createContext<{
  route: Route;
  setRoute: (route: { page: Page; params?: Record<string, string> }) => void;
  popup: PopupOptions | null;
  bottomBarHeight: number;
  toggleBottomBar: (flag: boolean) => void;
  setBottomBar: (component: ReactNode) => void;
  setToast: (options: ToastOptions | null) => void;
  setPopup: (options: PopupOptions | null) => void;
}>({
  route: { page: Page.store },
  popup: null,
  bottomBarHeight: 0,
  setRoute: () => {},
  toggleBottomBar: () => {},
  setBottomBar: () => {},
  setToast: () => {},
  setPopup: () => {},
});
