import WebApp from '@twa-dev/sdk';
import { getCssVar } from '@/components/utils';

export type ColorTheme = 'light' | 'dark';

const CsLangKey = 'colorTheme';

export const initColorTheme = async () => {
  const colorTheme = await getColorTheme();

  applyColorThemeChanges(colorTheme);
};

export const applyColorThemeChanges = (theme: ColorTheme) => {
  document.documentElement.className = theme;

  WebApp.setBackgroundColor(getCssVar('--color-bg-tab-bar'));
  WebApp.setHeaderColor(getCssVar('--white'));
  WebApp.setBottomBarColor(getCssVar('--color-bg-tab-bar'));

  if (theme === 'dark') {
    WebApp.setHeaderColor(getCssVar('--color-bg-tab-bar'));
  }
};

export const changeColorTheme = (theme: ColorTheme) => {
  WebApp.CloudStorage.setItem(CsLangKey, theme);
  applyColorThemeChanges(theme);
};

export const getColorTheme = (): Promise<ColorTheme> => {
  return new Promise((resolve) => {
    WebApp.CloudStorage.getItem(CsLangKey, (error, result) => {
      const colorTheme = result || WebApp.colorScheme;

      resolve(colorTheme as ColorTheme);
    });
  });
};
