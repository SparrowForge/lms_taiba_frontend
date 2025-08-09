import {Drawer} from 'antd';
import {useTranslations} from 'next-intl';
import React, {useEffect, useState} from 'react';

import {useSubjects} from '@/hooks/useSubjects';

import {ISubject} from '@/types/subject';

import SubjectForm from './SubjectForm';


interface SubjectFormDrawerProps {
  mode: 'create' | 'edit';
  subjectId?: number;
  visible: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
}

const SubjectFormDrawer: React.FC<SubjectFormDrawerProps> = ({
  mode,
  subjectId,
  visible,
  onCancel,
  onSuccess,
}) => {
  const [initialValues, setInitialValues] = useState<Partial<ISubject> | undefined>();
  const { getSubjectById, loadSubject } = useSubjects();
  const t = useTranslations();
  const entityName = t('subject', { defaultValue: 'Subject' });

  useEffect(() => {
    if (mode === 'edit' && subjectId && visible) {
      const foundSubject = getSubjectById(subjectId);
      if (foundSubject) {
        setInitialValues(foundSubject);
      } else {
        loadSubject(subjectId);
      }
    }
  }, [mode, subjectId, visible, getSubjectById, loadSubject]);

  const getTitle = () =>
    mode === 'create'
      ? t('create_name', { name: entityName })
      : t('edit_name', { name: entityName });

  const handleDrawerSuccess = () => {
    if (onSuccess) onSuccess();
    onCancel();
  };

  return (
    <Drawer title={getTitle()} open={visible} onClose={onCancel} width={500} placement="right">
      <SubjectForm
        mode={mode}
        subjectId={subjectId}
        initialValues={initialValues}
        onSuccess={handleDrawerSuccess}
        onCancel={onCancel}
        embedded={true}
      />
    </Drawer>
  );
};

export default SubjectFormDrawer;
