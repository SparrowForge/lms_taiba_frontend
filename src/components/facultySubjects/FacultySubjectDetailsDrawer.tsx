'use client';

import React, {useEffect, useState} from 'react';
import {Drawer} from 'antd';
import {IFacultySubject} from '@/types/facultySubject';
import {EntityDetailsContent} from '@/components/ui/EntityDetailsContent';
import {createFacultySubjectDetailsConfig} from './facultySubjectConfig';
import {useFacultySubjects} from '@/hooks/useFacultySubjects';
import {Status} from '@/types/common';
import {useTranslations} from 'next-intl';

interface FacultySubjectDetailsDrawerProps {
  facultySubjectId?: number;
  visible: boolean;
  onClose: () => void;
  onEdit: (facultySubjectId: number) => void;
}

const FacultySubjectDetailsDrawer: React.FC<FacultySubjectDetailsDrawerProps> = ({
  facultySubjectId,
  visible,
  onClose,
  onEdit,
}) => {
  const [facultySubject, setFacultySubject] = useState<IFacultySubject | null>(null);
  const { facultySubjects, getFacultySubjectById, loadFacultySubject, detailsStatus } = useFacultySubjects();
  const t = useTranslations();
  const entityName = t('facultySubject', { defaultValue: 'Faculty Subject' });
  
  useEffect(() => {
    if (visible && facultySubjectId) {
      // Try to get from current list first
      const existingFacultySubject = getFacultySubjectById(facultySubjectId);
      if (existingFacultySubject) {
        setFacultySubject(existingFacultySubject);
      } else {
        // Load from API if not in current list
        loadFacultySubject(facultySubjectId);
      }
    } else {
      setFacultySubject(null);
    }
  }, [visible, facultySubjectId, getFacultySubjectById, loadFacultySubject]);

  // Update facultySubject when facultySubjects list changes
  useEffect(() => {
    if (facultySubjectId && facultySubjects.length > 0) {
      const foundFacultySubject = getFacultySubjectById(facultySubjectId);
      if (foundFacultySubject) {
        setFacultySubject(foundFacultySubject);
      }
    }
  }, [facultySubjects, facultySubjectId, getFacultySubjectById]);

  const handleEdit = (facultySubject: IFacultySubject) => {
    onEdit(facultySubject.id);
  };

  const config = createFacultySubjectDetailsConfig(
    facultySubject,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED ? detailsStatus.message || null : null,
    {
      embedded: true,
      onEdit: handleEdit,
    }
  );

  return (
    <Drawer
      title={t('details_name', { name: entityName })}
      width={800}
      open={visible}
      onClose={onClose}
      destroyOnHidden={true}
    >
      <EntityDetailsContent config={config} />
    </Drawer>
  );
};

export default FacultySubjectDetailsDrawer; 