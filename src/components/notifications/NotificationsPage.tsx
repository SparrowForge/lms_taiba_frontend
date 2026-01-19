"use client"

import { CheckOutlined, DeleteOutlined } from "@ant-design/icons"
import {
  Badge,
  Button,
  Empty,
  Pagination,
  Space,
  Tooltip,
} from "antd"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"

import { LOCALE_KEYS } from "@/constants/localizationKeys"
import { useLocalization } from "@/hooks/useLocalization"
import { useNotifications } from "@/hooks/useNotifications"
import { getErrorMessage } from "@/types/errors"
import { INotification } from "@/types/notification"
import { formatTime } from "@/utils/timeFormatUtils"

export default function NotificationsPage() {
  const {
    loadNotifications,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    removeNotification,
    pagination,
    actionStatus,
  } = useNotifications()

  const { t } = useLocalization()
  const entityName = t(LOCALE_KEYS.NOTIFICATION, {
    defaultValue: "Notification",
  })

  /** Pagination state */
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  /** Load notifications */
  useEffect(() => {
    loadNotifications({ page, limit })
  }, [page, limit, loadNotifications, actionStatus])

  const unreadCount = notifications.filter(n => !n.readAt).length

  const handleMarkAsRead = async (id: number) => {
    try {
      await markNotificationAsRead(id)
      toast.success(t(LOCALE_KEYS.READ_NAME, { name: entityName }))
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead()
      toast.success(t(LOCALE_KEYS.READ_NAME, { name: entityName }))
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await removeNotification(id)
      toast.success(t(LOCALE_KEYS.READ_NAME, { name: entityName }))
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }



  return (
    <div
      style={{
        height: "100%",
        maxWidth: 800,
        margin: "0 auto",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <h2 style={{ margin: 0 }}>
          Notifications
          {unreadCount > 0 && (
            <Badge count={unreadCount} style={{ marginLeft: 12 }} />
          )}
        </h2>

        {unreadCount > 0 && (
          <Button
            type="primary"
            icon={<CheckOutlined />}
            onClick={handleMarkAllAsRead}
          >
            Read All
          </Button>
        )}
      </div>

      {/* Scrollable List */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          paddingBottom: 80, // space for sticky pagination
        }}
      >
        {notifications.length === 0 ? (
          <Empty description="No notifications" />
        ) : (
          notifications.map((notification: INotification) => {
            const isUnread = !notification.readAt

            return (
              <div
                key={notification.id}
                style={{
                  backgroundColor: isUnread ? "#e6f7ff" : "#fafafa",
                  border: `1px solid ${
                    isUnread ? "#91d5ff" : "#d9d9d9"
                  }`,
                  borderRadius: 8,
                  padding: 16,
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div style={{ flex: 1, marginRight: 12 }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <h4
                        style={{
                          margin: 0,
                          marginRight: 8,
                          fontWeight: isUnread ? 600 : 400,
                        }}
                      >
                        {notification.title}
                      </h4>

                      {isUnread && (
                        <span
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            backgroundColor: "#1890ff",
                          }}
                        />
                      )}
                    </div>

                    <p style={{ margin: "8px 0", color: "#666" }}>
                      {notification.message}
                    </p>

                    <span style={{ fontSize: 12, color: "#999" }}>
                      {formatTime(notification.createdAt)}
                    </span>
                  </div>

                  <Space size="small">
                    {isUnread && (
                      <Tooltip title="Mark as read">
                        <Button
                          type="text"
                          size="small"
                          icon={<CheckOutlined />}
                          onClick={() =>
                            handleMarkAsRead(notification.id)
                          }
                        />
                      </Tooltip>
                    )}

                    <Tooltip title="Delete">
                      <Button
                        type="text"
                        size="small"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() =>
                          handleDelete(notification.id)
                        }
                      />
                    </Tooltip>
                  </Space>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Fixed Bottom Pagination */}
      {pagination?.total > limit && (
        <div
          style={{
            position: "sticky",
            bottom: 0,
            zIndex: 10,
            backgroundColor: "#fff",
            paddingTop: "12px",
            paddingBottom: "12px",
            borderTop: "1px solid #f0f0f0",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Pagination
            current={pagination.page}
            total={pagination.total}
            pageSize={pagination.limit}
            showSizeChanger
            showQuickJumper
            showTotal={(total, range) =>
              `${range[0]}-${range[1]} ${t(
                LOCALE_KEYS.OF
              )} ${total} ${entityName}s`
            }
            onChange={(newPage, newPageSize) => {
              setPage(newPage)
              if (newPageSize !== limit) {
                setLimit(newPageSize)
                setPage(1)
              }
            }}
          />
        </div>
      )}
    </div>
  )
}
