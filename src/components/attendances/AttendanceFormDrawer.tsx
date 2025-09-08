'use client';

import {Drawer, Spin} from 'antd';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';
import {Status} from '@/enums';

import {useAttendances} from '@/hooks/useAttendances';
import {useLocalization} from '@/hooks/useLocalization';

import AttendanceForm from './AttendanceForm';

interface AttendanceFormDrawerProps {
  mode: 'create' | 'edit';
  attendanceId?: number;
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const AttendanceFormDrawer: React.FC<AttendanceFormDrawerProps> = ({
  mode,
  attendanceId,
  visible,
  onCancel,
  onSuccess,
}) => {
  const { getAttendanceById, selectedAttendance, loadAttendance, detailsStatus } = useAttendances();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.ATTENDANCE, { defaultValue: 'Attendance' });

  useEffect(() => {
    if (visible && mode === 'edit' && attendanceId) {
      //getAttendanceById(attendanceId);
      loadAttendance(attendanceId);
    }
  }, [visible, mode, attendanceId, loadAttendance]);

  const handleSuccess = () => {
    onSuccess();
  };

  const handleCancel = () => {
    onCancel();
  };

  if (mode === 'edit' && detailsStatus.status === Status.LOADING) {
    return <Spin />;
  }

  return (
    <Drawer
      key={attendanceId} // Force remount when attendanceId changes
      title={
        mode === 'create'
          ? t(LOCALE_KEYS.CREATE_NAME, { name: entityName })
          : t(LOCALE_KEYS.EDIT_NAME, { name: entityName })
      }
      width={600}
      open={visible}
      onClose={handleCancel}
      destroyOnHidden={true}
    >
      <AttendanceForm
        mode={mode}
        attendanceId={attendanceId}
        initialValues={selectedAttendance || undefined}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        embedded={true}
      />
    </Drawer>
  );
};

export default AttendanceFormDrawer;
