import { createContext, ReactNode, JSX } from 'react';

export enum Page {
  store,
  gifts,
  leaderboard,
  profile,
  receiveGift,
}

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

export const PageContext = createContext<{
  route: {
    page: Page;
    params?: Record<string, string>;
  };
  setRoute: (route: { page: Page; params?: Record<string, string> }) => void;
  page: Page;
  popup: PopupOptions | null;
  bottomBarHeight: number;
  setPage: (page: Page) => void;
  toggleBottomBar: (flag: boolean) => void;
  setBottomBar: (component: ReactNode) => void;
  setToast: (options: ToastOptions | null) => void;
  setPopup: (options: PopupOptions | null) => void;
}>({
  page: Page.store,
  route: { page: Page.store },
  popup: null,
  bottomBarHeight: 0,
  setPage: () => {},
  setRoute: () => {},
  toggleBottomBar: () => {},
  setBottomBar: () => {},
  setToast: () => {},
  setPopup: () => {},
});
