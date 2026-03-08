import { useState, useEffect, useRef, useContext } from 'react'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'

const ChatWindow = ({ chat, onLeave }) => {
  const { user } = useContext(AuthContext)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (chat) {
      fetchMessages()
      markAsRead()
    }
  }, [chat])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`/api/chats/${chat._id}/messages`)
      setMessages(res.data)
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const markAsRead = async () => {
    try {
      await axios.put(`/api/chats/${chat._id}/read`)
    } catch (error) {
      console.error('Error marking as read:', error)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSend = async (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    setLoading(true)
    try {
      const res = await axios.post(`/api/chats/${chat._id}/messages`, {
        content: newMessage
      })
      setMessages([...messages, res.data])
      setNewMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message')
    } finally {
      setLoading(false)
    }
  }

  const handleLeave = async () => {
    if (!confirm('Are you sure you want to leave this chat?')) return
    
    try {
      await axios.post(`/api/chats/${chat._id}/leave`)
      alert('Left chat successfully')
      onLeave()
    } catch (error) {
      console.error('Error leaving chat:', error)
      alert('Failed to leave chat')
    }
  }

  return (
    <div className="card h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-dark-700 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-white text-xl">{chat.name}</h2>
          <p className="text-sm text-gray-400">
            {chat.members?.length || 0} members
          </p>
        </div>
        <button
          onClick={handleLeave}
          className="text-red-400 hover:text-red-300 text-sm transition"
        >
          Leave Chat
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isOwn = message.sender?._id === user?._id
          const isSystem = message.type === 'system'

          if (isSystem) {
            return (
              <div key={message._id} className="text-center">
                <span className="text-xs text-gray-500 bg-dark-700 px-3 py-1 rounded-full">
                  {message.content}
                </span>
              </div>
            )
          }

          return (
            <div
              key={message._id}
              className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[70%] ${isOwn ? 'order-2' : 'order-1'}`}>
                {!isOwn && (
                  <div className="text-xs text-gray-400 mb-1 ml-2">
                    {message.sender?.username || 'Unknown'}
                  </div>
                )}
                <div
                  className={`rounded-2xl px-4 py-2 ${
                    isOwn
                      ? 'bg-primary-600 text-white'
                      : 'bg-dark-700 text-gray-100'
                  }`}
                >
                  <p className="break-words">{message.content}</p>
                  <div
                    className={`text-xs mt-1 ${
                      isOwn ? 'text-primary-200' : 'text-gray-500'
                    }`}
                  >
                    {new Date(message.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 border-t border-dark-700">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="input-field flex-1"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !newMessage.trim()}
            className="btn-primary disabled:opacity-50"
          >
            {loading ? '...' : '📤'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ChatWindow
