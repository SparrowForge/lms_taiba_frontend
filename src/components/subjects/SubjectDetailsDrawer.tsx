'use client';

import {Drawer} from 'antd';
import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';

import {EntityDetailsContent} from '@/components/ui/EntityDetailsContent';

import {useSubjects} from '@/hooks/useSubjects';

import {Status} from '@/types/common';
import {ISubject} from '@/types/subject';

import {useCreateSubjectDetailsConfig} from './subjectConfig';


interface SubjectDetailsDrawerProps {
  subjectId?: number;
  visible: boolean;
  onClose: () => void;
  onEdit: (subjectId: number) => void;
}

const SubjectDetailsDrawer: React.FC<SubjectDetailsDrawerProps> = ({
  subjectId,
  visible,
  onClose,
  onEdit,
}) => {
  
  const { selectedSubject, getSubjectById, detailsStatus } = useSubjects();
  const t = useTranslations();
  const entityName = t('subject', { defaultValue: 'Subject' });
  useEffect(() => {
    if (visible && subjectId) {
      getSubjectById(subjectId);
    }
  }, [visible, subjectId, getSubjectById]);

  const handleEdit = (subject: ISubject) => {
    onEdit(subject.id);
    onClose();
  };

  const config = useCreateSubjectDetailsConfig(
    selectedSubject,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED ? detailsStatus.message || null : null,
    {
      embedded: true,
      onEdit: handleEdit,
    },
  );

  return (
    <Drawer
      key={subjectId} // Force remount when subjectId changes
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

export default SubjectDetailsDrawer;
