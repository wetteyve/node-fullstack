import { create } from 'zustand';

import { type ImageFormatKey } from '#rs911/utils/file.utils';
import { createSelectors } from './create-selectors';

export type ScreenSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export const imageFormatMapping: Record<ScreenSize, ImageFormatKey> = {
  sm: 'small',
  md: 'medium',
  lg: 'medium',
  xl: 'large',
  '2xl': 'large',
};

const breakpoints = {
  sm: 768,
  md: 1024,
  lg: 1280,
  xl: 1536,
};

const getCurrentScreenSize = (): ScreenSize => {
  // Check if window is defined (for SSR)
  if (typeof window === 'undefined') {
    return 'md';
  }
  switch (true) {
    case window?.innerWidth < breakpoints.sm:
      return 'sm';
    case window?.innerWidth < breakpoints.md:
      return 'md';
    case window?.innerWidth < breakpoints.lg:
      return 'lg';
    case window?.innerWidth < breakpoints.xl:
      return 'xl';
    default:
      return '2xl';
  }
};

type ScreenStore = {
  screenSize: ScreenSize;
  defaultImgFormat: ImageFormatKey;
  updateScreenSize: () => void;
};

const useScreenStoreBase = create<ScreenStore>((set, get) => ({
  screenSize: getCurrentScreenSize(),
  defaultImgFormat: imageFormatMapping[getCurrentScreenSize()],
  updateScreenSize: () => {
    const newScreenSize = getCurrentScreenSize();
    const { screenSize, defaultImgFormat } = get();

    if (screenSize !== newScreenSize) {
      set({ screenSize: newScreenSize });

      const newDefaultImgFormat = imageFormatMapping[newScreenSize];
      if (defaultImgFormat !== newDefaultImgFormat) {
        set({ defaultImgFormat: newDefaultImgFormat });
      }
    }
  },
}));

export const useScreenStore = createSelectors(useScreenStoreBase);
