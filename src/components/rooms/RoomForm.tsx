'use client';

import {Button, Form, Input, InputNumber, Select, Space} from 'antd';
import {useRouter} from 'next/navigation';
import React, {useEffect} from 'react';
import {toast} from 'react-toastify';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import StatusSelect from '@/components/ui/StatusSelect';

import {useLocalization} from '@/hooks/useLocalization';
import {useRooms} from '@/hooks/useRooms';
import {useRoomTypes} from '@/hooks/useRoomTypes';

import {Status} from '@/types/common';
import {getErrorMessage} from '@/types/errors';
import {IRoom, IRoomCreate, IRoomUpdate} from '@/types/room';

import FormLayout from '../layout/FormLayout';

interface Props {
  mode: 'create' | 'edit';
  roomId?: number;
  initialValues?: Partial<IRoomCreate | IRoomUpdate>;
  onSuccess?: () => void;
  onCancel?: () => void;
  embedded?: boolean;
}

const RoomForm: React.FC<Props> = ({
  mode,
  roomId,
  initialValues,
  onSuccess,
  onCancel,
  embedded = false,
}) => {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.ROOM, { defaultValue: 'Room' });
  const router = useRouter();
  const [form] = Form.useForm();
  const { createRoom, editRoom, actionStatus } = useRooms();
  const { roomTypes, loadRoomTypes } = useRoomTypes();

  useEffect(() => {
    if (mode === 'create') {
      form.resetFields();
    }
  }, [mode, form]);

  useEffect(() => {
    loadRoomTypes();
  }, [loadRoomTypes]);

  const handleSubmit = async (values: Partial<IRoom>) => {
    try {
      if (mode === 'create') {
        await createRoom(values as IRoomCreate);
        toast.success(t(LOCALE_KEYS.CREATED_NAME, { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/rooms');
        }
      } else if (mode === 'edit' && roomId) {
        await editRoom(roomId, values as IRoomUpdate);
        toast.success(t(LOCALE_KEYS.UPDATED_NAME, { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/rooms');
        }
      }
    } catch (error: unknown) {
      let errorMessage = t(LOCALE_KEYS.FAILED_NAME, {
        name: entityName,
        defaultValue: `Failed to ${mode} ${entityName.toLowerCase()}`,
      });

      // Try to extract error message from API response
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as { response?: { data?: { message?: string } } };
        if (apiError.response?.data?.message) {
          errorMessage = apiError.response.data.message;
        }
      } else {
        // Use the helper function for other error types
        errorMessage = getErrorMessage(error);
      }

      toast.error(errorMessage);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  };

  const getSubmitText = () =>
    mode === 'create'
      ? t(LOCALE_KEYS.CREATE_NAME, { name: entityName })
      : t(LOCALE_KEYS.UPDATE_NAME, { name: entityName });

  const formContent = (
          <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={mode === 'edit' ? initialValues : undefined}>
      <Form.Item
        name="name"
        label={t(LOCALE_KEYS.NAME)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME_NAME, { name: entityName }),
          },
        ]}
      >
        <Input placeholder={t(LOCALE_KEYS.NAME)} />
      </Form.Item>

      <Form.Item
        name="roomTypeId"
        label={t(LOCALE_KEYS.ROOM_TYPE, { defaultValue: 'Room Type' })}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME_NAME, { name: t(LOCALE_KEYS.ROOM_TYPE, { defaultValue: 'Room Type' }) }),
          },
        ]}
      >
        <Select
          placeholder={t(LOCALE_KEYS.SELECT_ROOM_TYPE, { defaultValue: 'Select Room Type' })}
          loading={roomTypes.length === 0}
          showSearch
          filterOption={(input, option) =>
            (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
          }
        >
          {roomTypes.map((roomType) => (
            <Select.Option key={roomType.id} value={roomType.id}>
              {roomType.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="levelFloor"
        label={t(LOCALE_KEYS.LEVEL_FLOOR, { defaultValue: 'Level/Floor' })}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME_NAME, { name: t(LOCALE_KEYS.LEVEL_FLOOR, { defaultValue: 'Level/Floor' }) }),
          },
        ]}
      >
        <Input placeholder={t(LOCALE_KEYS.LEVEL_FLOOR, { defaultValue: 'Level/Floor' })} />
      </Form.Item>

      <Form.Item
        name="sittingCapacity"
        label={t(LOCALE_KEYS.SITTING_CAPACITY, { defaultValue: 'Sitting Capacity' })}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME_NAME, { name: t(LOCALE_KEYS.SITTING_CAPACITY, { defaultValue: 'Sitting Capacity' }) }),
          },
          {
            type: 'number',
            min: 1,
            message: 'Capacity must be at least 1',
          },
        ]}
      >
        <InputNumber
          min={1}
          style={{ width: '100%' }}
          placeholder={t(LOCALE_KEYS.SITTING_CAPACITY, { defaultValue: 'Sitting Capacity' })}
        />
      </Form.Item>

      <Form.Item
        name="examCapacity"
        label={t(LOCALE_KEYS.EXAM_CAPACITY, { defaultValue: 'Exam Capacity' })}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME_NAME, { name: t(LOCALE_KEYS.EXAM_CAPACITY, { defaultValue: 'Exam Capacity' }) }),
          },
          {
            type: 'number',
            min: 1,
            message: 'Capacity must be at least 1',
          },
        ]}
      >
        <InputNumber
          min={1}
          style={{ width: '100%' }}
          placeholder={t(LOCALE_KEYS.EXAM_CAPACITY, { defaultValue: 'Exam Capacity' })}
        />
      </Form.Item>

      <Form.Item
        name="status"
        label={t(LOCALE_KEYS.STATUS)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_SELECT_STATUS),
          },
        ]}
      >
        <StatusSelect preset="binary" />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={actionStatus.status === Status.LOADING}>
            {getSubmitText()}
          </Button>
          <Button onClick={handleCancel}>
            {t(LOCALE_KEYS.CANCEL)}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );

  return embedded ? formContent : <FormLayout>{formContent}</FormLayout>;
};

export default RoomForm;
