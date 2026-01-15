"use client"

import { useState } from "react"
import { Card, Empty } from "antd"
import { IMessage } from "@/types/discussion"
import { MessageForm } from "./MessageForm"
import { MessageThread } from "./MessageThread"

export const MOCK_MESSAGES: IMessage[] = [
  {
    id: "1",
    author: "Alice Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AliceJohnson",
    content:
      "Hey everyone! I just finished the new feature and I think it turned out great. Would love to hear your feedback!",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    likes: 12,
    liked: false,
    replies: [
      {
        id: "1-1",
        author: "Bob Smith",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=BobSmith",
        content: "Looking good! I especially like the new UI components.",
        timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
        likes: 3,
        liked: false,
      },
      {
        id: "1-2",
        author: "Carol Davis",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=CarolDavis",
        content: "Great work! Did you consider accessibility for this?",
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        likes: 5,
        liked: false,
      },
    ],
  },
  {
    id: "2",
    author: "David Wilson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=DavidWilson",
    content: "I have a question about the implementation. How did you handle the state management?",
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    likes: 8,
    liked: false,
    replies: [
      {
        id: "2-1",
        author: "Alice Johnson",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AliceJohnson",
        content:
          "Great question! I used React hooks with context API for state management. It keeps things simple and clean.",
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        likes: 6,
        liked: false,
      },
    ],
  },
  {
    id: "3",
    author: "Emily Chen",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=EmilyChen",
    content: "Let's plan our next sprint. I think we should focus on performance optimization and bug fixes.",
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    likes: 15,
    liked: false,
    replies: [],
  },
]
export function DiscussionSection() {
  const [messages, setMessages] = useState<IMessage[]>(MOCK_MESSAGES)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)

  const handleAddMessage = (text: string, parentId?: string) => {
    const newMessage: IMessage = {
      id: Date.now().toString(),
      author: "Current User",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=CurrentUser",
      content: text,
      timestamp: new Date(),
      likes: 0,
      liked: false,
      replies: [],
      parentId: parentId,
    }

    if (parentId) {
      setMessages(
        messages.map((msg) => (msg.id === parentId ? { ...msg, replies: [...(msg.replies || []), newMessage] } : msg)),
      )
    } else {
      setMessages([newMessage, ...messages])
    }

    setReplyingTo(null)
  }

  const handleLike = (messageId: string, isReply?: boolean, parentId?: string) => {
    setMessages(
      messages.map((msg) => {
        if (isReply && parentId && msg.id === parentId) {
          return {
            ...msg,
            replies: msg.replies?.map((reply) =>
              reply.id === messageId
                ? { ...reply, liked: !reply.liked, likes: reply.liked ? reply.likes - 1 : reply.likes + 1 }
                : reply,
            ),
          }
        }
        if (msg.id === messageId) {
          return {
            ...msg,
            liked: !msg.liked,
            likes: msg.liked ? msg.likes - 1 : msg.likes + 1,
          }
        }
        return msg
      }),
    )
  }

  const handleDelete = (messageId: string, parentId?: string) => {
    if (parentId) {
      setMessages(
        messages.map((msg) =>
          msg.id === parentId ? { ...msg, replies: msg.replies?.filter((r) => r.id !== messageId) } : msg,
        ),
      )
    } else {
      setMessages(messages.filter((m) => m.id !== messageId))
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4 md:p-6">
      
      {/* IMessage Form */}
      <Card className="border-0 shadow-sm">
        <MessageForm onSubmit={(text) => handleAddMessage(text)} />
      </Card>

      {/* Messages Thread */}
      {messages.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <Empty description="No messages yet" style={{ marginTop: 48, marginBottom: 48 }} />
        </Card>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <MessageThread
              key={message.id}
              message={message}
              onReply={() => setReplyingTo(message.id)}
              onLike={() => handleLike(message.id)}
              onDelete={() => handleDelete(message.id)}
              onReplySubmit={(text) => handleAddMessage(text, message.id)}
              onReplyLike={(replyId) => handleLike(replyId, true, message.id)}
              onReplyDelete={(replyId) => handleDelete(replyId, message.id)}
              isReplyingTo={replyingTo === message.id}
              onCancelReply={() => setReplyingTo(null)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
