'use client';

import FinancialYearForm from '@/components/accounting/FinancialYearForm';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { MainLayout } from '@/components/layout/MainLayout';
import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { useLocalization } from '@/hooks/useLocalization';
import { financialYearService } from '@/services/financialYearService';
import { IFinancialYear, IFinancialYearCreate, IFinancialYearUpdate } from '@/types/financialYear';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Popconfirm, Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function FinancialYearsPage() {
  const { t } = useLocalization();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<IFinancialYear[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<IFinancialYear | undefined>(undefined);
  const [formLoading, setFormLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await financialYearService.getAll();
      setData(result.data.items);
    } catch (error: any) {
      console.error('Failed to load financial years', error);
      // toast.error(t(LOCALE_KEYS.ERROR_LOADING_ENTITY, { entity: t(LOCALE_KEYS.FINANCIAL_YEARS) }));
      const errorMsg =
        error?.response?.data?.message ||
        t(LOCALE_KEYS.ERROR_LOADING_ENTITY, { entity: t(LOCALE_KEYS.FINANCIAL_YEARS) });
      toast.error(errorMsg);
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

  const handleEdit = (record: IFinancialYear) => {
    setEditingItem(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await financialYearService.delete(id);
      toast.success(t(LOCALE_KEYS.FINANCIAL_YEAR_DELETED_SUCCESSFULLY));
      loadData();
    } catch (error: any) {
      console.error('Failed to delete', error);
      // toast.error(t(LOCALE_KEYS.FAILED_DELETE_FINANCIAL_YEAR));
      const errorMsg =
        error?.response?.data?.message || t(LOCALE_KEYS.FAILED_DELETE_FINANCIAL_YEAR);
      toast.error(errorMsg);
    }
  };

  const handleFormSuccess = async (values: IFinancialYearCreate | IFinancialYearUpdate) => {
    setFormLoading(true);
    try {
      if (editingItem) {
        await financialYearService.update(editingItem.id, values as IFinancialYearUpdate);
        toast.success(t(LOCALE_KEYS.FINANCIAL_YEAR_UPDATED_SUCCESSFULLY));
      } else {
        await financialYearService.create(values as IFinancialYearCreate);
        toast.success(t(LOCALE_KEYS.FINANCIAL_YEAR_CREATED_SUCCESSFULLY));
      }
      setModalVisible(false);
      loadData();
    } catch (error: any) {
      console.error('Failed to save', error);
      // toast.error(t(LOCALE_KEYS.FAILED_SAVE_FINANCIAL_YEAR));
      const errorMsg = error?.response?.data?.message || t(LOCALE_KEYS.FAILED_SAVE_FINANCIAL_YEAR);
      toast.error(errorMsg);
    } finally {
      setFormLoading(false);
    }
  };

  const columns: ColumnsType<IFinancialYear> = [
    {
      title: t(LOCALE_KEYS.YEAR_NAME, { defaultValue: 'Year Name' }),
      dataIndex: 'yearName',
      key: 'yearName',
    },
    {
      title: t(LOCALE_KEYS.START_DATE, { defaultValue: 'Start Date' }),
      dataIndex: 'startDate',
      key: 'startDate',
      render: (date) => (date ? dayjs(date).format('YYYY-MM-DD') : '-'),
    },
    {
      title: t(LOCALE_KEYS.END_DATE, { defaultValue: 'End Date' }),
      dataIndex: 'endDate',
      key: 'endDate',
      render: (date) => (date ? dayjs(date).format('YYYY-MM-DD') : '-'),
    },
    {
      title: t(LOCALE_KEYS.STATUS, { defaultValue: 'Status' }),
      dataIndex: 'isClosed',
      key: 'isClosed',
      render: (isClosed) => (
        <Tag color={isClosed === 0 ? 'green' : 'red'}>
          {isClosed === 0
            ? t(LOCALE_KEYS.OPEN, { defaultValue: 'Open' })
            : t(LOCALE_KEYS.CLOSED, { defaultValue: 'Closed' })}
        </Tag>
      ),
    },
    {
      title: t(LOCALE_KEYS.ACTIONS, { defaultValue: 'Actions' }),
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title={t(LOCALE_KEYS.CONFIRM_DELETE_FINANCIAL_YEAR, {
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
            title={t(LOCALE_KEYS.FINANCIAL_YEARS, { defaultValue: 'Financial Years' })}
            extra={
              <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
                {t(LOCALE_KEYS.ADD_NAME, {
                  name: t(LOCALE_KEYS.FINANCIAL_YEAR),
                  defaultValue: 'Add Financial Year',
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
          <FinancialYearForm
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
