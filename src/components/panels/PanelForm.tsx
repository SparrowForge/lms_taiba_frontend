import React, {useEffect} from 'react';
import {Button, Form, Input, Space} from 'antd';
import {useRouter} from 'next/navigation';
import {usePanels} from '@/hooks/usePanels';
import {IPanel} from '@/types/panel';
import {Status} from '@/types/common';
import {toast} from 'react-toastify';
import {useTranslations} from 'next-intl';

interface PanelFormProps {
  mode: 'create' | 'edit';
  panelId?: number;
  initialValues?: Partial<IPanel>;
  onSuccess?: () => void;
  onCancel?: () => void;
  embedded?: boolean;
}

const PanelForm: React.FC<PanelFormProps> = ({
  mode,
  panelId,
  initialValues,
  onSuccess,
  onCancel,
  embedded = false
}) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const { createPanel, editPanel, actionStatus } = usePanels();
  const t = useTranslations();
  const entityName = t('panel', { defaultValue: 'Panel' });

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

  const handleSubmit = async (values: Partial<IPanel>) => {
    try {
      if (mode === 'create') {
        await createPanel(values);
        toast.success(t('created_name', { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/panels');
        }
      } else if (mode === 'edit' && panelId) {
        await editPanel(panelId, values);
        toast.success(t('updated_name', { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(`/panels/${panelId}`);
        }
      }
    } catch (error: any) {
      let errorMessage = t('failed_name', { name: entityName, defaultValue: `Failed to ${mode} ${entityName.toLowerCase()}` });
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
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
      aria-label={`${mode === 'create' ? t('create_name', { name: entityName }) : t('edit_name', { name: entityName })} form`}
      role="form"
    >
      <Form.Item
        name="name"
        label={t('name')}
        rules={[{ required: true, message: t('pleaseEnterName_name', { name: entityName }) }]}
      >
        <Input
          placeholder={t('name')}
          aria-label={t('name')}
          aria-required="true"
        />
      </Form.Item>
      <Form.Item style={{ marginTop: '32px', textAlign: embedded ? 'right' : 'center' }}>
        <Space size={embedded ? 'small' : 'large'}>
          <Button
            type="primary"
            htmlType="submit"
            size={embedded ? 'middle' : 'large'}
            style={{ minWidth: embedded ? '80px' : '120px' }}
            loading={actionStatus.status === Status.LOADING}
            aria-label={`${getSubmitText()} button`}
          >
            {getSubmitText()}
          </Button>
          <Button
            onClick={handleCancel}
            size={embedded ? 'middle' : 'large'}
            style={{ minWidth: embedded ? '80px' : '120px' }}
            aria-label={t('cancel', { defaultValue: 'Cancel' }) + ' button'}
          >
            {t('cancel', { defaultValue: 'Cancel' })}
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

export default PanelForm;
