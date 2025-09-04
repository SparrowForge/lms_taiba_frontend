'use client';

import {Drawer} from 'antd';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {EntityDetailsContent} from '@/components/ui/EntityDetailsContent';

import {useLocalization} from '@/hooks/useLocalization';
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
  const { selectedSubject, loadSubject, detailsStatus } = useSubjects();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.SUBJECT, { defaultValue: 'Subject' });
  useEffect(() => {
    if (visible && subjectId) {
      //getSubjectById(subjectId);
      loadSubject(subjectId);
    }
  }, [visible, subjectId, loadSubject]);

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
      title={t(LOCALE_KEYS.DETAILS_NAME, { name: entityName })}
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
