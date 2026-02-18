'use client';

import VoucherTypeForm from '@/components/accounting/VoucherTypeForm';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { MainLayout } from '@/components/layout/MainLayout';
import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { useLocalization } from '@/hooks/useLocalization';
import { voucherTypeService } from '@/services/voucherTypeService';
import { IVoucherType, IVoucherTypeCreate, IVoucherTypeUpdate } from '@/types/voucherType';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Popconfirm, Space, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function VoucherTypesPage() {
  const { t } = useLocalization();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<IVoucherType[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<IVoucherType | undefined>(undefined);
  const [formLoading, setFormLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await voucherTypeService.getAll();
      setData(result);
    } catch (error) {
      console.error('Failed to load voucher types', error);
      toast.error('Failed to load voucher types');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = () => {
    setEditingItem(undefined);
    setModalVisible(true);
  };

  const handleEdit = (record: IVoucherType) => {
    setEditingItem(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await voucherTypeService.delete(id);
      toast.success(t(LOCALE_KEYS.VOUCHER_TYPE_DELETED_SUCCESSFULLY));
      loadData();
    } catch (error) {
      console.error('Failed to delete', error);
      toast.error(t(LOCALE_KEYS.FAILED_DELETE_VOUCHER_TYPE));
    }
  };

  const handleFormSuccess = async (values: IVoucherTypeCreate | IVoucherTypeUpdate) => {
    setFormLoading(true);
    try {
      if (editingItem) {
        await voucherTypeService.update(editingItem.id, values as IVoucherTypeUpdate);
        toast.success(t(LOCALE_KEYS.VOUCHER_TYPE_UPDATED_SUCCESSFULLY));
      } else {
        await voucherTypeService.create(values as IVoucherTypeCreate);
        toast.success(t(LOCALE_KEYS.VOUCHER_TYPE_CREATED_SUCCESSFULLY));
      }
      setModalVisible(false);
      loadData();
    } catch (error) {
      console.error('Failed to save', error);
      toast.error(t(LOCALE_KEYS.FAILED_SAVE_VOUCHER_TYPE));
    } finally {
      setFormLoading(false);
    }
  };

  const columns: ColumnsType<IVoucherType> = [
    {
      title: t(LOCALE_KEYS.ID, { defaultValue: 'ID' }),
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: t(LOCALE_KEYS.NAME, { defaultValue: 'Name' }),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t(LOCALE_KEYS.CREATED_AT, { defaultValue: 'Created At' }),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => (date ? dayjs(date).format('YYYY-MM-DD HH:mm') : '-'),
    },
    {
      title: t(LOCALE_KEYS.UPDATED_AT, { defaultValue: 'Updated At' }),
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (date) => (date ? dayjs(date).format('YYYY-MM-DD HH:mm') : '-'),
    },
    {
      title: t(LOCALE_KEYS.ACTIONS, { defaultValue: 'Actions' }),
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title={t(LOCALE_KEYS.CONFIRM_DELETE_VOUCHER_TYPE, {
              defaultValue: 'Are you sure to delete?',
            })}
            onConfirm={() => handleDelete(record.id)}
            okText={t(LOCALE_KEYS.OK, { defaultValue: 'OK' })}
            cancelText={t(LOCALE_KEYS.CANCEL, { defaultValue: 'Cancel' })}
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="p-4">
          <Card
            title={t(LOCALE_KEYS.VOUCHER_TYPES, { defaultValue: 'Voucher Types' })}
            extra={
              <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
                {t(LOCALE_KEYS.ADD_NAME, {
                  name: t(LOCALE_KEYS.VOUCHER_TYPE),
                  defaultValue: 'Add Voucher Type',
                })}
              </Button>
            }
          >
            <Table
              columns={columns}
              dataSource={data}
              rowKey="id"
              loading={loading}
              pagination={{ pageSize: 10 }}
            />
          </Card>
          <VoucherTypeForm
            visible={modalVisible}
            onCancel={() => setModalVisible(false)}
            onSuccess={handleFormSuccess}
            initialValues={editingItem}
            loading={formLoading}
          />
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
