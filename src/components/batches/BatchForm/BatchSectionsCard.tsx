'use client';

import { Button, Card, Typography } from 'antd';
import React from 'react';

import { LOCALE_KEYS, type LocaleKey } from '@/constants/localizationKeys';

import type { ISectionFormData } from './types';
import SectionCard from './SectionCard';

const { Text } = Typography;

interface BatchSectionsCardProps {
  sections: ISectionFormData[];
  onAddSection: () => void;
  onRemoveSection: (index: number) => void;
  onUpdateSection: (index: number, field: keyof ISectionFormData, value: string) => void;
  t: (key: LocaleKey, options?: Record<string, unknown>) => string;
}

export default function BatchSectionsCard({
  sections,
  onAddSection,
  onRemoveSection,
  onUpdateSection,
  t,
}: BatchSectionsCardProps) {
  return (
    <Card
      title={`${t(LOCALE_KEYS.SECTIONS)} (${sections.length})`}
      style={{ width: '100%' }}
      extra={
        <Button type="dashed" size="small" onClick={onAddSection}>
          + {t(LOCALE_KEYS.ADD_NAME, { name: t(LOCALE_KEYS.SECTION) })}
        </Button>
      }
    >
      <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
        Add sections to create with this batch. Sections with name and code will be included.
      </Text>
      {sections.map((section, index) => (
        <SectionCard
          key={index}
          index={index}
          section={section}
          onUpdateSection={onUpdateSection}
          onRemoveSection={onRemoveSection}
          t={t}
        />
      ))}
    </Card>
  );
}
