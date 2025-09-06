'use client';

import {Drawer, Spin} from 'antd';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';
import {Status} from '@/enums';

import {useLocalization} from '@/hooks/useLocalization';
import {useRoomTypes} from '@/hooks/useRoomTypes';


import RoomTypeForm from './RoomTypeForm';

interface Props {
  mode: 'create' | 'edit';
  roomTypeId?: number;
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const RoomTypeFormDrawer: React.FC<Props> = ({
  mode,
  roomTypeId,
  visible,
  onCancel,
  onSuccess,
}) => {
  const { getRoomTypeById, selectedRoomType, loadRoomType, detailsStatus } = useRoomTypes();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.ROOM_TYPE, { defaultValue: 'Room Type' });

  useEffect(() => {
    if (visible && mode === 'edit' && roomTypeId) {
      //getRoomTypeById(roomTypeId);
      loadRoomType(roomTypeId);
    }
  }, [visible, mode, roomTypeId, loadRoomType]);

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
      key={roomTypeId} // Force remount when roomTypeId changes
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
      <RoomTypeForm
        mode={mode}
        roomTypeId={roomTypeId}
        initialValues={selectedRoomType || undefined}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        embedded
      />
    </Drawer>
  );
};

export default RoomTypeFormDrawer;
