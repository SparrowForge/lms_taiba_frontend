"use client"

import { CheckOutlined, DeleteOutlined } from "@ant-design/icons"
import { Button, Empty, Space, Tooltip, Badge } from "antd"
import { useEffect,  } from "react"
import { toast } from "react-toastify"

import { LOCALE_KEYS } from "@/constants/localizationKeys"

import { useLocalization } from "@/hooks/useLocalization"
import { useNotifications } from "@/hooks/useNotifications"

import { getErrorMessage } from "@/types/errors"
import { INotification } from "@/types/notification"





export default function NotificationsPage() {

    const {loadNotifications, notifications, markNotificationAsRead, markAllNotificationsAsRead, actionStatus, removeNotification} = useNotifications()
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.NOTIFICATION, { defaultValue: 'Notification' });

    useEffect(()=>{
      loadNotifications({page:1, limit:99})
    },[loadNotifications, actionStatus])


  const unreadCount = notifications.filter((n) => !n.readAt).length

  const handleMarkAsRead = async(id: number) => {
    try {
      await markNotificationAsRead(Number(id))
      toast.success(t(LOCALE_KEYS.CREATED_NAME, { name: entityName }));
    } catch (error) {
       let errorMessage = t(LOCALE_KEYS.FAILED_NAME, {
          name: entityName,
          defaultValue: `Failed to read ${entityName.toLowerCase()}`,
        });
  
        // Try to extract error message from API response
        if (error && typeof error === 'object' && 'response' in error) {
          const apiError = error as { response?: { data?: { message?: string } } };
          if (apiError.response?.data?.message) {
            errorMessage = apiError.response.data.message;
          }
        } else {
          // Use the helper function for other error types
          errorMessage = getErrorMessage(error);
        }
  
        toast.error(errorMessage);
      }
    }
  

  const handleMarkAllAsRead = async() => {
    try {
      await markAllNotificationsAsRead()
      toast.success(t(LOCALE_KEYS.CREATED_NAME, { name: entityName }));
    } catch (error) {
       let errorMessage = t(LOCALE_KEYS.FAILED_NAME, {
          name: entityName,
          defaultValue: `Failed to read all ${entityName.toLowerCase()}`,
        });
  
        // Try to extract error message from API response
        if (error && typeof error === 'object' && 'response' in error) {
          const apiError = error as { response?: { data?: { message?: string } } };
          if (apiError.response?.data?.message) {
            errorMessage = apiError.response.data.message;
          }
        } else {
          // Use the helper function for other error types
          errorMessage = getErrorMessage(error);
        }
  
        toast.error(errorMessage);
      }
  }

  const handleDelete = async (id: number) => {
    try {
      await removeNotification(Number(id))
      toast.success(t(LOCALE_KEYS.CREATED_NAME, { name: entityName }));
    } catch (error) {
       let errorMessage = t(LOCALE_KEYS.FAILED_NAME, {
          name: entityName,
          defaultValue: `Failed to remove ${entityName.toLowerCase()}`,
        });
  
        // Try to extract error message from API response
        if (error && typeof error === 'object' && 'response' in error) {
          const apiError = error as { response?: { data?: { message?: string } } };
          if (apiError.response?.data?.message) {
            errorMessage = apiError.response.data.message;
          }
        } else {
          // Use the helper function for other error types
          errorMessage = getErrorMessage(error);
        }
  
        toast.error(errorMessage);
      }
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
          notifications.map((notification:INotification) => {
            const isUnread = !notification.readAt

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
