import React, { useEffect, useState } from 'react';
import { Drawer } from 'antd';
import { useSubjects } from '@/hooks/useSubjects';
import { ISubject } from '@/types/subject';
import SubjectForm from './SubjectForm';
import { useTranslations } from 'next-intl';

interface SubjectFormDrawerProps {
  mode: 'create' | 'edit';
  subjectId?: number;
  initialValues?: Partial<ISubject>;
  visible: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
}

const SubjectFormDrawer: React.FC<SubjectFormDrawerProps> = ({
  mode,
  subjectId,
  initialValues,
  visible,
  onCancel,
  onSuccess
}) => {
  const { getSubjectById, loadSubject } = useSubjects();
  const [subject, setSubject] = useState<ISubject | null>(null);
  const t = useTranslations();
  const entityName = t('subject', { defaultValue: 'Subject' });

  useEffect(() => {
    if (mode === 'edit' && subjectId && visible) {
      const foundSubject = getSubjectById(subjectId);
      if (foundSubject) {
        setSubject(foundSubject);
      } else {
        loadSubject(subjectId);
      }
    }
  }, [mode, subjectId, visible, getSubjectById, loadSubject]);

  const getTitle = () => (mode === 'create' ? t('create_name', { name: entityName }) : t('edit_name', { name: entityName }));

  const handleDrawerSuccess = () => {
    if (onSuccess) onSuccess();
    onCancel();
  };

  const getFormInitialValues = () => {
    if (mode === 'edit' && subject) {
      return {
        courseId: subject.courseId,
        name: subject.name,
        code: subject.code,
        creditHours: subject.creditHours,
        theoryHours: subject.theoryHours,
        practicalHours: subject.practicalHours,
        description: subject.description,
      };
    }
    return initialValues;
  };

  return (
    <Drawer
      title={getTitle()}
      open={visible}
      onClose={onCancel}
      width={500}
      placement="right"
    >
      <SubjectForm
        mode={mode}
        subjectId={subjectId}
        initialValues={getFormInitialValues()}
        onSuccess={handleDrawerSuccess}
        onCancel={onCancel}
        embedded={true}
      />
    </Drawer>
  );
};

export default SubjectFormDrawer; 