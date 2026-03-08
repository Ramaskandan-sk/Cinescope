const ChatList = ({ chats, selectedChat, onSelectChat }) => {
  return (
    <div className="card h-full overflow-hidden flex flex-col">
      <div className="p-4 border-b border-dark-700">
        <h2 className="font-bold text-white">Your Chats</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {chats.length > 0 ? (
          <div className="divide-y divide-dark-700">
            {chats.map((chat) => (
              <button
                key={chat._id}
                onClick={() => onSelectChat(chat)}
                className={`w-full p-4 text-left hover:bg-dark-700 transition-colors ${
                  selectedChat?._id === chat._id ? 'bg-dark-700' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-lg">
                    {chat.name[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-white truncate">{chat.name}</h3>
                      {chat.lastMessage && (
                        <span className="text-xs text-gray-500">
                          {new Date(chat.updatedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 truncate">
                      {chat.members?.length || 0} members
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <div className="text-4xl mb-2">💬</div>
              <p>No chats yet</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatList
