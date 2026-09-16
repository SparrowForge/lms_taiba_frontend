import { Tag } from 'antd';
import React from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';

import { EntityDetailsConfig } from '@/components/ui/EntityDetailsContent';

import { useLocalization } from '@/hooks/useLocalization';

import { ILead, LeadStage } from '@/types/lead';

/** Stage colours run cool-to-warm along the funnel; terminal stages are decisive. */
const STAGE_COLOR: Record<LeadStage, string> = {
  [LeadStage.NEW]: 'default',
  [LeadStage.CONTACTED]: 'blue',
  [LeadStage.QUALIFIED]: 'cyan',
  [LeadStage.APPLIED]: 'geekblue',
  [LeadStage.ADMITTED]: 'purple',
  [LeadStage.ENROLLED]: 'green',
  [LeadStage.LOST]: 'red',
};

const STAGE_LABEL: Record<LeadStage, string> = {
  [LeadStage.NEW]: 'New',
  [LeadStage.CONTACTED]: 'Contacted',
  [LeadStage.QUALIFIED]: 'Qualified',
  [LeadStage.APPLIED]: 'Applied',
  [LeadStage.ADMITTED]: 'Admitted',
  [LeadStage.ENROLLED]: 'Enrolled',
  [LeadStage.LOST]: 'Lost',
};

export const leadStageColor = (stage: LeadStage): string => STAGE_COLOR[stage] ?? 'default';

export const leadStageLabel = (stage: LeadStage): string => STAGE_LABEL[stage] ?? stage;

export const LeadStageTag: React.FC<{ stage: LeadStage }> = ({ stage }) => (
  <Tag color={leadStageColor(stage)}>{leadStageLabel(stage)}</Tag>
);

export const getLeadDisplayName = (item: ILead) =>
  [item.firstName, item.middleName, item.lastName].filter(Boolean).join(' ') || `Lead #${item.id}`;

export const getLeadInitials = (item: ILead) =>
  `${item.firstName?.[0] ?? ''}${item.lastName?.[0] ?? ''}`.toUpperCase() || 'LD';

export const useCreateLeadDetailsConfig = (
  item: ILead | null,
  loading: boolean,
  error: string | null,
  options: {
    embedded?: boolean;
    onEdit?: (lead: ILead) => void;
    onBack?: () => void;
  } = {},
): EntityDetailsConfig<ILead> => {
  const { embedded = false, onEdit, onBack } = options;
  const { t } = useLocalization();

  const formatDate = (v: string) => (v ? new Date(v).toLocaleDateString() : 'N/A');
  const formatDateTime = (v: string) => (v ? new Date(v).toLocaleString() : 'N/A');

  return {
    name: t(LOCALE_KEYS.LEAD, { defaultValue: 'Lead' }),
    route: '/leads',
    getDisplayName: getLeadDisplayName,
    getInitials: getLeadInitials,
    item,
    loading,
    error,
    embedded,
    onEdit,
    onBack,
    fields: [
      { key: 'leadNo', label: 'Lead No' },
      {
        key: 'stage',
        label: t(LOCALE_KEYS.LEAD_STAGE, { defaultValue: 'Stage' }),
        render: (v: LeadStage) => <LeadStageTag stage={v} />,
      },
      { key: 'score', label: 'Score' },
      { key: 'email', label: t(LOCALE_KEYS.EMAIL) },
      { key: 'phone', label: t(LOCALE_KEYS.PHONE) },
      { key: 'alternatePhone', label: 'Alternate phone' },
      { key: 'city', label: 'City' },
      { key: 'gender', label: t(LOCALE_KEYS.GENDER) },
      { key: 'dateOfBirth', label: 'Date of birth', render: formatDate },
      {
        key: 'source',
        label: t(LOCALE_KEYS.LEAD_SOURCE, { defaultValue: 'Source' }),
        render: (v: ILead['source']) => v?.name ?? 'Unattributed',
      },
      { key: 'campaign', label: 'Campaign' },
      { key: 'referredBy', label: 'Referred by' },
      {
        key: 'course',
        label: t(LOCALE_KEYS.COURSE),
        render: (v: ILead['course']) => v?.name ?? 'N/A',
      },
      {
        key: 'batch',
        label: t(LOCALE_KEYS.BATCH),
        render: (v: ILead['batch']) => v?.name ?? 'N/A',
      },
      {
        key: 'branch',
        label: t(LOCALE_KEYS.BRANCH),
        render: (v: ILead['branch']) => v?.name ?? 'N/A',
      },
      { key: 'expectedIntakeDate', label: 'Expected intake', render: formatDate },
      {
        key: 'assignedTo',
        label: 'Assigned counsellor',
        render: (v: ILead['assignedTo']) => (v ? (v.name ?? `User #${v.id}`) : 'Unassigned'),
      },
      { key: 'lastContactedAt', label: 'Last contacted', render: formatDateTime },
      { key: 'nextFollowUpAt', label: 'Next follow-up', render: formatDateTime },
      { key: 'lostReason', label: 'Lost reason' },
      { key: 'lostNote', label: 'Lost note' },
      {
        key: 'convertedStudentId',
        label: 'Converted student',
        render: (v: number | null) => (v ? `Student #${v}` : 'Not converted'),
      },
      { key: 'convertedAt', label: 'Converted at', render: formatDateTime },
      { key: 'remarks', label: t(LOCALE_KEYS.REMARKS) },
      { key: 'createdAt', label: t(LOCALE_KEYS.CREATED_AT), render: formatDateTime },
      { key: 'updatedAt', label: t(LOCALE_KEYS.UPDATED_AT), render: formatDateTime },
    ],
  };
};
