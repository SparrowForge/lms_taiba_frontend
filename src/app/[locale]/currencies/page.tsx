'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { MainLayout } from '@/components/layout/MainLayout';
import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { currencyService } from '@/services/currencyService';
import { ICurrency } from '@/types/currency';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Space,
  Switch,
  Table,
  Tag,
  Tooltip,
} from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

export default function CurrencyPage() {
  const t = useTranslations();
  const [currencies, setCurrencies] = useState<ICurrency[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    fetchCurrencies(pagination.current, pagination.pageSize);
  }, []);

  const fetchCurrencies = async (page: number, limit: number) => {
    setLoading(true);
    try {
      const response = await currencyService.getCurrencies({ page, limit });
      setCurrencies(response.data.items);
      setPagination({
        current: response.data.meta.page,
        pageSize: response.data.meta.limit,
        total: response.data.meta.total,
      });
    } catch (error) {
      console.error(error);
      message.error(t(LOCALE_KEYS.FAILED_NAME, { name: t(LOCALE_KEYS.CURRENCY) }));
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (newPagination: any) => {
    fetchCurrencies(newPagination.current, newPagination.pageSize);
  };

  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: ICurrency) => {
    setEditingId(record.id);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await currencyService.deleteCurrency(id);
      message.success(t(LOCALE_KEYS.CURRENCY_DELETED_SUCCESSFULLY));
      fetchCurrencies(pagination.current, pagination.pageSize);
    } catch (error) {
      console.error(error);
      message.error(t(LOCALE_KEYS.FAILED_DELETE_CURRENCY));
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);

      if (editingId) {
        await currencyService.updateCurrency(editingId, values);
        message.success(t(LOCALE_KEYS.CURRENCY_UPDATED_SUCCESSFULLY));
      } else {
        await currencyService.createCurrency(values);
        message.success(t(LOCALE_KEYS.CURRENCY_CREATED_SUCCESSFULLY));
      }

      setModalVisible(false);
      fetchCurrencies(pagination.current, pagination.pageSize);
    } catch (error) {
      console.error(error);
      message.error(t(LOCALE_KEYS.FAILED_SAVE_CURRENCY));
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    {
      title: t(LOCALE_KEYS.CURRENCY_CODE),
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: t(LOCALE_KEYS.NAME),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t(LOCALE_KEYS.SYMBOL),
      dataIndex: 'symbol',
      key: 'symbol',
    },
    {
      title: t(LOCALE_KEYS.IS_DEFAULT),
      dataIndex: 'isDefault',
      key: 'isDefault',
      render: (isDefault: boolean) =>
        isDefault ? <Tag color="green">{t(LOCALE_KEYS.YES)}</Tag> : <Tag>{t(LOCALE_KEYS.NO)}</Tag>,
    },
    {
      title: t(LOCALE_KEYS.ACTIONS),
      key: 'actions',
      render: (_: any, record: ICurrency) => (
        <Space>
          <Tooltip title={t(LOCALE_KEYS.EDIT)}>
            <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          </Tooltip>
          <Tooltip title={t(LOCALE_KEYS.DELETE)}>
            <Popconfirm
              title={t(LOCALE_KEYS.CONFIRM_DELETE_CURRENCY)}
              onConfirm={() => handleDelete(record.id)}
              okText={t(LOCALE_KEYS.OK)}
              cancelText={t(LOCALE_KEYS.CANCEL)}
            >
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="p-6">
          <Card
            title={t(LOCALE_KEYS.CURRENCY)}
            extra={
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                {t(LOCALE_KEYS.ADD_NAME, { name: t(LOCALE_KEYS.CURRENCY) })}
              </Button>
            }
          >
            <Table
              columns={columns}
              dataSource={currencies}
              rowKey="id"
              loading={loading}
              pagination={pagination}
              onChange={handleTableChange}
            />
          </Card>

          <Modal
            title={
              editingId
                ? t(LOCALE_KEYS.EDIT_NAME, { name: t(LOCALE_KEYS.CURRENCY) })
                : t(LOCALE_KEYS.ADD_NAME, { name: t(LOCALE_KEYS.CURRENCY) })
            }
            open={modalVisible}
            onOk={handleSave}
            onCancel={() => setModalVisible(false)}
            confirmLoading={saving}
            okText={t(LOCALE_KEYS.OK)}
            cancelText={t(LOCALE_KEYS.CANCEL)}
          >
            <Form form={form} layout="vertical">
              <Form.Item
                name="code"
                label={t(LOCALE_KEYS.CURRENCY_CODE)}
                rules={[
                  {
                    required: true,
                    message: t(LOCALE_KEYS.REQUIRED_FIELD, { field: t(LOCALE_KEYS.CURRENCY_CODE) }),
                  },
                ]}
              >
                <Input placeholder={t(LOCALE_KEYS.ENTER_CURRENCY_CODE)} />
              </Form.Item>
              <Form.Item
                name="name"
                label={t(LOCALE_KEYS.NAME)}
                rules={[
                  {
                    required: true,
                    message: t(LOCALE_KEYS.REQUIRED_FIELD, { field: t(LOCALE_KEYS.NAME) }),
                  },
                ]}
              >
                <Input placeholder={t(LOCALE_KEYS.ENTER_NAME, { name: t(LOCALE_KEYS.CURRENCY) })} />
              </Form.Item>
              <Form.Item
                name="symbol"
                label={t(LOCALE_KEYS.SYMBOL)}
                rules={[
                  {
                    required: true,
                    message: t(LOCALE_KEYS.REQUIRED_FIELD, { field: t(LOCALE_KEYS.SYMBOL) }),
                  },
                ]}
              >
                <Input placeholder={t(LOCALE_KEYS.ENTER_SYMBOL)} />
              </Form.Item>
              <Form.Item name="isDefault" label={t(LOCALE_KEYS.IS_DEFAULT)} valuePropName="checked">
                <Switch />
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
