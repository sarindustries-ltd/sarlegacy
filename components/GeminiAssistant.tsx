
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquareIcon, XIcon, SendIcon, BotIcon, Loader2Icon, SparklesIcon, TerminalIcon } from 'lucide-react';
import { sendMessageToGemini } from '../services/geminiService';
import { ChatMessage } from '../types';

const GeminiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'System initialized. I am SAR, your navigation and product specialist. How may I assist you?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, isLoading]);
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    const responseText = await sendMessageToGemini(userMessage);

    setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    setIsLoading(false);
  };

  return (
    <div className={`fixed flex flex-col items-end transition-all duration-300 ${isOpen ? 'z-[60] inset-0 sm:inset-auto sm:bottom-6 sm:right-6' : 'z-40 bottom-6 right-6'}`} id="ai-help">
      
      {/* Backdrop for mobile */}
      <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm sm:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsOpen(false)} />

      {/* Chat Window */}
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-assistant-title"
        className={`
          pointer-events-auto 
          flex flex-col
          bg-nexus-950/95 backdrop-blur-2xl 
          border-l border-r sm:border border-nexus-accent/30
          shadow-[0_0_50px_rgba(0,0,0,0.5)]
          overflow-hidden transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) origin-bottom-right
          
          ${isOpen 
            ? 'w-full h-[100dvh] rounded-none sm:w-[450px] sm:h-[750px] sm:max-h-[85vh] sm:rounded-2xl sm:opacity-100 sm:scale-100 sm:translate-y-0 fixed sm:relative inset-0 sm:inset-auto z-50' 
            : 'w-0 h-0 opacity-0 scale-75 translate-y-10 pointer-events-none absolute bottom-0 right-0 rounded-3xl'
          }
        `}
      >
        {/* HUD Header */}
        <div className="bg-white/5 p-4 pt-[max(1rem,env(safe-area-inset-top))] sm:pt-4 flex justify-between items-center border-b border-nexus-accent/20 relative overflow-hidden flex-shrink-0">
          <div className="absolute inset-0 bg-gradient-to-r from-nexus-accent/10 to-transparent"></div>
          <div className="relative flex items-center gap-3">
            <div className="relative">
                <div className="w-9 h-9 rounded-lg bg-nexus-accent/20 flex items-center justify-center border border-nexus-accent/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                    <BotIcon className="text-nexus-accent" size={18} />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-nexus-950 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
            </div>
            <div>
                <h3 id="ai-assistant-title" className="font-display font-bold text-white text-base uppercase tracking-wider">SAR AI</h3>
                <span className="text-[10px] text-nexus-glow flex items-center gap-1 font-mono opacity-80">
                    <TerminalIcon size={10} /> V2.5.0 ONLINE
                </span>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="relative z-10 p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors border border-transparent hover:border-white/10" aria-label="Close AI Assistant">
            <XIcon size={18} />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth bg-gradient-to-b from-nexus-950 to-slate-950">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
              {msg.role === 'model' && (
                <div className="w-6 h-6 rounded-full bg-slate-800 border border-white/10 flex-shrink-0 flex items-center justify-center mb-1">
                  <BotIcon size={14} className="text-slate-400" />
                </div>
              )}
              <div 
                className={`max-w-[85%] p-3 px-4 text-sm leading-relaxed shadow-sm backdrop-blur-md border ${
                  msg.role === 'user' 
                    ? 'bg-nexus-accent text-white rounded-2xl rounded-br-lg shadow-[0_0_15px_rgba(59,130,246,0.2)] border-nexus-accent' 
                    : 'bg-slate-900/80 text-slate-200 rounded-2xl rounded-bl-lg border-white/10'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-end gap-2 justify-start animate-in fade-in duration-300">
              <div className="w-6 h-6 rounded-full bg-slate-800 border border-white/10 flex-shrink-0 flex items-center justify-center mb-1">
                  <BotIcon size={14} className="text-slate-400" />
              </div>
              <div className="bg-slate-900/80 p-3 px-4 rounded-2xl rounded-bl-lg border border-white/10 flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-nexus-glow rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-1.5 h-1.5 bg-nexus-glow rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-1.5 h-1.5 bg-nexus-glow rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSendMessage} className="p-4 bg-black/40 border-t border-white/10 flex gap-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter command..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-base sm:text-sm text-white focus:outline-none focus:border-nexus-accent focus:bg-black/60 transition-all placeholder-slate-600 font-mono"
            />
          </div>
          <button 
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-3 bg-nexus-accent text-white rounded-xl hover:bg-nexus-accentHover disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] active:scale-95 border border-white/10"
            aria-label="Send message"
          >
            <SendIcon size={18} />
          </button>
        </form>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
            fixed bottom-6 right-6 sm:absolute sm:bottom-0 sm:right-0
            pointer-events-auto flex items-center justify-center w-14 h-14 rounded-full shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-all duration-500 z-50 border border-white/20
            ${isOpen 
                ? 'opacity-0 scale-0 pointer-events-none' 
                : 'bg-nexus-900 text-white hover:scale-110 hover:bg-nexus-800'
            }
        `}
        aria-label="Toggle AI Assistant"
      >
        <MessageSquareIcon size={24} className="text-nexus-glow" />
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-nexus-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-nexus-accent"></span>
        </span>
      </button>
    </div>
  );
};

export default GeminiAssistant;