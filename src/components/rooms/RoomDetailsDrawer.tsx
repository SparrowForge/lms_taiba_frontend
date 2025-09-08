'use client';

import { Drawer } from 'antd';
import React from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { EntityDetailsContent } from '@/components/ui/EntityDetailsContent';

import { useLocalization } from '@/hooks/useLocalization';
import { useRooms } from '@/hooks/useRooms';

import { IRoom } from '@/types/room';

import { useCreateRoomDetailsConfig } from './roomConfig';

interface RoomDetailsDrawerProps {
  roomId?: number;
  visible: boolean;
  onClose: () => void;
  onEdit: (roomId: number) => void;
}

const RoomDetailsDrawer: React.FC<RoomDetailsDrawerProps> = ({
  roomId,
  visible,
  onClose,
  onEdit,
}) => {
  const { selectedRoom, loadRoom, detailsStatus } = useRooms();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.ROOM, { defaultValue: 'Room' });

  React.useEffect(() => {
    if (visible && roomId) {
      //getRoomById(roomId);
      loadRoom(roomId);
    }
  }, [visible, roomId, loadRoom]);

  const handleEdit = (room: IRoom) => {
    onEdit(room.id);
  };

  const config = useCreateRoomDetailsConfig(
    selectedRoom,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED ? detailsStatus.message || null : null,
    {
      embedded: true,
      onEdit: handleEdit,
    },
  );

  return (
    <Drawer
      key={roomId} // Force remount when roomId changes
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

export default RoomDetailsDrawer;
