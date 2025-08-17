'use client';

import {Button, Card, Spin} from 'antd';
import {useRouter} from 'next/navigation';
import React, {useEffect} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {ProtectedRoute} from '@/components/auth/ProtectedRoute';
import {MainLayout} from '@/components/layout/MainLayout';
import RoomTypeForm from '@/components/roomTypes/RoomTypeForm';
import {PageHeader} from '@/components/ui/PageHeader';

import {useLocalization} from '@/hooks/useLocalization';
import {useRoomTypes} from '@/hooks/useRoomTypes';

import {Status} from '@/types/common';


const RoomTypeEditPage: React.FC<{ params: Promise<{ id: string }> }> = ({ params }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const { selectedRoomType, detailsStatus, getRoomTypeById } = useRoomTypes();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.ROOM_TYPE, { defaultValue: 'Room Type' });

  useEffect(() => {
    const roomTypeId = parseInt(resolvedParams.id);
    getRoomTypeById(roomTypeId);
  }, [resolvedParams.id, getRoomTypeById]);


  if (detailsStatus.status === Status.LOADING) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div style={{ padding: '24px', textAlign: 'center' }}>
            <Spin />
            <div>{t(LOCALE_KEYS.LOADING, { defaultValue: 'Loading...' })} {entityName}</div>
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  if (!selectedRoomType || selectedRoomType.id !== parseInt(resolvedParams.id)) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div style={{ padding: '24px' }}>
            <Card>
              <div style={{ textAlign: 'center', padding: '50px' }}>
                <h2>{t(LOCALE_KEYS.NOT_FOUND_NAME, { name: entityName })}</h2>
                <Button type="primary" onClick={() => router.push('/room-types')}>
                  {t(LOCALE_KEYS.BACK_TO_LIST_NAME, { name: entityName })}</Button>
              </div>
            </Card>
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <MainLayout>
          <PageHeader title={t(LOCALE_KEYS.EDIT_NAME, { name: entityName })} onBack={() => router.back()} />
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
