'use client';

import { Card, Empty, Spin, Tag, Tooltip } from 'antd';
import React from 'react';

import { Status } from '@/enums';

import { useLeads } from '@/hooks/useLeads';

import { ILead, LEAD_OPEN_STAGES, LeadStage } from '@/types/lead';

import { leadStageColor, leadStageLabel } from './leadConfig';

interface Props {
  onOpenLead: (leadId: number) => void;
  /** Stages shown as columns. Defaults to the open funnel plus Enrolled. */
  stages?: LeadStage[];
}

/**
 * Read-only Kanban view of the funnel.
 *
 * Cards are not drag-and-drop: a stage change needs a reason when it lands on
 * "lost", and conversion goes through its own flow, so moving a card silently
 * would bypass rules the API enforces. Clicking a card opens the lead, where
 * the stage control lives.
 */
const LeadPipelineBoard: React.FC<Props> = ({ onOpenLead, stages }) => {
  const { leads, listStatus } = useLeads();
  const columns = stages ?? [...LEAD_OPEN_STAGES, LeadStage.ENROLLED];

  if (listStatus.status === Status.LOADING) {
    return (
      <div style={{ padding: 48, textAlign: 'center' }}>
        <Spin />
      </div>
    );
  }

  const byStage = (stage: LeadStage) => leads.filter((l) => l.stage === stage);

  const overdue = (lead: ILead) =>
    !!lead.nextFollowUpAt && new Date(lead.nextFollowUpAt) < new Date();

  return (
    <div
      style={{
        display: 'flex',
        gap: 12,
        overflowX: 'auto',
        paddingBottom: 8,
        alignItems: 'flex-start',
      }}
    >
      {columns.map((stage) => {
        const items = byStage(stage);
        return (
          <div
            key={stage}
            style={{
              minWidth: 260,
              flex: '0 0 260px',
              background: 'rgba(0,0,0,0.02)',
              borderRadius: 6,
              padding: 8,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 8,
                paddingInline: 4,
              }}
            >
              <Tag color={leadStageColor(stage)} style={{ marginInlineEnd: 0 }}>
                {leadStageLabel(stage)}
              </Tag>
              <span style={{ fontVariantNumeric: 'tabular-nums', opacity: 0.65 }}>
                {items.length}
              </span>
            </div>

            {items.length === 0 ? (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="None"
                style={{ margin: '16px 0' }}
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {items.map((lead) => (
                  <Card
                    key={lead.id}
                    size="small"
                    hoverable
                    onClick={() => onOpenLead(lead.id)}
                    styles={{ body: { padding: 10 } }}
                  >
                    <div style={{ fontWeight: 600, marginBottom: 2 }}>
                      {[lead.firstName, lead.lastName].filter(Boolean).join(' ')}
                    </div>
                    <div style={{ fontSize: 12, opacity: 0.7 }}>{lead.leadNo}</div>
                    {lead.course?.name && (
                      <div style={{ fontSize: 12, marginTop: 4 }}>{lead.course.name}</div>
                    )}
                    <div
                      style={{
                        marginTop: 6,
                        display: 'flex',
                        gap: 6,
                        flexWrap: 'wrap',
                      }}
                    >
                      {overdue(lead) && (
                        <Tooltip
                          title={`Follow-up was due ${new Date(
                            lead.nextFollowUpAt as string,
                          ).toLocaleString()}`}
                        >
                          <Tag color="orange">Overdue</Tag>
                        </Tooltip>
                      )}
                      {!lead.assignedToUserId && <Tag>Unassigned</Tag>}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default LeadPipelineBoard;
