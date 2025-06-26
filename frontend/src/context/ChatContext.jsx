import React, { createContext, useState, useContext } from 'react';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [otherUser, setOtherUser] = useState(null);

  const openChat = (user) => {
    setOtherUser(user);
    setIsOpen(true);
  };

  const closeChat = () => setIsOpen(false);

  return (
    <ChatContext.Provider value={{ isOpen, openChat, closeChat, otherUser }}>
      {children}
    </ChatContext.Provider>
  );
};