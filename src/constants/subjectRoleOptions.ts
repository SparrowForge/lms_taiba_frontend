import { LOCALE_KEYS } from './localizationKeys';

import { IStatusOption } from '@/types/statusSelect';

export const SUBJECT_ROLE_OPTIONS: IStatusOption[] = [
  {
    key: 'subject_role_instructor',
    value: 'instructor',
    labelKey: LOCALE_KEYS.INSTRUCTOR,
  },
  {
    key: 'subject_role_assistant',
    value: 'assistant',
    labelKey: LOCALE_KEYS.ASSISTANT,
  },
  {
    key: 'subject_role_coordinator',
    value: 'coordinator',
    labelKey: LOCALE_KEYS.COORDINATOR,
  },
  {
    key: 'subject_role_lecturer',
    value: 'lecturer',
    labelKey: LOCALE_KEYS.LECTURER,
  },
];

