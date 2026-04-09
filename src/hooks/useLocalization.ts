import { useTranslations } from 'next-intl';
import { useCallback } from 'react';

import { LOCALE_KEYS, LocaleKey } from '@/constants/localizationKeys';

export const useLocalization = () => {
  const t = useTranslations();

  // Type-safe translation function
  const translate = useCallback(
    (key: LocaleKey, values?: Record<string, any>) => {
      return t(key, values);
    },
    [t],
  );

  return {
    t: translate,
    keys: LOCALE_KEYS,
  };
};
