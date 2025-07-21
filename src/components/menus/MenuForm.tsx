'use client';

import React, {useEffect} from 'react';
import {Button, Form, Input, InputNumber, Select, Space} from 'antd';
import {useRouter} from 'next/navigation';
import {useMenus} from '@/hooks/useMenus';
import {usePanels} from '@/hooks/usePanels';
import {IMenu, IMenuCreate, IMenuUpdate} from '@/types/menu';
import {Status} from '@/types/common';
import {toast} from 'react-toastify';
import {useTranslations} from 'next-intl';
import {getErrorMessage} from '@/types/errors';

interface MenuFormProps {
  mode: 'create' | 'edit';
  menuId?: number;
  initialValues?: Partial<IMenuCreate | IMenuUpdate>;
  onSuccess?: () => void;
  onCancel?: () => void;
  embedded?: boolean;
}

const MenuForm: React.FC<MenuFormProps> = ({
  mode,
  menuId,
  initialValues,
  onSuccess,
  onCancel,
  embedded = false
}) => {
  const t = useTranslations();
  const entityName = t('menu');
  const router = useRouter();
  const [form] = Form.useForm();
  const { createMenu, editMenu, actionStatus, menus, loadMenus } = useMenus();
  const { panels, loadPanels } = usePanels();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues, form]);

  useEffect(() => {
    if (mode === 'create') {
      form.resetFields();
    }
  }, [mode, form]);

  useEffect(() => {
    if (panels.length === 0) {
      loadPanels();
    }
  }, [panels.length, loadPanels]);

  useEffect(() => {
    if (menus.length === 0) {
      loadMenus();
    }
  }, [menus.length, loadMenus]);

  const handleSubmit = async (values: Partial<IMenu>) => {
    try {
      if (mode === 'create') {
        await createMenu(values as IMenuCreate);
        toast.success(t('created_name', { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/menus');
        }
      } else if (mode === 'edit' && menuId) {
        await editMenu(menuId, values as IMenuUpdate);
        toast.success(t('updated_name', { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(`/menus/${menuId}`);
        }
      }
    } catch (error: unknown) {
      let errorMessage = t('failed_name', { name: entityName, defaultValue: `Failed to ${mode} ${entityName.toLowerCase()}` });

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

  const getSubmitText = () => (mode === 'create' ? t('create_name', { name: entityName }) : t('edit_name', { name: entityName }));

  const formContent = (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={initialValues}
    >
      <Form.Item
        name="panelId"
        label={t('panel')}
        rules={[{ required: true, message: t('required_field', { field: t('panel') }) }]}
      >
        <Select
          placeholder={t('select_panel')}
          loading={panels.length === 0}
          showSearch
          filterOption={(input, option) =>
            (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
          }
        >
          {panels.map((panel) => (
            <Select.Option key={panel.id} value={panel.id}>
              {panel.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="parentId"
        label={t('parent')}
      >
        <Select
          placeholder={t('select_parent')}
          allowClear
          showSearch
          filterOption={(input, option) =>
            (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
          }
        >
          {menus.map((menu) => (
            <Select.Option key={menu.id} value={menu.id}>
              {menu.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="name"
        label={t('name')}
        rules={[{ required: true, message: t('required_field', { field: t('name') }) }]}
      >
        <Input placeholder={t('enter_name', { name: t('name') })} />
      </Form.Item>

      <Form.Item
        name="route"
        label={t('route')}
        rules={[{ required: true, message: t('required_field', { field: t('route') }) }]}
      >
        <Input placeholder={t('enter_route')} />
      </Form.Item>

      <Form.Item
        name="sortOrder"
        label={t('sortOrder')}
        rules={[{ required: true, message: t('required_field', { field: t('sortOrder') }) }]}
      >
        <InputNumber
          placeholder={t('enter_sortOrder')}
          min={1}
          style={{ width: '100%' }}
        />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button
            type="primary"
            htmlType="submit"
            loading={actionStatus.status === Status.LOADING}
          >
            {getSubmitText()}
          </Button>
          <Button onClick={handleCancel}>
            {t('cancel')}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );

  return embedded ? formContent : (
    <div style={{ padding: '24px' }}>
      <div
        style={{
          maxWidth: '600px',
          margin: '0 auto',
          backgroundColor: '#fff',
          padding: '24px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
        role="main"
        aria-labelledby="form-title"
      >
        {formContent}
      </div>
    </div>
  );
};

export default MenuForm;
