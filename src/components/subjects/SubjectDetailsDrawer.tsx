import React, { useEffect, useState } from 'react';
import { Drawer } from 'antd';
import { useSubjects } from '@/hooks/useSubjects';
import { ISubject } from '@/types/subject';
import { Status } from '@/types/common';
import { useTranslations } from 'next-intl';
import { createSubjectDetailsConfig } from './subjectConfig';
import { EntityDetailsContent } from '@/components/ui/EntityDetailsContent';

interface SubjectDetailsDrawerProps {
  subjectId?: number;
  visible: boolean;
  onClose: () => void;
  onEdit?: (subjectId: number) => void;
}

const SubjectDetailsDrawer: React.FC<SubjectDetailsDrawerProps> = ({
  subjectId,
  visible,
  onClose,
  onEdit
}) => {
  const { subjects, listStatus, loadSubjects, getSubjectById, loadSubject } = useSubjects();
  const [subject, setSubject] = useState<ISubject | null>(null);
  const t = useTranslations();
  const entityName = t('subject', { defaultValue: 'Subject' });

  useEffect(() => {
    if (subjectId && visible) {
      const foundSubject = getSubjectById(subjectId);
      if (foundSubject) {
        setSubject(foundSubject);
      } else {
        loadSubject(subjectId);
      }
    }
  }, [subjectId, visible, getSubjectById, loadSubject]);

  useEffect(() => {
    if (subjects.length === 0) {
      loadSubjects();
    }
  }, [subjects.length, loadSubjects]);

  useEffect(() => {
    if (subjects.length > 0 && subjectId) {
      const foundSubject = getSubjectById(subjectId);
      if (foundSubject) {
        setSubject(foundSubject);
      }
    }
  }, [subjects, subjectId, getSubjectById]);

  const config = createSubjectDetailsConfig(
    subject,
    listStatus.status === Status.LOADING,
    listStatus.status === Status.FAILED ? listStatus.message || null : null,
    { embedded: true, onEdit: onEdit ? (p) => onEdit(p.id) : undefined }
  );

  return (
    <Drawer
      title={t('details_name', { name: entityName })}
      open={visible}
      onClose={onClose}
      width={500}
      placement="right"
    >
      <EntityDetailsContent config={config} />
    </Drawer>
  );
};

export default SubjectDetailsDrawer; 