'use client';

import { Drawer } from 'antd';
import React from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';


import { useLocalization } from '@/hooks/useLocalization';


interface StudentFormDrawerProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const QuestionSetDrawer: React.FC<StudentFormDrawerProps> = ({
  visible,
  onCancel,
  onSuccess,
}) => {
 
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.QUESTION_SET, { defaultValue: 'Question Set' });


  const handleSuccess = () => {
    onSuccess();
  };

  const handleCancel = () => {
    onCancel();
  };



  return (
    <Drawer
      title={t(LOCALE_KEYS.CREATE_NAME, { name: entityName })}
      width={600}
      open={visible}
      onClose={handleCancel}
      destroyOnHidden={true}
    >
      
    </Drawer>
  );
};

export default QuestionSetDrawer;
