'use client';

import {Drawer} from 'antd';
import {useTranslations} from 'next-intl';
import React, {useEffect} from 'react';

import {EntityDetailsContent} from '@/components/ui/EntityDetailsContent';

import {useFaculties} from '@/hooks/useFaculties';

import {Status} from '@/types/common';
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
  
  const { selectedFaculty, getFacultyById, detailsStatus } = useFaculties();
  const t = useTranslations();
  const entityName = t('faculty', { defaultValue: 'Faculty' });
  useEffect(() => {
    if (visible && facultyId) {
      getFacultyById(facultyId);
    }
  }, [visible, facultyId, getFacultyById]);

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

export default FacultyDetailsDrawer;
