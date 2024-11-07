import { createContext, ReactNode } from 'react';

export enum Page {
  store,
  gifts,
  leaderboard,
  profile,
}

export type ToastOptions = {
  iconSrc: string;
  title: string;
  text: string;
  buttonText: string;
  onClick: () => void;
};

export const PageContext = createContext<{
  page: Page;
  setPage: (page: Page) => void;
  toggleBottomBar: (flag: boolean) => void;
  setBottomBar: (component: ReactNode) => void;
  setToast: (options: ToastOptions | null) => void;
}>({
  page: Page.store,
  setPage: () => {},
  toggleBottomBar: () => {},
  setBottomBar: () => {},
  setToast: () => {},
});
