'use client';

import { Button, DatePicker, Empty, Form, Input, Select, Space, Spin, Tag, Timeline } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';

import { Status } from '@/enums';

import { useLeads } from '@/hooks/useLeads';

import { ILeadActivityCreate, LeadActivityOutcome, LeadActivityType } from '@/types/lead';

interface Props {
  leadId: number;
}

const TYPE_LABEL: Record<LeadActivityType, string> = {
  [LeadActivityType.CALL]: 'Call',
  [LeadActivityType.EMAIL]: 'Email',
  [LeadActivityType.SMS]: 'SMS',
  [LeadActivityType.WHATSAPP]: 'WhatsApp',
  [LeadActivityType.MEETING]: 'Meeting',
  [LeadActivityType.CAMPUS_VISIT]: 'Campus visit',
  [LeadActivityType.NOTE]: 'Note',
  [LeadActivityType.STAGE_CHANGE]: 'Stage change',
  [LeadActivityType.ASSIGNMENT]: 'Assignment',
};

const TYPE_COLOR: Record<LeadActivityType, string> = {
  [LeadActivityType.CALL]: 'blue',
  [LeadActivityType.EMAIL]: 'cyan',
  [LeadActivityType.SMS]: 'geekblue',
  [LeadActivityType.WHATSAPP]: 'green',
  [LeadActivityType.MEETING]: 'purple',
  [LeadActivityType.CAMPUS_VISIT]: 'magenta',
  [LeadActivityType.NOTE]: 'default',
  [LeadActivityType.STAGE_CHANGE]: 'gold',
  [LeadActivityType.ASSIGNMENT]: 'orange',
};

const LeadActivityTimeline: React.FC<Props> = ({ leadId }) => {
  const { activities, activitiesStatus, actionStatus, loadActivities, logActivity } = useLeads();
  const [form] = Form.useForm();

  useEffect(() => {
    loadActivities(leadId);
  }, [leadId, loadActivities]);

  const handleLog = async (values: Record<string, unknown>) => {
    try {
      await logActivity(leadId, {
        ...values,
        // Logging an interaction means it happened now unless stated otherwise.
        completedAt: values.completedAt
          ? (values.completedAt as dayjs.Dayjs).toISOString()
          : new Date().toISOString(),
        nextFollowUpAt: values.nextFollowUpAt
          ? (values.nextFollowUpAt as dayjs.Dayjs).toISOString()
          : undefined,
      } as ILeadActivityCreate);
      toast.success('Activity logged');
      form.resetFields();
      loadActivities(leadId);
    } catch {
      toast.error(actionStatus.message || 'Failed to log activity');
    }
  };

  return (
    <div>
      <Form form={form} layout="vertical" onFinish={handleLog} style={{ marginBottom: 24 }}>
        <Space wrap style={{ width: '100%' }} align="start">
          <Form.Item
            name="type"
            label="Type"
            rules={[{ required: true, message: 'Pick an activity type' }]}
            style={{ minWidth: 160 }}
          >
            <Select
              id="activity-type"
              placeholder="Call, email…"
              options={Object.values(LeadActivityType)
                .filter(
                  (v) => v !== LeadActivityType.STAGE_CHANGE && v !== LeadActivityType.ASSIGNMENT,
                )
                .map((v) => ({ label: TYPE_LABEL[v], value: v }))}
            />
          </Form.Item>

          <Form.Item
            name="subject"
            label="Subject"
            rules={[{ required: true, message: 'Add a short subject' }]}
            style={{ minWidth: 240 }}
          >
            <Input id="activity-subject" placeholder="Discussed fee structure" />
          </Form.Item>

          <Form.Item name="outcome" label="Outcome" style={{ minWidth: 180 }}>
            <Select
              id="activity-outcome"
              allowClear
              options={Object.values(LeadActivityOutcome).map((v) => ({
                label: v.replace(/_/g, ' '),
                value: v,
              }))}
            />
          </Form.Item>

          <Form.Item name="nextFollowUpAt" label="Next follow-up" style={{ minWidth: 200 }}>
            <DatePicker id="activity-nextFollowUpAt" showTime style={{ width: '100%' }} />
          </Form.Item>
        </Space>

        <Form.Item name="notes" label="Notes">
          <Input.TextArea id="activity-notes" rows={2} />
        </Form.Item>

        <Button type="primary" htmlType="submit" loading={actionStatus.status === Status.LOADING}>
          Log activity
        </Button>
      </Form>

      {activitiesStatus.status === Status.LOADING ? (
        <Spin />
      ) : activities.length === 0 ? (
        <Empty description="No activity yet" />
      ) : (
        <Timeline
          items={activities.map((activity) => ({
            color: TYPE_COLOR[activity.type] ?? 'gray',
            children: (
              <div>
                <Space wrap size={6}>
                  <Tag color={TYPE_COLOR[activity.type]}>
                    {TYPE_LABEL[activity.type] ?? activity.type}
                  </Tag>
                  <strong>{activity.subject}</strong>
                  {activity.isSystemGenerated && <Tag>system</Tag>}
                </Space>
                {activity.notes && (
                  <div style={{ marginTop: 4, whiteSpace: 'pre-wrap' }}>{activity.notes}</div>
                )}
                <div style={{ fontSize: 12, opacity: 0.65, marginTop: 4 }}>
                  {new Date(activity.completedAt ?? activity.createdAt).toLocaleString()}
                  {activity.performedBy?.name ? ` · ${activity.performedBy.name}` : ''}
                  {activity.outcome ? ` · ${activity.outcome.replace(/_/g, ' ')}` : ''}
                </div>
              </div>
            ),
          }))}
        />
      )}
    </div>
  );
};

export default LeadActivityTimeline;
