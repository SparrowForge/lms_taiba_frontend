'use client';

import { Drawer, Spin } from 'antd';
import React, { useEffect } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { useDiscountTemplates } from '@/hooks/useDiscountTemplates';
import { useLocalization } from '@/hooks/useLocalization';

import DiscountTemplateForm from './DiscountTemplateForm';

interface DiscountTemplateFormDrawerProps {
  mode: 'create' | 'edit';
  discountTemplateId?: number;
  visible: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
}

const DiscountTemplateFormDrawer: React.FC<DiscountTemplateFormDrawerProps> = ({
  mode,
  discountTemplateId,
  visible,
  onCancel,
  onSuccess,
}) => {
  const { loadDiscountTemplate, selectedDiscountTemplate, detailsStatus } = useDiscountTemplates();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.DISCOUNT_TEMPLATE, { defaultValue: 'Discount Template' });

  useEffect(() => {
    if (visible && mode === 'edit' && discountTemplateId) {
      loadDiscountTemplate(discountTemplateId);
    }
  }, [visible, mode, discountTemplateId, loadDiscountTemplate]);

  const handleSuccess = () => {
    if (onSuccess) onSuccess();
  };

  const handleCancel = () => {
    onCancel();
  };

  if (mode === 'edit' && detailsStatus.status === Status.LOADING) {
    return <Spin />;
  }

  return (
    <Drawer
      key={discountTemplateId}
      title={
        mode === 'create'
          ? t(LOCALE_KEYS.CREATE_NAME, { name: entityName })
          : t(LOCALE_KEYS.EDIT_NAME, { name: entityName })
      }
      width={600}
      open={visible}
      onClose={handleCancel}
      destroyOnHidden={true}
    >
      <DiscountTemplateForm
        mode={mode}
        discountTemplateId={discountTemplateId}
        initialValues={selectedDiscountTemplate || undefined}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        embedded={true}
      />
    </Drawer>
  );
};

export default DiscountTemplateFormDrawer;

