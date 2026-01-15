"use client"

import type React from "react"

import { useState } from "react"
import { Button, Input } from "antd"
import { SendOutlined } from "@ant-design/icons"

interface MessageFormProps {
  onSubmit: (message: string) => void
  placeholder?: string
  isReply?: boolean
}

export function MessageForm({ onSubmit, placeholder = "Share your thoughts...", isReply = false }: MessageFormProps) {
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!message.trim()) return

    setLoading(true)
    // Simulate a small delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 300))

    onSubmit(message)
    setMessage("")
    setLoading(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleSubmit()
    }
  }

  return (
    <div className="space-y-3">
      <Input.TextArea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={isReply ? 2 : 3}
        maxLength={500}
        showCount
        className="resize-none"
        style={{
          fontSize: "14px",
        }}
      />
      <div className="flex justify-end gap-2 mt-4">
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={handleSubmit}
          loading={loading}
          disabled={!message.trim()}
        >
          {isReply ? "Reply" : "Post"}
        </Button>
      </div>
    </div>
  )
}
