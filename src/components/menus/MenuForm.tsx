'use client';

import {Button, Form, Input, InputNumber, Select, Space} from 'antd';
import {useRouter} from 'next/navigation';
import React, {useEffect} from 'react';
import {toast} from 'react-toastify';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import StatusSelect from '@/components/ui/StatusSelect';


import {useLocalization} from '@/hooks/useLocalization';
import {useMenus} from '@/hooks/useMenus';
import {usePanels} from '@/hooks/usePanels';

import {Status} from '@/types/common';
import {getErrorMessage} from '@/types/errors';
import {IMenu, IMenuCreate, IMenuUpdate} from '@/types/menu';

import FormLayout from '../layout/FormLayout';


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
  embedded = false,
}) => {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.MENU, { defaultValue: 'Menu' });
  const router = useRouter();
  const [form] = Form.useForm();
  const { createMenu, editMenu, actionStatus, menus } = useMenus();
  const { panels, loadPanels } = usePanels();

  useEffect(() => {
    if (mode === 'create') {
      form.resetFields();
    }
  }, [mode, form]);

  useEffect(() => {
    if (panels.length === 0) {
      loadPanels({ page: 1, limit: 100 });
    }
  }, [panels.length, loadPanels]);

  const handleSubmit = async (values: Partial<IMenu>) => {
    try {
      if (mode === 'create') {
        await createMenu(values as IMenuCreate);
        toast.success(t(LOCALE_KEYS.CREATED_NAME, { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/menus');
        }
      } else if (mode === 'edit' && menuId) {
        await editMenu(menuId, values as IMenuUpdate);
        toast.success(t(LOCALE_KEYS.UPDATED_NAME, { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(`/menus/${menuId}`);
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
        name="panelId"
        label={t(LOCALE_KEYS.PANEL)}
        rules={[{ required: true, message: t(LOCALE_KEYS.PLEASE_ENTER_NAME_NAME, { name: t(LOCALE_KEYS.PANEL) }) }]}
      >
        <Select
          placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.PANEL) })}
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

      <Form.Item name="parentId" label={t(LOCALE_KEYS.PARENT)}>
        <Select
          placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.PARENT) })}
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
        label={t(LOCALE_KEYS.NAME)}
        rules={[{ required: true, message: t(LOCALE_KEYS.PLEASE_ENTER_NAME_NAME, { name: t(LOCALE_KEYS.NAME) }) }]}
      >
        <Input placeholder={t(LOCALE_KEYS.ENTER_NAME, { name: t(LOCALE_KEYS.NAME) })} />
      </Form.Item>

      <Form.Item
        name="route"
        label={t(LOCALE_KEYS.ROUTE)}
        rules={[{ required: true, message: t(LOCALE_KEYS.PLEASE_ENTER_NAME_NAME, { name: t(LOCALE_KEYS.ROUTE) }) }]}
      >
        <Input placeholder={t(LOCALE_KEYS.ENTER_ROUTE)} />
      </Form.Item>

      <Form.Item
        name="sortOrder"
        label={t(LOCALE_KEYS.SORT_ORDER)}
        rules={[{ required: true, message: t(LOCALE_KEYS.PLEASE_ENTER_NAME_NAME, { name: t(LOCALE_KEYS.SORT_ORDER) }) }]}
      >
        <InputNumber placeholder={t(LOCALE_KEYS.ENTER_SORT_ORDER)} min={1} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="status"
        label={t(LOCALE_KEYS.STATUS)}
        rules={[{ required: true, message: t(LOCALE_KEYS.PLEASE_ENTER_NAME_NAME, { name: t(LOCALE_KEYS.STATUS) }) }]}
      >
        <StatusSelect preset="binary" />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={actionStatus.status === Status.LOADING}>
            {getSubmitText()}
          </Button>
          <Button onClick={handleCancel}>{t(LOCALE_KEYS.CANCEL)}</Button>
        </Space>
      </Form.Item>
    </Form>
  );

  return embedded ? (
    formContent
  ) : (
    <FormLayout>
      {formContent}
    </FormLayout>
  );
};

export default MenuForm;
