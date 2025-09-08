'use client';

import { Drawer } from 'antd';
import React, { useEffect } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { EntityDetailsContent } from '@/components/ui/EntityDetailsContent';

import { useAttendances } from '@/hooks/useAttendances';
import { useLocalization } from '@/hooks/useLocalization';

import { IAttendance } from '@/types/attendance';

import { useCreateAttendanceDetailsConfig } from './attendanceConfig';

interface AttendanceDetailsDrawerProps {
  attendanceId?: number;
  visible: boolean;
  onClose: () => void;
  onEdit: (attendanceId: number) => void;
}

const AttendanceDetailsDrawer: React.FC<AttendanceDetailsDrawerProps> = ({
  attendanceId,
  visible,
  onClose,
  onEdit,
}) => {
  const { selectedAttendance, loadAttendance, detailsStatus } = useAttendances();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.ATTENDANCE, { defaultValue: 'Attendance' });

  useEffect(() => {
    if (visible && attendanceId) {
      //getAttendanceById(attendanceId);
      loadAttendance(attendanceId);
    }
  }, [visible, attendanceId, loadAttendance]);

  const handleEdit = (attendance: IAttendance) => {
    onEdit(attendance.id);
  };

  const config = useCreateAttendanceDetailsConfig(
    selectedAttendance,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED ? detailsStatus.message || null : null,
    {
      embedded: true,
      onEdit: handleEdit,
    },
  );

  return (
    <Drawer
      key={attendanceId} // Force remount when attendanceId changes
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

export default AttendanceDetailsDrawer;
