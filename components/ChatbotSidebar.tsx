import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, Bot } from 'lucide-react';
import { generateChatResponse } from '../services/geminiService';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const ChatbotSidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Hi! I'm your AI sous-chef. Ask me any cooking question!" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
        const history = messages.map(msg => ({
            role: msg.role,
            parts: [{ text: msg.text }]
        }));
        const responseText = await generateChatResponse(history, input);
        const modelMessage: Message = { role: 'model', text: responseText };
        setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
        console.error("Chatbot error:", error);
        const errorMessage: Message = { role: 'model', text: "Sorry, I'm having trouble connecting. Please try again." };
        setMessages(prev => [...prev, errorMessage]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-emerald-600 text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center z-50"
        aria-label="Open AI Chat"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isOpen ? 'close' : 'chat'}
            initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
            transition={{ duration: 0.2 }}
          >
            {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
          </motion.div>
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl z-40 shadow-2xl border-l border-slate-200 dark:border-slate-700 flex flex-col"
          >
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3">
              <Bot className="text-emerald-500" size={24} />
              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">AI Cooking Assistant</h3>
            </div>

            <div className="flex-grow p-4 overflow-y-auto space-y-4">
              {messages.map((msg, index) => (
                <div key={index} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs md:max-w-sm px-4 py-2.5 rounded-2xl ${msg.role === 'user' 
                      ? 'bg-emerald-600 text-white rounded-br-lg' 
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-lg'}`
                  }>
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                 <div className="flex justify-start">
                    <div className="px-4 py-2.5 rounded-2xl bg-slate-200 dark:bg-slate-700 rounded-bl-lg">
                        <div className="flex items-center gap-2">
                           <motion.div className="w-2 h-2 bg-slate-400 rounded-full" animate={{ scale: [1, 1.2, 1], y: [0, -2, 0] }} transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }} />
                           <motion.div className="w-2 h-2 bg-slate-400 rounded-full" animate={{ scale: [1, 1.2, 1], y: [0, -2, 0] }} transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}/>
                           <motion.div className="w-2 h-2 bg-slate-400 rounded-full" animate={{ scale: [1, 1.2, 1], y: [0, -2, 0] }} transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}/>
                        </div>
                    </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask a question..."
                  className="flex-grow bg-slate-100 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  disabled={isLoading}
                />
                <button onClick={handleSend} disabled={isLoading} className="bg-emerald-600 text-white p-3 rounded-lg disabled:opacity-50">
                  <Send size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatbotSidebar;
