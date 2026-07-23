import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { SOCKET_URL } from '../constants/app.jsx'

export function useMessagingSocket({ userId, conversationId, onConversationsChanged, onMessage }) {
  const [socket, setSocket] = useState(null)
  const [onlineUsers, setOnlineUsers] = useState([])

  useEffect(() => {
    if (!userId) return undefined
    const connection = io(SOCKET_URL, {
      query: { user_id: userId },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    })
    connection.on('connect_error', (error) => console.error('Messages socket error:', error))
    connection.on('get-online-user', setOnlineUsers)
    connection.on(`new-conversation::${userId}`, onConversationsChanged)
    connection.on(`update-conversations::${userId}`, onConversationsChanged)
    setSocket(connection)
    return () => connection.disconnect()
  }, [userId, onConversationsChanged])

  useEffect(() => {
    if (!socket || !conversationId) return undefined
    const event = `new-message::${conversationId}`
    socket.on(event, onMessage)
    return () => socket.off(event, onMessage)
  }, [socket, conversationId, onMessage])

  return { socket, onlineUsers }
}
