"use client";

import { BellOutlined } from "@ant-design/icons";
import { Badge, Popover, List, Avatar, Empty, Button } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useNotifications } from "@/hooks/useNotifications";

import { INotification } from "@/types/notification";


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
    const router = useRouter()

  useEffect(() => {
    setItems(notifications);
  }, [notifications]);


  const handleRead = async (item: INotification) => {
    if (item.readAt) return;

    await markNotificationAsRead(item.id);

    setItems((prev) =>
      prev.map((n) =>
        n.id === item.id ? { ...n, readAt: new Date().toISOString() } : n
      )
    );
  };

  const onSeeAllClick = () =>{
    return router.push("/notifications")
  }


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
    <div className="w-[340px]">
      {items.length === 0 ? (
        <Empty description="No notifications" />
      ) : (
        <>
          {/* Header */}
          <div className="flex justify-between items-center px-3 py-2 border-b">
            <span className="font-semibold">Notifications</span>
            {unreadCount > 0 && (
              <Button
                type="link"
                size="small"
                onClick={handleMarkAllRead}
              >
                Mark all read
              </Button>
            )}

            <Button
              type="link"
              size="small"
              onClick={onSeeAllClick}
            >
              See all
            </Button>
          </div>

          {/* List */}
          <List
            dataSource={items}
            renderItem={(item) => {
              const isUnread = !item.readAt;

              return (
                <List.Item
                  className={`cursor-pointer px-3 ${isUnread ? "bg-blue-50" : ""
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
                      <span className={isUnread ? "font-semibold" : ""}>
                        {item.title}
                      </span>
                    }
                    description={item.message}
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
