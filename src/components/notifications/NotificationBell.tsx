"use client";

import { BellOutlined } from "@ant-design/icons";
import { Badge, Popover, List, Avatar, Empty, Button } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useNotifications } from "@/hooks/useNotifications";

import { INotification } from "@/types/notification";
import { getNotificationRoute } from "@/utils/getNotificationRoute";



interface NotificationBellProps {
  notifications: INotification[];
  unreadCount: number;
}

export function NotificationBell({
  notifications,
  unreadCount,
}: NotificationBellProps) {
  const [items, setItems] = useState<INotification[]>([]);
  const { markNotificationAsRead, markAllNotificationsAsRead } =
    useNotifications();
  const router = useRouter();

  useEffect(() => {
    setItems(notifications);
  }, [notifications]);

  // Mark single notification as read
  const handleRead = async (item: INotification) => {
    if (item.readAt) return;

    await markNotificationAsRead(item.id);

    setItems((prev) =>
      prev.map((n) =>
        n.id === item.id ? { ...n, readAt: new Date().toISOString() } : n
      )
    );
  };

  // Navigate to full notifications page
  const onSeeAllClick = () => {
    router.push("/notifications");
  };

  // Mark all notifications as read
  const handleMarkAllRead = async () => {
    await markAllNotificationsAsRead();

    setItems((prev) =>
      prev.map((n) => ({
        ...n,
        readAt: new Date().toISOString(),
      }))
    );
  };

  const content = (
    <div className="w-[360px]">
      {items.length === 0 ? (
        <Empty description="No notifications" />
      ) : (
        <>
          {/* Header */}
          <div className="flex justify-between items-center px-3 py-2 border-b">
            <span className="font-semibold">Notifications</span>

            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button type="link" size="small" onClick={handleMarkAllRead}>
                  Mark all read
                </Button>
              )}
              <Button type="link" size="small" onClick={onSeeAllClick}>
                See all
              </Button>
            </div>
          </div>

          {/* Notification List */}
          <List
            dataSource={items}
            itemLayout="horizontal"
            renderItem={(item) => {
              const isUnread = !item.readAt;
              const redirectUrl = getNotificationRoute(item);

              return (
                <List.Item
                  className={`px-3 cursor-pointer transition ${
                    isUnread ? "bg-blue-50" : ""
                  }`}
                  onClick={() => handleRead(item)}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        icon={<BellOutlined />}
                        style={{
                          backgroundColor: isUnread ? "#1677ff" : "#d9d9d9",
                        }}
                      />
                    }
                    title={
                      <div className="flex justify-between items-center gap-2">
                        <span
                          className={`text-sm ${
                            isUnread ? "font-semibold" : ""
                          }`}
                        >
                          {item.title}
                        </span>

                        {redirectUrl && (
                          <Button
                            type="link"
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRead(item);
                              router.push(redirectUrl);
                            }}
                          >
                            View
                          </Button>
                        )}
                      </div>
                    }
                    description={
                      <span className="text-xs text-gray-600">
                        {item.message}
                      </span>
                    }
                  />
                </List.Item>
              );
            }}
          />
        </>
      )}
    </div>
  );

  return (
    <Popover
      content={content}
      trigger="click"
      placement="bottomRight"
      arrow={false}
    >
      <Badge count={unreadCount} size="small">
        <BellOutlined className="text-xl cursor-pointer" />
      </Badge>
    </Popover>
  );
}
