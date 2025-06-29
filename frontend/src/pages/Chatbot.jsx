import React, { useState, useRef, useEffect } from 'react';
import { toast } from "react-toastify";

const GeminiChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { text: input, sender: 'user' }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      // Build history for backend
      const historyForBackend = newMessages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));

      const response = await fetch('/api/generate-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ prompt: input, history: historyForBackend })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setMessages(prev => [
        ...prev, 
        { text: data.generatedText, sender: 'ai' }
      ]);
    } catch (error) {
      toast.error("Failed to get AI response");
      setMessages(prev => [
        ...prev, 
        { text: 'Sorry, something went wrong.', sender: 'ai' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)} 
          className="bg-blue-500 text-white w-14 h-14 flex items-center justify-center rounded-full shadow-lg hover:bg-blue-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
          </svg>
        </button>
      ) : (
        <div className="w-80 h-[500px] bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg shadow-xl flex flex-col">
          <div className="bg-blue-500 text-white p-3 flex justify-between items-center">
            <h3 className="font-bold">AI Assistant</h3>
            <button onClick={() => setIsOpen(false)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <div className="flex-grow overflow-y-auto p-3 space-y-2">
            {messages.map((msg, index) => (
              msg.sender === 'ai' && msg.text ? (
                <div
                  key={index}
                  className="p-2 rounded-lg max-w-[80%] bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 self-start"
                  dangerouslySetInnerHTML={{ __html: msg.text }}
                />
              ) : (
                <div
                  key={index}
                  className={`p-2 rounded-lg max-w-[80%] ${
                    msg.sender === 'user'
                      ? 'bg-blue-100 dark:bg-blue-900 text-gray-900 dark:text-gray-100 self-end ml-auto'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 self-start'
                  }`}
                >
                  {msg.text || <span>Sorry, something went wrong.</span>}
                </div>
              )
            ))}
            {isLoading && (
              <div className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg self-start">
                Generating response...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-3 flex">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-grow p-2 border rounded-l-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
              disabled={isLoading}
            />
            <button 
              onClick={handleSendMessage}
              className="bg-blue-500 text-white p-2 rounded-r-lg"
              disabled={isLoading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeminiChatbot;