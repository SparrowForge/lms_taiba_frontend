import React, {useState} from 'react';
import {Button, Space} from 'antd';

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
  viewText = 'View',
  editText = 'Edit',
  editModalText = 'Quick Edit',
  viewModalText = 'Quick View',
  deleteText = 'Delete',
  loadingStates = {}
}) => {
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
    editModal: false
  });

  const handleAction = async (
    action: 'view' | 'edit' | 'delete' | 'viewModal' | 'editModal',
    handler?: (id: number) => Promise<void> | void
  ) => {
    if (!handler) return;

    setLocalLoading(prev => ({ ...prev, [action]: true }));

    try {
      await handler(id);
    } finally {
      setLocalLoading(prev => ({ ...prev, [action]: false }));
    }
  };

  const isLoading = (action: keyof typeof loadingStates) =>
    loadingStates[action] || localLoading[action];

  return (
    <Space size="small" role="group" aria-label="Entity actions">
      {onView && (
        <Button
          type="link"
          size="small"
          style={{ color: '#1890ff' }}
          onClick={() => handleAction('view', onView)}
          loading={isLoading('view')}
          disabled={isLoading('view')}
          aria-label={`${viewText} item ${id}`}
        >
          {viewText}
        </Button>
      )}
      {onViewModal && (
        <Button
          type="link"
          size="small"
          style={{ color: '#722ed1' }}
          onClick={() => handleAction('viewModal', onViewModal)}
          loading={isLoading('viewModal')}
          disabled={isLoading('viewModal')}
          aria-label={`${viewModalText} item ${id}`}
        >
          {viewModalText}
        </Button>
      )}
      {onEdit && (
        <Button
          type="link"
          size="small"
          style={{ color: '#1890ff' }}
          onClick={() => handleAction('edit', onEdit)}
          loading={isLoading('edit')}
          disabled={isLoading('edit')}
          aria-label={`${editText} item ${id}`}
        >
          {editText}
        </Button>
      )}
      {onEditModal && (
        <Button
          type="link"
          size="small"
          style={{ color: '#52c41a' }}
          onClick={() => handleAction('editModal', onEditModal)}
          loading={isLoading('editModal')}
          disabled={isLoading('editModal')}
          aria-label={`${editModalText} item ${id}`}
        >
          {editModalText}
        </Button>
      )}
      {onDelete && (
        <Button
          type="link"
          size="small"
          danger
          onClick={() => handleAction('delete', onDelete)}
          loading={isLoading('delete')}
          disabled={isLoading('delete')}
          aria-label={`${deleteText} item ${id}`}
        >
          {deleteText}
        </Button>
      )}
    </Space>
  );
};

export default EntityActions;
