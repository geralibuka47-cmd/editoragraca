import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Sparkles, Loader2, Minimize2 } from 'lucide-react';
import { createChatSession, sendMessageStream } from '../services/geminiService';
import { ChatMessage } from '../types';
import { GenerateContentResponse } from "@google/genai";

const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', text: 'Olá! Eu sou a Graça, sua assistente literária. Como posso ajudar você a encontrar sua próxima leitura hoje?' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && !chatSession) {
      const session = createChatSession();
      if (session) {
        setChatSession(session);
      } else {
        console.warn("Could not create AI chat session.");
      }
    }
  }, [isOpen, chatSession]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim() || !chatSession) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: inputText };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const responseStream = await sendMessageStream(chatSession, userMsg.text);

      let fullResponse = "";
      const modelMsgId = (Date.now() + 1).toString();

      // Add empty model message placeholder
      setMessages(prev => [...prev, { id: modelMsgId, role: 'model', text: '', isLoading: true }]);

      for await (const chunk of responseStream) {
        const c = chunk as GenerateContentResponse;
        const text = c.text;
        if (text) {
          fullResponse += text;
          setMessages(prev => prev.map(msg =>
            msg.id === modelMsgId ? { ...msg, text: fullResponse, isLoading: false } : msg
          ));
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: 'Desculpe, tive um problema ao consultar a estante. Pode tentar novamente?' }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-brand-900 text-white p-4 rounded-full shadow-2xl hover:bg-accent-gold hover:scale-105 transition-all duration-300 z-50 flex items-center gap-2 group"
      >
        <Sparkles className="h-6 w-6 text-accent-gold" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 whitespace-nowrap font-medium tracking-widest text-[10px] uppercase">
          Ajuda Inteligente
        </span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-full max-w-sm h-[500px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col border border-brand-100 overflow-hidden animate-slide-up">
      {/* Header */}
      <div className="bg-brand-900 p-5 flex justify-between items-center text-white">
        <div className="flex items-center gap-3">
          <div className="bg-accent-gold p-2 rounded-lg">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-base tracking-wide">Assistente Graça</h3>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest">Consultora Virtual</p>
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-white transition-colors"
          title="Minimizar chat"
          aria-label="Minimizar chat"
        >
          <Minimize2 className="h-5 w-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-brand-50 scrollbar-thin scrollbar-thumb-brand-200">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`
              max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed
              ${msg.role === 'user'
                ? 'bg-brand-900 text-white rounded-br-none shadow-md'
                : 'bg-white text-brand-800 border border-brand-100 rounded-bl-none shadow-sm'}
            `}>
              {msg.text}
              {msg.isLoading && (
                <span className="inline-block w-2 h-2 ml-1 rounded-full bg-accent-gold animate-bounce" />
              )}
            </div>
          </div>
        ))}
        {isLoading && messages[messages.length - 1].role === 'user' && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-400 border border-brand-100 rounded-2xl rounded-bl-none p-3 shadow-sm">
              <Loader2 className="h-4 w-4 animate-spin text-accent-gold" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-brand-100">
        <div className="flex items-center gap-2 bg-brand-50 rounded-full px-5 py-3 border border-transparent focus-within:border-accent-gold focus-within:bg-white transition-all shadow-inner">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Pergunte sobre um livro..."
            className="flex-1 bg-transparent border-none outline-none text-sm text-brand-800 placeholder-gray-400"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim() || isLoading}
            className={`p-1.5 rounded-full transition-colors ${inputText.trim() ? 'bg-brand-900 text-white hover:bg-accent-gold' : 'bg-gray-200 text-gray-400'}`}
            title="Enviar mensagem"
            aria-label="Enviar mensagem"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <div className="text-[9px] text-center text-gray-400 mt-3 uppercase tracking-widest">
          Editora Graça · Conhecimento & Cultura
        </div>
      </div>
    </div>
  );
};

export default AIChat;