import {Button, Form, Input, Space} from 'antd';
import {useRouter} from 'next/navigation';
import React, {useEffect} from 'react';
import {toast} from 'react-toastify';

import {LOCALE_KEYS} from '@/constants/localizationKeys';
import {ENTITY_STATUS_OPTIONS} from '@/constants/statusOptions';
import {Status} from '@/enums';

import {useLocalization} from '@/hooks/useLocalization';
import {usePanels} from '@/hooks/usePanels';

import {getErrorMessage} from '@/types/errors';
import {IPanel} from '@/types/panel';

import FormLayout from '../layout/FormLayout';
import {StatusSelectFormItem} from '../ui/StatusSelect';

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
  embedded = false,
}) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const { createPanel, editPanel, actionStatus } = usePanels();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.PANEL, { defaultValue: 'Panel' });

  useEffect(() => {
    if (mode === 'create') {
      form.resetFields();
    }
  }, [mode, form]);

  const handleSubmit = async (values: Partial<IPanel>) => {
    try {
      if (mode === 'create') {
        await createPanel(values);
        toast.success(t(LOCALE_KEYS.CREATED_NAME, { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/panels');
        }
      } else if (mode === 'edit' && panelId) {
        await editPanel(panelId, values);
        toast.success(t(LOCALE_KEYS.UPDATED_NAME, { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(`/panels/${panelId}`);
        }
      }
    } catch (error: unknown) {
      let errorMessage = t(LOCALE_KEYS.FAILED_NAME, {
        name: entityName,
        defaultValue: `Failed to ${mode} ${entityName.toLowerCase()}`,
      });
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as { response?: { data?: { message?: string } } };
        if (apiError.response?.data?.message) {
          errorMessage = apiError.response.data.message;
        }
      } else {
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
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={mode === 'edit' ? initialValues : undefined}
      aria-label={`${mode === 'create' ? t(LOCALE_KEYS.CREATE_NAME, { name: entityName }) : t(LOCALE_KEYS.EDIT_NAME, { name: entityName })} form`}
      role="form"
    >
      <Form.Item
        name="name"
        label={t(LOCALE_KEYS.NAME)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.NAME) }),
          },
        ]}
      >
        <Input
          placeholder={t(LOCALE_KEYS.NAME)}
          aria-label={t(LOCALE_KEYS.NAME)}
          aria-required="true"
        />
      </Form.Item>
      <StatusSelectFormItem options={ENTITY_STATUS_OPTIONS} />
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
            aria-label={t(LOCALE_KEYS.CANCEL) + ' button'}
          >
            {t(LOCALE_KEYS.CANCEL)}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );

  return embedded ? formContent : <FormLayout>{formContent}</FormLayout>;
};

export default PanelForm;
