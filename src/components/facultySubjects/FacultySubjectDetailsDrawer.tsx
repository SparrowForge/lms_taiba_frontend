'use client';

import {Drawer} from 'antd';
import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';

import {EntityDetailsContent} from '@/components/ui/EntityDetailsContent';

import {useFacultySubjects} from '@/hooks/useFacultySubjects';

import {Status} from '@/types/common';
import {IFacultySubject} from '@/types/facultySubject';

import {useCreateFacultySubjectDetailsConfig} from './facultySubjectConfig';


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
  
  const { selectedFacultySubject, getFacultySubjectById, detailsStatus } = useFacultySubjects();
  const t = useTranslations();
  const entityName = t('facultySubject', { defaultValue: 'Faculty Subject' });
  useEffect(() => {
    if (visible && facultySubjectId) {
      getFacultySubjectById(facultySubjectId);
    }
  }, [visible, facultySubjectId, getFacultySubjectById]);

  const handleEdit = (facultySubject: IFacultySubject) => {
    onEdit(facultySubject.id);
  };

  const config = useCreateFacultySubjectDetailsConfig(
    selectedFacultySubject,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED ? detailsStatus.message || null : null,
    {
      embedded: true,
      onEdit: handleEdit,
    },
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
