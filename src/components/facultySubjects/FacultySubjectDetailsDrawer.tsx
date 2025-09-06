'use client';

import {Drawer} from 'antd';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';
import {Status} from '@/enums';

import {EntityDetailsContent} from '@/components/ui/EntityDetailsContent';

import {useFacultySubjects} from '@/hooks/useFacultySubjects';
import {useLocalization} from '@/hooks/useLocalization';

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
  const { selectedFacultySubject, loadFacultySubject, detailsStatus } = useFacultySubjects();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.FACULTY_SUBJECT, { defaultValue: 'Faculty Subject' });
  useEffect(() => {
    if (visible && facultySubjectId) {
      //getFacultySubjectById(facultySubjectId);
      loadFacultySubject(facultySubjectId);
    }
  }, [visible, facultySubjectId, loadFacultySubject]);

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
      key={facultySubjectId} // Force remount when facultySubjectId changes
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

export default FacultySubjectDetailsDrawer;
