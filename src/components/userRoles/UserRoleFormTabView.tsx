'use client';

import { Card, Tabs } from 'antd';
import React, { useState } from 'react';

import { IUserRoleCreate, IUserRoleUpdate } from '@/types/userRole';

import UserRoleFormMultiple from './UserRoleFormMultiple';
import UserRoleFormSingle from './UserRoleFormSingle';

export interface UserRoleFormProps {
  mode: 'create' | 'edit';
  userRoleId?: number;
  initialValues?: Partial<IUserRoleCreate | IUserRoleUpdate>;
  onSuccess?: () => void;
  onCancel?: () => void;
  embedded?: boolean;
}

function UserRoleFormTabView(props: UserRoleFormProps) {
  const [activeTab, setActiveTab] = useState('single');
  return (
    <div
      className="flex-1 p-[12px] mb-[12px] overflow-auto"
      style={{ height: 'calc(100vh - 128px)' }}
    >
      <Card role="main" aria-labelledby="form-title">
        <Tabs
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key as 'single' | 'multiple')}
          items={[
            {
              key: 'single',
              label: 'Single Role',
              children: <UserRoleFormSingle {...props} />,
            },
            {
              key: 'multiple',
              label: 'Multiple Roles',
              children: <UserRoleFormMultiple {...props} />,
            },
          ]}
        />
      </Card>
    </div>
  );
}

export default UserRoleFormTabView;
