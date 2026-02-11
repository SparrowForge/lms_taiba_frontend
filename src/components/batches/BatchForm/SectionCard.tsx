'use client';

import { Card, Col, Form, Input, Row, Select } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';

import { LOCALE_KEYS, type LocaleKey } from '@/constants/localizationKeys';

import type { ISectionFormData } from './types';

interface SectionCardProps {
  index: number;
  section: ISectionFormData;
  onUpdateSection: (index: number, field: keyof ISectionFormData, value: string) => void;
  onRemoveSection: (index: number) => void;
  t: (key: LocaleKey, options?: Record<string, unknown>) => string;
}

function SectionCard({ index, section, onUpdateSection, onRemoveSection, t }: SectionCardProps) {
  const [localName, setLocalName] = useState(section.name);
  const [localCode, setLocalCode] = useState(section.code);
  const [localRemarks, setLocalRemarks] = useState(section.remarks);
  const [nameFocused, setNameFocused] = useState(false);
  const [codeFocused, setCodeFocused] = useState(false);
  const [remarksFocused, setRemarksFocused] = useState(false);

  useEffect(() => {
    if (!nameFocused && section.name !== localName) setLocalName(section.name);
  }, [section.name, nameFocused, localName]);
  useEffect(() => {
    if (!codeFocused && section.code !== localCode) setLocalCode(section.code);
  }, [section.code, codeFocused, localCode]);
  useEffect(() => {
    if (!remarksFocused && section.remarks !== localRemarks) setLocalRemarks(section.remarks);
  }, [section.remarks, remarksFocused, localRemarks]);

  const flushName = useCallback(() => {
    setNameFocused(false);
    if (section.name !== localName) onUpdateSection(index, 'name', localName);
  }, [index, localName, section.name, onUpdateSection]);
  const flushCode = useCallback(() => {
    setCodeFocused(false);
    if (section.code !== localCode) onUpdateSection(index, 'code', localCode);
  }, [index, localCode, section.code, onUpdateSection]);
  const flushRemarks = useCallback(() => {
    setRemarksFocused(false);
    if (section.remarks !== localRemarks) onUpdateSection(index, 'remarks', localRemarks);
  }, [index, localRemarks, section.remarks, onUpdateSection]);

  const handleUpdate = useCallback(
    (field: keyof ISectionFormData, value: string) => {
      onUpdateSection(index, field, value);
    },
    [index, onUpdateSection],
  );
  const handleRemove = useCallback(() => {
    onRemoveSection(index);
  }, [index, onRemoveSection]);

  return (
    <Card
      size="small"
      style={{ marginBottom: 16 }}
      title={`${t(LOCALE_KEYS.SECTION)}`}
      extra={
        <a onClick={handleRemove} style={{ color: 'var(--ant-color-error)' }}>
          Remove
        </a>
      }
    >
      <Row gutter={[16, 8]}>
        <Col xs={24} sm={12}>
          <Form.Item label={t(LOCALE_KEYS.NAME)} style={{ marginBottom: 8 }}>
            <Input
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
              onFocus={() => setNameFocused(true)}
              onBlur={flushName}
              placeholder={t(LOCALE_KEYS.NAME)}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item label={t(LOCALE_KEYS.CODE)} style={{ marginBottom: 8 }}>
            <Input
              value={localCode}
              onChange={(e) => setLocalCode(e.target.value)}
              onFocus={() => setCodeFocused(true)}
              onBlur={flushCode}
              placeholder={t(LOCALE_KEYS.CODE)}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item label={t(LOCALE_KEYS.STATUS)} style={{ marginBottom: 8 }}>
            <Select
              value={section.status}
              onChange={(value) => handleUpdate('status', value)}
              style={{ width: '100%' }}
            >
              <Select.Option value="active">Active</Select.Option>
              <Select.Option value="inactive">Inactive</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item label={t(LOCALE_KEYS.REMARKS)} style={{ marginBottom: 8 }}>
            <Input
              value={localRemarks}
              onChange={(e) => setLocalRemarks(e.target.value)}
              onFocus={() => setRemarksFocused(true)}
              onBlur={flushRemarks}
              placeholder={t(LOCALE_KEYS.REMARKS)}
            />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
}

export default React.memo(SectionCard);
