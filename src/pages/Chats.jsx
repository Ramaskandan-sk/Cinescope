import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import ChatList from '../components/ChatList'
import ChatWindow from '../components/ChatWindow'
import CreateChatModal from '../components/CreateChatModal'
import LoadingSpinner from '../components/LoadingSpinner'

const Chats = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [chats, setChats] = useState([])
  const [selectedChat, setSelectedChat] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    fetchChats()
  }, [])

  useEffect(() => {
    const chatId = searchParams.get('chat')
    if (chatId && chats.length > 0) {
      const chat = chats.find(c => c._id === chatId)
      if (chat) setSelectedChat(chat)
    }
  }, [searchParams, chats])

  const fetchChats = async () => {
    try {
      const res = await axios.get('/api/chats')
      setChats(res.data)
    } catch (error) {
      console.error('Error fetching chats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectChat = (chat) => {
    setSelectedChat(chat)
    setSearchParams({ chat: chat._id })
  }

  const handleChatCreated = (newChat) => {
    setChats([newChat, ...chats])
    setShowCreateModal(false)
    handleSelectChat(newChat)
  }

  if (loading) {
    return (
      <div className="container-custom section-padding">
        <LoadingSpinner size="lg" text="Loading chats..." />
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-5rem)]">
      <div className="container-custom h-full py-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold text-white">
            💬 <span className="gradient-text">Group Chats</span>
          </h1>
          <button onClick={() => setShowCreateModal(true)} className="btn-primary">
            + Create Chat
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-4 h-[calc(100%-5rem)]">
          {/* Chat List */}
          <div className="md:col-span-1">
            <ChatList
              chats={chats}
              selectedChat={selectedChat}
              onSelectChat={handleSelectChat}
            />
          </div>

          {/* Chat Window */}
          <div className="md:col-span-2">
            {selectedChat ? (
              <ChatWindow
                chat={selectedChat}
                onLeave={() => {
                  setSelectedChat(null)
                  fetchChats()
                }}
              />
            ) : (
              <div className="card h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-8xl mb-4">💬</div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Select a chat to start messaging
                  </h3>
                  <p className="text-gray-400">
                    Or create a new group chat to get started
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showCreateModal && (
        <CreateChatModal
          onClose={() => setShowCreateModal(false)}
          onChatCreated={handleChatCreated}
        />
      )}
    </div>
  )
}

export default Chats
