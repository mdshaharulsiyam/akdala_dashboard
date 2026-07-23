import { Avatar, Button, Empty, Input, Spin } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useLocation } from 'react-router-dom'
import { PageHeader, responseItems } from '../components/common'
import { useMessagingSocket } from '../hooks/useMessagingSocket'
import { useProfile } from '../hooks/useProfile'
import {
  useGetAllConversationsQuery,
  useGetConversationMessagesQuery,
  useMarkConversationReadMutation,
  useSendMessageMutation,
} from '../services/messagingApi'
import { assetUrl, formatDateTime } from '../utils/format'

export default function MessagesPage() {
  const location = useLocation()
  const [selected, setSelected] = useState(null)
  const [pendingId, setPendingId] = useState(location.state?.conversationId || null)
  const [message, setMessage] = useState('')
  const { profile } = useProfile()
  const { data: conversationsData, isLoading, refetch } = useGetAllConversationsQuery({ page: 1, limit: 50 }, { refetchOnMountOrArgChange: true })
  const conversations = responseItems(conversationsData)
  const { data: messagesData, isLoading: loadingMessages, refetch: refetchMessages } = useGetConversationMessagesQuery(
    { conversationId: selected?._id }, { skip: !selected },
  )
  const [send, { isLoading: sending }] = useSendMessageMutation()
  const [markRead] = useMarkConversationReadMutation()
  useEffect(() => {
    if (!pendingId || !conversations.length || selected) return
    const match = conversations.find((item) => item._id === pendingId)
    if (match) { setSelected(match); setPendingId(null); markRead(match._id) }
  }, [pendingId, conversations, selected, markRead])
  const changed = useCallback(() => refetch(), [refetch])
  const messageChanged = useCallback(() => { refetchMessages(); if (selected) markRead(selected._id) }, [refetchMessages, selected, markRead])
  const { socket, onlineUsers } = useMessagingSocket({ userId: profile?._id, conversationId: selected?._id, onConversationsChanged: changed, onMessage: messageChanged })
  const messages = responseItems(messagesData)
  const otherUser = (conversation) => conversation?.users?.find((user) => String(user._id) !== String(profile?._id))
  const submit = async () => {
    if (!message.trim() || !selected) return
    try {
      await send({ conversation_id: selected._id, message: message.trim() }).unwrap()
      setMessage('')
      socket?.emit('send-message', { conversationId: selected._id, users: selected.users })
    } catch (e) { toast.error(e?.data?.message || 'Failed to send message') }
  }
  return <>
    <PageHeader title="Messages" />
    <div className="message-layout">
      <aside className="conversation-list"><h3 style={{ padding: 14 }}>Conversations</h3>
        {isLoading ? <Spin /> : conversations.length ? conversations.map((conversation) => {
          const user = otherUser(conversation)
          return <button key={conversation._id} className={`conversation-item ${selected?._id === conversation._id ? 'active' : ''}`}
            onClick={() => { setSelected(conversation); markRead(conversation._id) }}>
            <div style={{ display: 'flex', gap: 10 }}><Avatar src={assetUrl(user?.img)} /><div><strong>{user?.name || 'Unknown'}</strong>
              <div className="muted">{onlineUsers.includes(String(user?._id)) ? 'Online' : conversation.last_message?.message || 'No messages yet'}</div></div></div>
          </button>
        }) : <Empty description="No conversations yet" />}</aside>
      <section className="chat">
        {selected ? <>
          <div className="messages">{loadingMessages ? <Spin /> : messages.length ? messages.map((item) =>
            <div key={item._id} className={`bubble ${String(item.sender?._id || item.sender) === String(profile?._id) ? 'mine' : ''}`}>
              <div>{item.message}</div><small>{formatDateTime(item.createdAt)}</small>
            </div>) : <Empty description="No messages yet. Start the conversation!" />}</div>
          <div className="composer"><Input value={message} onChange={(e) => setMessage(e.target.value)} onPressEnter={submit} placeholder="Type a message..." />
            <Button type="primary" onClick={submit} loading={sending}>Send</Button></div>
        </> : <Empty style={{ margin: 'auto' }} description="Select a conversation to start messaging" />}
      </section>
    </div>
  </>
}
