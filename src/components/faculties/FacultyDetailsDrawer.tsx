'use client';

import {Drawer} from 'antd';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';
import {Status} from '@/enums';

import {EntityDetailsContent} from '@/components/ui/EntityDetailsContent';

import {useFaculties} from '@/hooks/useFaculties';
import {useLocalization} from '@/hooks/useLocalization';

import {IFaculty} from '@/types/faculty';

import {useCreateFacultyDetailsConfig} from './facultyConfig';

interface FacultyDetailsDrawerProps {
  facultyId?: number;
  visible: boolean;
  onClose: () => void;
  onEdit: (facultyId: number) => void;
}

const FacultyDetailsDrawer: React.FC<FacultyDetailsDrawerProps> = ({
  facultyId,
  visible,
  onClose,
  onEdit,
}) => {
  const { selectedFaculty, loadFaculty, detailsStatus } = useFaculties();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.FACULTY, { defaultValue: 'Faculty' });
  useEffect(() => {
    if (visible && facultyId) {
      //getFacultyById(facultyId);
      loadFaculty(facultyId);
    }
  }, [visible, facultyId, loadFaculty]);

  const handleEdit = (faculty: IFaculty) => {
    onEdit(faculty.id);
  };

  const config = useCreateFacultyDetailsConfig(
    selectedFaculty,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED ? detailsStatus.message || null : null,
    {
      embedded: true,
      onEdit: handleEdit,
    },
  );

  return (
    <Drawer
      key={facultyId} // Force remount when facultyId changes
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

export default FacultyDetailsDrawer;
