import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';
import { useChat } from '../context/ChatContext';

const ChatBox = () => {
  const { user } = useContext(ShopContext);
  const { isChatOpen, setIsChatOpen, chatRecipient, setChatRecipient } = useChat();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [chatUsers, setChatUsers] = useState([]);
  const [activeUser, setActiveUser] = useState(chatRecipient);
  const messagesEndRef = useRef(null);

  // Fetch chat users (buyers/sellers)
  useEffect(() => {
    if (!user?.email) return;
    axios
      .get(`/api/messages/chat-users/${user.email}`)
      .then(res => setChatUsers(res.data))
      .catch(() => setChatUsers([]));
  }, [user, isChatOpen]);

  // Fetch chat history
  useEffect(() => {
    if (!user?.email || !activeUser) return;
    const fetchMessages = async () => {
      const res = await axios.get('/api/messages/history', {
        params: { user1: user.email, user2: activeUser }
      });
      setMessages(res.data);
    };
    fetchMessages();
  }, [user, activeUser]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Send a message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !user?.email || !activeUser) return;
    await axios.post('/api/messages/send', {
      sender: user.email,
      receiver: activeUser,
      content: input
    });
    setInput('');
    // Refresh messages
    const res = await axios.get('/api/messages/history', {
      params: { user1: user.email, user2: activeUser }
    });
    setMessages(res.data);
  };

  if (!isChatOpen) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg"
      style={{
        width: '90vw',
        maxWidth: 520, // increased overall width
        height: '60vh',
        maxHeight: 500,
        minWidth: 350,
        minHeight: 350,
        flexDirection: 'row',
      }}
    >
      {/* Sidebar with users */}
      <div className="w-56 border-r border-gray-200 dark:border-gray-700 overflow-y-auto h-full">
        <div className="font-bold p-2 text-gray-700 dark:text-gray-200">Chats</div>
        {chatUsers.length === 0 && (
          <div className="px-3 py-2 text-gray-400 text-sm">No chats yet</div>
        )}
        {chatUsers.map(email => {
          const username = email.split('@')[0];
          return (
            <button
              key={email}
              className={`w-full text-left px-3 py-2 hover:bg-blue-100 dark:hover:bg-gray-800 ${activeUser === email ? 'bg-blue-200 dark:bg-gray-700 font-semibold' : ''}`}
              onClick={() => {
                setActiveUser(email);
                setChatRecipient(email);
              }}
            >
              {username}
            </button>
          );
        })}
      </div>
      {/* Chat area */}
      <div className="flex-1 relative p-4 h-full flex flex-col">
        {/* Close button above scrollbar, not overlapping */}
        <div className="flex justify-end mb-2">
          <button
            className="w-8 h-8 flex items-center justify-center rounded-full text-white bg-red-600 hover:bg-red-700 transition-colors duration-200 text-2xl focus:outline-none"
            onClick={() => setIsChatOpen(false)}
            title="Close"
            aria-label="Close chat"
          >
            <span className="pointer-events-none select-none">×</span>
          </button>
        </div>
        <div className="flex-1 flex flex-col gap-2 p-2 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-blue-100 dark:scrollbar-thumb-gray-700 dark:scrollbar-track-gray-800">
          {messages
            .filter(msg =>
              (msg.sender === user.email && msg.receiver === activeUser) ||
              (msg.sender === activeUser && msg.receiver === user.email)
            )
            .map((msg, idx) => {
              const isMe = msg.sender === user.email;
              return (
                <div
                  key={idx}
                  className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`px-4 py-2 rounded-lg max-w-xs break-words shadow
                      ${isMe
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-gray-200 text-gray-900 rounded-bl-none dark:bg-gray-700 dark:text-gray-100'
                      }`}
                  >
                    <div className="text-xs font-semibold mb-1">
                      {isMe ? 'You' : msg.sender}
                    </div>
                    <div>{msg.content}</div>
                  </div>
                </div>
              );
            })}
          <div ref={messagesEndRef} />
        </div>
        <form className="flex gap-2 mt-2" onSubmit={sendMessage}>
          <input
            type="text"
            className="flex-1 px-3 py-2 rounded-l-lg border border-gray-300 dark:bg-gray-800 dark:text-white focus:outline-none"
            placeholder="Type a message..."
            value={input}
            onChange={e => setInput(e.target.value)}
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition"
            type="submit"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBox;