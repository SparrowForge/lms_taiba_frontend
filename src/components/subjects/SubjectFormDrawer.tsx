'use client';

import {Drawer} from 'antd';
import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';

import {useSubjects} from '@/hooks/useSubjects';

import SubjectForm from './SubjectForm';


interface SubjectFormDrawerProps {
  mode: 'create' | 'edit';
  subjectId?: number;
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const SubjectFormDrawer: React.FC<SubjectFormDrawerProps> = ({
  mode,
  subjectId,
  visible,
  onCancel,
  onSuccess,
}) => {
 
  const { getSubjectById, selectedSubject } = useSubjects();
  const t = useTranslations();
  const entityName = t('subject', { defaultValue: 'Subject' });
  useEffect(() => {
    if (visible && mode === 'edit' && subjectId) {
      getSubjectById(subjectId);
    }
  }, [visible, mode, subjectId, getSubjectById]);

  const handleSuccess = () => {
    onSuccess();
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <Drawer
      key={subjectId} // Force remount when subjectId changes
      title={
        mode === 'create'
          ? t('create_name', { name: entityName })
          : t('edit_name', { name: entityName })
      }
      width={600}
      open={visible}
      onClose={handleCancel}
      destroyOnHidden={true}
    >
      <SubjectForm
        mode={mode}
        subjectId={subjectId}
        initialValues={selectedSubject || undefined}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        embedded={true}
      />
    </Drawer>
  );
};

export default SubjectFormDrawer;
