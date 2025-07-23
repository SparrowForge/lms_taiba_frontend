'use client';

import React, {useEffect, useState} from 'react';
import {Drawer} from 'antd';
import {IFaculty} from '@/types/faculty';
import {EntityDetailsContent} from '@/components/ui/EntityDetailsContent';
import {createFacultyDetailsConfig} from './facultyConfig';
import {useFaculties} from '@/hooks/useFaculties';
import {Status} from '@/types/common';
import {useTranslations} from 'next-intl';

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
  const [faculty, setFaculty] = useState<IFaculty | null>(null);
  const { faculties, getFacultyById, loadFaculty, detailsStatus } = useFaculties();
  const t = useTranslations();
  const entityName = t('faculty', { defaultValue: 'Faculty' });
  useEffect(() => {
    if (visible && facultyId) {
      // Try to get from current list first
      const existingFaculty = getFacultyById(facultyId);
      if (existingFaculty) {
        setFaculty(existingFaculty);
      } else {
        // Load from API if not in current list
        loadFaculty(facultyId);
      }
    } else {
      setFaculty(null);
    }
  }, [visible, facultyId, getFacultyById, loadFaculty]);

  // Update faculty when faculties list changes
  useEffect(() => {
    if (facultyId && faculties.length > 0) {
      const foundFaculty = getFacultyById(facultyId);
      if (foundFaculty) {
        setFaculty(foundFaculty);
      }
    }
  }, [faculties, facultyId, getFacultyById]);

  const handleEdit = (faculty: IFaculty) => {
    onEdit(faculty.id);
  };

  const config = createFacultyDetailsConfig(
    faculty,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED ? detailsStatus.message || null : null,
    {
      embedded: true,
      onEdit: handleEdit,
    }
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

export default FacultyDetailsDrawer; 