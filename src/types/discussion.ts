export interface IMessage {
  id: string
  author: string
  avatar: string
  content: string
  timestamp: Date
  likes: number
  liked: boolean
  replies?: IMessage[]
  parentId?: string
}