'use client';

import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';
import {Status} from '@/enums';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {useCreateFacultyDetailsConfig} from '@/components/faculties/facultyConfig';
import {MainLayout} from '@/components/layout/MainLayout';
import {EntityDetails} from '@/components/ui/EntityDetails';
import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {useFaculties} from '@/hooks/useFaculties';
import {useLocalization} from '@/hooks/useLocalization';

import {IFaculty} from '@/types/faculty';

export default function FacultyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { selectedFaculty, detailsStatus, loadFaculty } = useFaculties();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.FACULTY, { defaultValue: 'Faculty' });

  const resolvedParams = React.use(params);
  const facultyId = parseInt(resolvedParams.id);

  // Load faculty if not already loaded
  useEffect(() => {
    //getFacultyById(facultyId);
    loadFaculty(facultyId);
  }, [loadFaculty, facultyId]);

  const config = useCreateFacultyDetailsConfig(
    selectedFaculty,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED
      ? detailsStatus.message || t(LOCALE_KEYS.FAILED_NAME, { name: entityName })
      : null,
  );

  return (
    <ProtectedRoute>
      <MainLayout>
        <EntityDetails config={config as EntityDetailsConfig<IFaculty>} />
      </MainLayout>
    </ProtectedRoute>
  );
}
