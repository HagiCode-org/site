import { describe, expect, it } from 'vitest';
import { SUPPORTED_SITE_LOCALES } from '@/i18n/locale-metadata';
import {
  getContainerPageCopy,
  getDesktopPageCopy,
  getHomePageCopy,
} from './site-page-copy';

describe('site page copy', () => {
  it('resolves page-level copy for every supported locale', () => {
    for (const locale of SUPPORTED_SITE_LOCALES) {
      const homeCopy = getHomePageCopy(locale);
      const desktopCopy = getDesktopPageCopy(locale);
      const containerCopy = getContainerPageCopy(locale);

      expect(homeCopy.title).toBeTruthy();
      expect(homeCopy.description).toBeTruthy();
      expect(homeCopy.productOverviewVideoCopy.title).toBeTruthy();
      expect(homeCopy.supportingSection.eyebrow).toBeTruthy();
      expect(homeCopy.supportingSection.title).toBeTruthy();
      expect(homeCopy.supportingSection.description).toBeTruthy();
      expect(homeCopy.supportingSection.supportingLabel).toBeTruthy();
      expect(homeCopy.featuredHomepageVideos.youtube.title).toBeTruthy();
      expect(homeCopy.featuredHomepageVideos.bilibili.title).toBeTruthy();
      expect(homeCopy.supportingHomepageVideos).toHaveLength(2);
      expect(homeCopy.supportingHomepageVideos[0]?.title).toBeTruthy();
      expect(homeCopy.supportingHomepageVideos[1]?.title).toBeTruthy();

      expect(desktopCopy.title).toBeTruthy();
      expect(desktopCopy.description).toBeTruthy();
      expect(desktopCopy.runtimeNoteLabel).toBeTruthy();
      expect(desktopCopy.runtimeNoteCopy).toBeTruthy();
      expect(desktopCopy.runtimeNoteAriaLabel).toBeTruthy();

      expect(containerCopy.title).toBeTruthy();
      expect(containerCopy.description).toBeTruthy();
    }
  });
});
