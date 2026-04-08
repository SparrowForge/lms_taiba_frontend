import { useCallback, useState } from 'react';

import { EntityStatus } from '@/enums';

import type { ISectionFormData } from '@/components/batches/BatchForm/types';

const defaultSectionRow = (): ISectionFormData => ({
  name: '',
  code: '',
  status: EntityStatus.ACTIVE,
  remarks: '',
});

export function useBatchFormSections(initial: ISectionFormData[] = []) {
  const [sections, setSections] = useState<ISectionFormData[]>(initial);

  const addSection = useCallback(() => {
    setSections((prev) => [...prev, defaultSectionRow()]);
  }, []);

  const removeSection = useCallback((index: number) => {
    setSections((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const updateSection = useCallback(
    (index: number, field: keyof ISectionFormData, value: string) => {
      setSections((prev) => {
        const next = [...prev];
        next[index] = { ...next[index], [field]: value };
        return next;
      });
    },
    [],
  );

  const resetSections = useCallback(() => setSections([]), []);

  return {
    sections,
    setSections,
    addSection,
    removeSection,
    updateSection,
    resetSections,
  };
}
