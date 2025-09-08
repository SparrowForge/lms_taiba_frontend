'use client';

import React, { useEffect } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { MainLayout } from '@/components/layout/MainLayout';
import { useCreateRoomTypeDetailsConfig } from '@/components/roomTypes/roomTypeConfig';
import { EntityDetails } from '@/components/ui/EntityDetails';
import { EntityDetailsConfig } from '@/components/ui/EntityDetailsContent';

import { useLocalization } from '@/hooks/useLocalization';
import { useRoomTypes } from '@/hooks/useRoomTypes';

import { IRoomType } from '@/types/roomType';

export default function RoomTypeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { selectedRoomType, detailsStatus, loadRoomType } = useRoomTypes();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.ROOM_TYPE, { defaultValue: 'Room Type' });

  const resolvedParams = React.use(params);
  const roomTypeId = parseInt(resolvedParams.id);

  // Load room type if not already loaded
  useEffect(() => {
    //getRoomTypeById(roomTypeId);
    loadRoomType(roomTypeId);
  }, [loadRoomType, roomTypeId]);

  const config = useCreateRoomTypeDetailsConfig(
    selectedRoomType,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED
      ? detailsStatus.message || t(LOCALE_KEYS.FAILED_NAME, { name: entityName })
      : null,
  );

  return (
    <ProtectedRoute>
      <MainLayout>
        <EntityDetails config={config as EntityDetailsConfig<IRoomType>} />
      </MainLayout>
    </ProtectedRoute>
  );
}
