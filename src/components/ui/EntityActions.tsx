import {Button, Space} from 'antd'

interface EntityActionsProps {
  id: number
  onDelete?: (id: number) => void,
  onEdit?: (id: number) => void,
  onView?: (id: number) => void,
  onEditModal?: (id: number) => void,
  onViewModal?: (id: number) => void,
  viewText?: string,
  editText?: string,
  editModalText?: string,
  viewModalText?: string,
  deleteText?: string,
}

const EntityActions = ({
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
  deleteText = 'Delete'
}: EntityActionsProps) => {

  return (
    <Space size="small">
      {onView && (
        <Button
          type="link"
          size="small"
          style={{color: '#1890ff'}}
          onClick={() => onView(id)}
        >
          {viewText}
        </Button>
      )}
      {onViewModal && (
        <Button
          type="link"
          size="small"
          style={{color: '#722ed1'}}
          onClick={() => onViewModal(id)}
        >
          {viewModalText}
        </Button>
      )}
      {onEdit && (
        <Button
          type="link"
          size="small"
          style={{color: '#1890ff'}}
          onClick={() => onEdit(id)}
        >
          {editText}
        </Button>
      )}
      {onEditModal && (
        <Button
          type="link"
          size="small"
          style={{color: '#52c41a'}}
          onClick={() => onEditModal(id)}
        >
          {editModalText}
        </Button>
      )}
      {onDelete && (
        <Button
          type="link"
          size="small"
          danger
          onClick={() => onDelete(id)}
        >
          {deleteText}
        </Button>
      )}
    </Space>
  )
}

export default EntityActions 