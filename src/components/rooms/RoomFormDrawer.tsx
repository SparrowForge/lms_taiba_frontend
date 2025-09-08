'use client';

import {Drawer, Spin} from 'antd';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';
import {Status} from '@/enums';

import {useLocalization} from '@/hooks/useLocalization';
import {useRooms} from '@/hooks/useRooms';

import RoomForm from './RoomForm';

interface Props {
  mode: 'create' | 'edit';
  roomId?: number;
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const RoomFormDrawer: React.FC<Props> = ({ mode, roomId, visible, onCancel, onSuccess }) => {
  const { getRoomById, selectedRoom, loadRoom, detailsStatus } = useRooms();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.ROOM, { defaultValue: 'Room' });

  useEffect(() => {
    if (visible && mode === 'edit' && roomId) {
      //getRoomById(roomId);
      loadRoom(roomId);
    }
  }, [visible, mode, roomId, loadRoom]);

  if (mode === 'edit' && detailsStatus.status === Status.LOADING) {
    return <Spin />;
  }

  return (
    <Drawer
      key={roomId}
      title={
        mode === 'create'
          ? t(LOCALE_KEYS.CREATE_NAME, { name: entityName })
          : t(LOCALE_KEYS.EDIT_NAME, { name: entityName })
      }
      width={600}
      open={visible}
      onClose={onCancel}
      destroyOnHidden={true}
    >
      <RoomForm
        mode={mode}
        roomId={roomId}
        initialValues={selectedRoom || undefined}
        onSuccess={onSuccess}
        onCancel={onCancel}
        embedded
      />
    </Drawer>
  );
};

export default RoomFormDrawer;
