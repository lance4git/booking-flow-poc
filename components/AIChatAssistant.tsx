import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2, Bot } from 'lucide-react';
import { sendMessageToGemini } from '../services/geminiService';
import { ChatMessage } from '../types';

const AIChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hello! I am your Nordic AI assistant. How can I help you with your logistics needs today?', timestamp: Date.now() }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Prepare history for Gemini
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const responseText = await sendMessageToGemini(userMsg.text, history);
      
      const modelMsg: ChatMessage = { role: 'model', text: responseText, timestamp: Date.now() };
      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I encountered a connection error.', timestamp: Date.now() }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-nordic hover:bg-nordic-dark text-white rounded-full shadow-2xl flex items-center justify-center transition-transform duration-300 z-50 ${
          isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-0 right-0 md:bottom-6 md:right-6 w-full md:w-96 bg-white md:rounded-2xl shadow-2xl flex flex-col transition-all duration-300 z-50 border border-gray-200 ${
          isOpen
            ? 'h-[80vh] md:h-[600px] translate-y-0 opacity-100'
            : 'h-0 translate-y-10 opacity-0 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="bg-nordic text-white p-4 md:rounded-t-2xl flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-white/20 p-1.5 rounded-lg">
               <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
                <h3 className="font-bold">Nordic Assistant</h3>
                <span className="text-xs text-nordic-light flex items-center">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1"></span>
                    Online
                </span>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="hover:bg-white/20 p-1 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-grow overflow-y-auto p-4 bg-gray-50 space-y-4 no-scrollbar">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-nordic text-white rounded-br-none'
                    : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-bl-none shadow-sm flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin text-nordic" />
                <span className="text-xs text-gray-500">Thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-100 md:rounded-b-2xl">
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask about shipping..."
              className="w-full bg-gray-100 text-gray-900 placeholder-gray-500 border-0 rounded-full py-3 pl-4 pr-12 focus:ring-2 focus:ring-nordic focus:bg-white transition-all"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className={`absolute right-2 p-2 rounded-full transition-colors ${
                input.trim() && !isLoading 
                    ? 'bg-nordic text-white hover:bg-nordic-dark' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="text-center mt-2">
             <p className="text-[10px] text-gray-400">Powered by Gemini 2.5 Flash. AI can make mistakes.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AIChatAssistant;