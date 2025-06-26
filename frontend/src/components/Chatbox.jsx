import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ChatBox = ({ currentUser, otherUser }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  // Fetch chat history
  useEffect(() => {
    const fetchMessages = async () => {
      const res = await axios.get('/api/messages/history', {
        params: { user1: currentUser, user2: otherUser }
      });
      setMessages(res.data);
    };
    fetchMessages();
  }, [currentUser, otherUser]);

  // Send a message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    await axios.post('/api/messages/send', {
      sender: currentUser,
      receiver: otherUser,
      content: input
    });
    setInput('');
    // Refresh messages
    const res = await axios.get('/api/messages/history', {
      params: { user1: currentUser, user2: otherUser }
    });
    setMessages(res.data);
  };

  return (
    <div className="border rounded-lg p-4 bg-white dark:bg-gray-900 max-w-md mx-auto">
      <div className="h-64 overflow-y-auto mb-2 bg-gray-50 dark:bg-gray-800 p-2 rounded">
        {messages.map((msg, idx) => (
          <div key={idx} className={`mb-2 ${msg.sender === currentUser ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block px-3 py-1 rounded ${msg.sender === currentUser ? 'bg-blue-200 dark:bg-blue-700' : 'bg-gray-200 dark:bg-gray-700'}`}>
              <b>{msg.sender === currentUser ? 'You' : msg.sender}:</b> {msg.content}
            </span>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          className="flex-1 border rounded px-2 py-1 dark:bg-gray-800"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-1 rounded">Send</button>
      </form>
    </div>
  );
};

export default ChatBox;