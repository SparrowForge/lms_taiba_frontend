'use client';

import { Card, Col, DatePicker, Form, Input, InputNumber, Row, Select, Switch } from 'antd';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useState } from 'react';

import { LOCALE_KEYS, type LocaleKey } from '@/constants/localizationKeys';

import type { ISemesterFormData } from './types';

interface SemesterCardProps {
  semester: ISemesterFormData;
  onUpdate: (field: keyof ISemesterFormData, value: unknown) => void;
  t: (key: LocaleKey, options?: Record<string, unknown>) => string;
}

function SemesterCard({ semester, onUpdate, t }: SemesterCardProps) {
  const [localName, setLocalName] = useState(semester.name);
  const [localRemarks, setLocalRemarks] = useState(semester.remarks);
  const [nameFocused, setNameFocused] = useState(false);
  const [remarksFocused, setRemarksFocused] = useState(false);

  useEffect(() => {
    if (!nameFocused && semester.name !== localName) setLocalName(semester.name);
  }, [semester.name, nameFocused, localName]);
  useEffect(() => {
    if (!remarksFocused && semester.remarks !== localRemarks) setLocalRemarks(semester.remarks);
  }, [semester.remarks, remarksFocused, localRemarks]);

  const flushName = useCallback(() => {
    setNameFocused(false);
    if (semester.name !== localName) onUpdate('name', localName);
  }, [localName, semester.name, onUpdate]);
  const flushRemarks = useCallback(() => {
    setRemarksFocused(false);
    if (semester.remarks !== localRemarks) onUpdate('remarks', localRemarks);
  }, [localRemarks, semester.remarks, onUpdate]);

  return (
    <Card size="small" style={{ marginBottom: 16 }} title={`Semester ${semester.termNo}`}>
      <Row gutter={[16, 8]}>
        <Col xs={24} sm={12} md={10}>
          <Form.Item label={t(LOCALE_KEYS.NAME)} style={{ marginBottom: 8 }}>
            <Input
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
              onFocus={() => setNameFocused(true)}
              onBlur={flushName}
              placeholder="Semester name"
            />
          </Form.Item>
        </Col>
        <Col xs={12} sm={6} md={4}>
          <Form.Item label={t(LOCALE_KEYS.TERM_NO)} style={{ marginBottom: 8 }}>
            <InputNumber
              value={semester.termNo}
              onChange={(value) => onUpdate('termNo', value)}
              min={1}
              max={20}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
        <Col xs={12} sm={6} md={10}>
          <Form.Item label={t(LOCALE_KEYS.DURATION_MONTHS)} style={{ marginBottom: 8 }}>
            <InputNumber
              value={semester.duration}
              min={1}
              max={12}
              precision={0}
              style={{ width: '100%', backgroundColor: '#f5f5f5', color: '#666' }}
              placeholder="Months"
              disabled
              title="Calculated from course duration (durationInMonths ÷ durationInSemesters)"
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[16, 8]}>
        <Col xs={12} sm={8} md={6}>
          <Form.Item label={t(LOCALE_KEYS.CREDIT_HOURS)} style={{ marginBottom: 8 }}>
            <InputNumber
              value={semester.creditHours}
              onChange={(value) => onUpdate('creditHours', value)}
              min={0}
              max={500}
              style={{ width: '100%', minWidth: 50 }}
              placeholder="—"
            />
          </Form.Item>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Form.Item label={t(LOCALE_KEYS.IS_BREAK)} style={{ marginBottom: 8 }}>
            <Switch
              value={semester.isBreak}
              onChange={(value: boolean) => onUpdate('isBreak', value)}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item label={t(LOCALE_KEYS.START_DATE)} style={{ marginBottom: 8 }}>
            <DatePicker
              value={semester.startDate ? dayjs(semester.startDate) : undefined}
              style={{ width: '100%' }}
              format="YYYY-MM-DD"
              disabled
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item label={t(LOCALE_KEYS.END_DATE)} style={{ marginBottom: 8 }}>
            <DatePicker
              value={semester.endDate ? dayjs(semester.endDate) : undefined}
              style={{ width: '100%' }}
              format="YYYY-MM-DD"
              disabled
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item label={t(LOCALE_KEYS.STATUS)} style={{ marginBottom: 8 }}>
            <Select
              value={semester.status}
              onChange={(value) => onUpdate('status', value)}
              style={{ width: '100%' }}
            >
              <Select.Option value="active">Active</Select.Option>
              <Select.Option value="inactive">Inactive</Select.Option>
              <Select.Option value="completed">Completed</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item label={t(LOCALE_KEYS.REMARKS)} style={{ marginBottom: 8 }}>
            <Input
              value={localRemarks}
              onChange={(e) => setLocalRemarks(e.target.value)}
              onFocus={() => setRemarksFocused(true)}
              onBlur={flushRemarks}
              placeholder="Remarks"
            />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
}

export default React.memo(SemesterCard);
