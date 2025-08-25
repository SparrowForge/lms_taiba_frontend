import {Card, Tabs} from 'antd';
import React, {useState} from 'react'

import {IRoleMenuPermissionCreate, IRoleMenuPermissionUpdate} from '@/types/roleMenuPermission';

import RoleMenuPermissionFormMultiple from './RoleMenuPermissionFormMultiple';
import RoleMenuPermissionFormSingle from './RoleMenuPermissionFormSingle';

export interface RoleMenuPermissionFormProps {
    mode: 'create' | 'edit';
    roleMenuPermissionId?: number;
    initialValues?: Partial<IRoleMenuPermissionCreate | IRoleMenuPermissionUpdate>;
    onSuccess?: () => void;
    onCancel?: () => void;
    embedded?: boolean;
  }

function RoleMenuPermissionFormTabView( props : RoleMenuPermissionFormProps) {
    const [activeTab, setActiveTab] = useState('single');

  return (
    <div className='flex-1 p-[12px] mb-[12px] overflow-auto' style={{ height: 'calc(100vh - 128px)' }}>
    <Card
      role="main"
      aria-labelledby="form-title"
    >
          <Tabs
    activeKey={activeTab}
    onChange={setActiveTab}
    items={[
      {
        key: 'single',
        label: 'Single Role Menu',
        children: <RoleMenuPermissionFormSingle {...props} />,
      },
      {
        key: 'multiple',
        label: 'Multiple Role Menu',
        children: <RoleMenuPermissionFormMultiple {...props} />,
      },
    ]}
  />
  </Card>
  </div>

  )
}

export default RoleMenuPermissionFormTabView
