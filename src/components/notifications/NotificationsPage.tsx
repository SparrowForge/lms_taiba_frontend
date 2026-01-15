"use client"

import { useState } from "react"
import { Button, Empty, Space, Tooltip, Badge } from "antd"
import { CheckOutlined, DeleteOutlined } from "@ant-design/icons"
import { INotification } from "@/types/notification"

export const mockNotifications: INotification[] = [
  {
    id: "1",
    title: "New Message",
    message: "You have received a new message from John Doe",
    read: false,
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
  },
  {
    id: "2",
    title: "Payment Successful",
    message: "Your payment of $99.99 has been processed successfully",
    read: false,
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
  },
  {
    id: "3",
    title: "System Update",
    message: "A new system update is available. Please restart your application",
    read: true,
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: "4",
    title: "Promotion",
    message: "Special 20% discount on premium plans this week",
    read: false,
    createdAt: new Date(Date.now() - 6 * 3600000).toISOString(),
  },
]

export default function NotificationsPage() {
  const [notifications, setNotifications] =
    useState<INotification[]>(mockNotifications)

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const formatTime = (createdAt: string) => {
    const diff = Date.now() - new Date(createdAt).getTime()
    const mins = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (mins < 1) return "just now"
    if (mins < 60) return `${mins}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  return (
    <div  style={{ height: "100%", maxWidth: 800, margin: "0 auto", padding: "24px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
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
          maxHeight: "calc(100vh - 220px)", // admin panel safe height
          overflowY: "auto",
          paddingRight: 8,
        }}
      >
        {notifications.length === 0 ? (
          <Empty description="No notifications" />
        ) : (
          notifications.map((notification) => {
            const isUnread = !notification.read

            return (
              <div
                key={notification.id}
                style={{
                  backgroundColor: isUnread ? "#e6f7ff" : "#fafafa",
                  border: `1px solid ${isUnread ? "#91d5ff" : "#d9d9d9"}`,
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
                        onClick={() => handleDelete(notification.id)}
                      />
                    </Tooltip>
                  </Space>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
