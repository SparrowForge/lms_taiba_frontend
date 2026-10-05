'use client';

import { Card, Typography } from 'antd';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { MainLayout } from '@/components/layout/MainLayout';
import LeadDetailsDrawer from '@/components/leads/LeadDetailsDrawer';
import LeadPipelineBoard from '@/components/leads/LeadPipelineBoard';

import { useLeads } from '@/hooks/useLeads';

export default function LeadPipelinePage() {
  const router = useRouter();
  const { loadLeads } = useLeads();
  const [selectedId, setSelectedId] = useState<number | undefined>();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    loadLeads({ page: 1, limit: 100 });
  }, [loadLeads]);

  return (
    <ProtectedRoute>
      <MainLayout>
        <Card>
          <Typography.Title level={4}>Lead Pipeline</Typography.Title>
          <LeadPipelineBoard
            onOpenLead={(id) => {
              setSelectedId(id);
              setOpen(true);
            }}
          />
        </Card>
        <LeadDetailsDrawer
          leadId={selectedId}
          visible={open}
          onClose={() => setOpen(false)}
          onEdit={(id) => router.push(`/leads/${id}/edit`)}
        />
      </MainLayout>
    </ProtectedRoute>
  );
}
