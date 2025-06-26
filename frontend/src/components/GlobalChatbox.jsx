import React from 'react';
import ChatBox from './Chatbox';
import { useChat } from '../context/ChatContext';
import { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';

const GlobalChatbox = () => {
  const { isOpen, closeChat, otherUser } = useChat();
  const { user } = useContext(ShopContext);

  if (!isOpen || !otherUser) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="relative">
        <button
          onClick={closeChat}
          className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center"
        >×</button>
        <ChatBox currentUser={user.email} otherUser={otherUser} />
      </div>
    </div>
  );
};

export default GlobalChatbox;