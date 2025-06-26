import React, { createContext, useContext, useState } from 'react';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatRecipient, setChatRecipient] = useState(null);

  const openChat = (recipientEmail) => {
    setChatRecipient(recipientEmail);
    setIsChatOpen(true);
  };

  return (
    <ChatContext.Provider value={{
      isChatOpen,
      setIsChatOpen,
      chatRecipient,
      setChatRecipient,
      openChat,
    }}>
      {children}
    </ChatContext.Provider>
  );
};