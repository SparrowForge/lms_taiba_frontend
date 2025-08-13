import {useTranslations} from 'next-intl';

import {LOCALE_KEYS, LocaleKey} from '@/constants/localizationKeys';

export const useLocalization = () => {
  const t = useTranslations();

  // Type-safe translation function
  const translate = (key: LocaleKey, values?: Record<string, any>) => {
    return t(key, values);
  };

  return {
    t: translate,
    keys: LOCALE_KEYS,
  };
};
