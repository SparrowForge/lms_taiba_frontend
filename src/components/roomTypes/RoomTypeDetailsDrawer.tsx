'use client';

import {Drawer} from 'antd';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {EntityDetailsContent} from '@/components/ui/EntityDetailsContent';

import {useLocalization} from '@/hooks/useLocalization';
import {useRoomTypes} from '@/hooks/useRoomTypes';

import {Status} from '@/types/common';
import {IRoomType} from '@/types/roomType';

import {useCreateRoomTypeDetailsConfig} from './roomTypeConfig';


interface RoomTypeDetailsDrawerProps {
  roomTypeId?: number;
  visible: boolean;
  onClose: () => void;
  onEdit: (roomTypeId: number) => void;
}

const RoomTypeDetailsDrawer: React.FC<RoomTypeDetailsDrawerProps> = ({
  roomTypeId,
  visible,
  onClose,
  onEdit,
}) => {

  const { selectedRoomType, loadRoomType, detailsStatus } = useRoomTypes();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.ROOM_TYPE, { defaultValue: 'Room Type' });
  useEffect(() => {
    if (visible && roomTypeId) {
      //getRoomTypeById(roomTypeId);
      loadRoomType(roomTypeId);
    }
  }, [visible, roomTypeId, loadRoomType]);

  const handleEdit = (roomType: IRoomType) => {
    onEdit(roomType.id);
  };

  const config = useCreateRoomTypeDetailsConfig(
    selectedRoomType,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED ? detailsStatus.message || null : null,
    {
      embedded: true,
      onEdit: handleEdit,
    },
  );

  return (
    <Drawer
      key={roomTypeId} // Force remount when roomTypeId changes
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

export default RoomTypeDetailsDrawer;
