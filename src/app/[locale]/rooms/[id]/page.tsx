'use client';

import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import {useCreateRoomDetailsConfig} from '@/components/rooms/roomConfig';
import {EntityDetails} from '@/components/ui/EntityDetails';
import {EntityDetailsConfig} from '@/components/ui/EntityDetailsContent';

import {useLocalization} from '@/hooks/useLocalization';
import {useRooms} from '@/hooks/useRooms';

import {Status} from '@/types/common';
import {IRoom} from '@/types/room';

export default function RoomDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { selectedRoom, detailsStatus, loadRoom } = useRooms();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.ROOM, { defaultValue: 'Room' });

  const resolvedParams = React.use(params);
  const roomId = parseInt(resolvedParams.id);

  useEffect(() => {
    //getRoomById(roomId);
    loadRoom(roomId);
  }, [loadRoom, roomId]);

  const config = useCreateRoomDetailsConfig(
    selectedRoom,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED
      ? detailsStatus.message || t(LOCALE_KEYS.FAILED_NAME, { name: entityName })
      : null,
  );

  return (
    <ProtectedRoute>
      <MainLayout>
        <EntityDetails config={config as EntityDetailsConfig<IRoom>} />
      </MainLayout>
    </ProtectedRoute>
  );
}
