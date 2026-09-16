'use client';

import { Drawer } from 'antd';
import React, { useEffect } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { EntityDetailsContent } from '@/components/ui/EntityDetailsContent';

import { useLocalization } from '@/hooks/useLocalization';
import { use__PascalPlural__ } from '@/hooks/use__PascalPlural__';

import { I__PascalSingular__ } from '@/types/__camelSingular__';

import { useCreate__PascalSingular__DetailsConfig } from './__camelSingular__Config';

interface __PascalSingular__DetailsDrawerProps {
  __camelSingular__Id?: number;
  visible: boolean;
  onClose: () => void;
  onEdit: (__camelSingular__Id: number) => void;
}

const __PascalSingular__DetailsDrawer: React.FC<__PascalSingular__DetailsDrawerProps> = ({
  __camelSingular__Id,
  visible,
  onClose,
  onEdit,
}) => {
  const { selected__PascalSingular__, load__PascalSingular__, detailsStatus } =
    use__PascalPlural__();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.__CONST_SINGULAR__, { defaultValue: '__TitleSingular__' });
  useEffect(() => {
    if (visible && __camelSingular__Id) {
      load__PascalSingular__(__camelSingular__Id);
    }
  }, [visible, __camelSingular__Id, load__PascalSingular__]);

  const handleEdit = (__camelSingular__: I__PascalSingular__) => {
    onEdit(__camelSingular__.id);
  };

  const config = useCreate__PascalSingular__DetailsConfig(
    selected__PascalSingular__,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED ? detailsStatus.message || null : null,
    {
      embedded: true,
      onEdit: handleEdit,
    },
  );

  return (
    <Drawer
      key={__camelSingular__Id} // Force remount when __camelSingular__Id changes
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

export default __PascalSingular__DetailsDrawer;
