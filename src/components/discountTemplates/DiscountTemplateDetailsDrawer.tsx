'use client';

import { Drawer } from 'antd';
import React from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { EntityDetailsContent } from '@/components/ui/EntityDetailsContent';

import { useLocalization } from '@/hooks/useLocalization';
import { useDiscountTemplates } from '@/hooks/useDiscountTemplates';

import { IDiscountTemplate } from '@/types/discountTemplate';

import { useCreateDiscountTemplateDetailsConfig } from './discountTemplateConfig';

interface DiscountTemplateDetailsDrawerProps {
  discountTemplateId?: number;
  visible: boolean;
  onClose: () => void;
  onEdit: (id: number) => void;
}

const DiscountTemplateDetailsDrawer: React.FC<DiscountTemplateDetailsDrawerProps> = ({
  discountTemplateId,
  visible,
  onClose,
  onEdit,
}) => {
  const { selectedDiscountTemplate, loadDiscountTemplate, detailsStatus } = useDiscountTemplates();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.DISCOUNT_TEMPLATE, { defaultValue: 'Discount Template' });

  React.useEffect(() => {
    if (visible && discountTemplateId) {
      loadDiscountTemplate(discountTemplateId);
    }
  }, [visible, discountTemplateId, loadDiscountTemplate]);

  const handleEdit = (item: IDiscountTemplate) => {
    onEdit(item.id);
  };

  const config = useCreateDiscountTemplateDetailsConfig(
    selectedDiscountTemplate,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED ? detailsStatus.message || null : null,
    {
      embedded: true,
      onEdit: handleEdit,
    },
  );

  return (
    <Drawer
      key={discountTemplateId}
      title={t(LOCALE_KEYS.DETAILS_NAME, { name: entityName })}
      width={800}
      open={visible}
      onClose={onClose}
      destroyOnHidden={true}
    >
      <EntityDetailsContent config={config} />
    </Drawer>
  );
};

export default DiscountTemplateDetailsDrawer;

