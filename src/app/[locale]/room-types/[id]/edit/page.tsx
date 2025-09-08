'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { MainLayout } from '@/components/layout/MainLayout';
import RoomTypeForm from '@/components/roomTypes/RoomTypeForm';
import EntityEditLoadingView from '@/components/ui/EntityEditLoadingView';
import EntityEditNotFoundView from '@/components/ui/EntityEditNotFoundView';
import { PageHeader } from '@/components/ui/PageHeader';

import { useLocalization } from '@/hooks/useLocalization';
import { useRoomTypes } from '@/hooks/useRoomTypes';

const RoomTypeEditPage: React.FC<{ params: Promise<{ id: string }> }> = ({ params }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const { selectedRoomType, detailsStatus, loadRoomType } = useRoomTypes();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.ROOM_TYPE, { defaultValue: 'Room Type' });

  useEffect(() => {
    const roomTypeId = parseInt(resolvedParams.id);
    //getRoomTypeById(roomTypeId);
    loadRoomType(roomTypeId);
  }, [resolvedParams.id, loadRoomType]);

  if (detailsStatus.status === Status.LOADING) {
    return <EntityEditLoadingView entityName={entityName} />;
  }

  if (!selectedRoomType || selectedRoomType.id !== parseInt(resolvedParams.id)) {
    return <EntityEditNotFoundView entityName={entityName} backRoute="/room-types" />;
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <PageHeader
          title={t(LOCALE_KEYS.EDIT_NAME, { name: entityName })}
          onBack={() => router.back()}
        />
        <RoomTypeForm
          mode="edit"
          roomTypeId={parseInt(resolvedParams.id)}
          initialValues={selectedRoomType}
        />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default RoomTypeEditPage;
