import {DeleteOutlined, EditOutlined, EyeOutlined, MoreOutlined} from '@ant-design/icons';
import {Button, Dropdown, MenuProps, Spin} from 'antd';
import React, {useState} from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {useLocalization} from '@/hooks/useLocalization';

interface EntityActionsProps {
  id: number;
  onDelete?: (id: number) => Promise<void> | void;
  onEdit?: (id: number) => Promise<void> | void;
  onView?: (id: number) => Promise<void> | void;
  onEditModal?: (id: number) => Promise<void> | void;
  onViewModal?: (id: number) => Promise<void> | void;
  viewText?: string;
  editText?: string;
  editModalText?: string;
  viewModalText?: string;
  deleteText?: string;
  loadingStates?: {
    view?: boolean;
    edit?: boolean;
    delete?: boolean;
    viewModal?: boolean;
    editModal?: boolean;
  };
}

const EntityActions: React.FC<EntityActionsProps> = ({
  id,
  onDelete,
  onEdit,
  onView,
  onEditModal,
  onViewModal,
  viewText,
  editText,
  editModalText,
  viewModalText,
  deleteText,
  loadingStates = {},
}) => {
  const { t } = useLocalization();
  const [localLoading, setLocalLoading] = useState<{
    view: boolean;
    edit: boolean;
    delete: boolean;
    viewModal: boolean;
    editModal: boolean;
  }>({
    view: false,
    edit: false,
    delete: false,
    viewModal: false,
    editModal: false,
  });

  const handleAction = async (
    action: 'view' | 'edit' | 'delete' | 'viewModal' | 'editModal',
    handler?: (id: number) => Promise<void> | void,
  ) => {
    if (!handler) return;

    setLocalLoading((prev) => ({ ...prev, [action]: true }));

    try {
      await handler(id);
    } finally {
      setLocalLoading((prev) => ({ ...prev, [action]: false }));
    }
  };

  const isLoading = (action: keyof typeof loadingStates) =>
    loadingStates[action] || localLoading[action];

  // Build menu items dynamically based on available actions
  const menuItems: MenuProps['items'] = [];

  // Add View action
  if (onView) {
    menuItems.push({
      key: 'view',
      icon: isLoading('view') ? <Spin size="small" /> : <EyeOutlined />,
      label: viewText || t(LOCALE_KEYS.VIEW),
      onClick: () => handleAction('view', onView),
      disabled: isLoading('view'),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        color: '#1890ff',
      },
    });
  }

  // Add View Modal action
  if (onViewModal) {
    menuItems.push({
      key: 'viewModal',
      icon: isLoading('viewModal') ? <Spin size="small" /> : <EyeOutlined />,
      label: viewModalText || t(LOCALE_KEYS.QUICK_VIEW),
      onClick: () => handleAction('viewModal', onViewModal),
      disabled: isLoading('viewModal'),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        color: '#722ed1',
      },
    });
  }

  // Add Edit action
  if (onEdit) {
    menuItems.push({
      key: 'edit',
      icon: isLoading('edit') ? <Spin size="small" /> : <EditOutlined />,
      label: editText || t(LOCALE_KEYS.EDIT),
      onClick: () => handleAction('edit', onEdit),
      disabled: isLoading('edit'),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        color: '#1890ff',
      },
    });
  }

  // Add Edit Modal action
  if (onEditModal) {
    menuItems.push({
      key: 'editModal',
      icon: isLoading('editModal') ? <Spin size="small" /> : <EditOutlined />,
      label: editModalText || t(LOCALE_KEYS.QUICK_EDIT),
      onClick: () => handleAction('editModal', onEditModal),
      disabled: isLoading('editModal'),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        color: '#52c41a',
      },
    });
  }

  // Add Delete action (with danger styling)
  if (onDelete) {
    menuItems.push({
      key: 'delete',
      icon: isLoading('delete') ? <Spin size="small" /> : <DeleteOutlined />,
      label: deleteText || t(LOCALE_KEYS.DELETE),
      onClick: () => handleAction('delete', onDelete),
      disabled: isLoading('delete'),
      danger: true,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      },
    });
  }

  // If no actions are available, return null
  if (menuItems.length === 0) {
    return null;
  }

  return (
    <Dropdown
      menu={{
        items: menuItems,
        style: {
          minWidth: '140px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        },
      }}
      trigger={['click']}
      placement="bottomRight"
      arrow={{ pointAtCenter: true }}
      overlayStyle={{
        animationDuration: '0.2s',
      }}
    >
      <Button
        type="text"
        icon={<MoreOutlined />}
        size="small"
        className="hover:bg-gray-50 transition-colors duration-200"
        style={{
          borderRadius: '6px',
          border: '1px solid #f0f0f0',
          color: '#666',
        }}
        aria-label={`Actions for item ${id}`}
      />
    </Dropdown>
  );
};

export default EntityActions;
