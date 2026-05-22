import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function AIChatWidget() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'model', text: 'Hi there! Ask me anything about Vivek, his technical skills, or his projects.' }
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll conversation feed to bottom when history or loading state updates
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isChatLoading]);

  // Submit Prompt Handler for Gemini AI Chat
  const handleSendChatMessage = async (e) => {
    e.preventDefault();
    if (!chatMessage.trim() || isChatLoading) return;

    const userMessage = { role: 'user', text: chatMessage };
    setChatHistory((prev) => [...prev, userMessage]);
    setChatMessage('');
    setIsChatLoading(true);

    try {
      const res = await axios.post('https://profilelinks.onrender.com/api/chat', {
        message: userMessage.text,
        history: chatHistory
      });

      setChatHistory((prev) => [...prev, { role: 'model', text: res.data.reply }]);
    } catch (err) {
      console.error(err);
      setChatHistory((prev) => [
        ...prev,
        { role: 'model', text: 'Sorry, I hit an unexpected error. Please try sending your message again!' }
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* Chat Window Popup */}
      {isChatOpen && (
        <div className="w-80 sm:w-[360px] h-[460px] bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl flex flex-col mb-4 overflow-hidden transition-all duration-300">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-cyan-600 to-blue-600 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              {/* Gemini Vector Icon */}
              <svg className="w-5 h-5 fill-current text-cyan-200 animate-pulse" viewBox="0 0 24 24">
                <path d="M12 2s.5 4.5 4.5 5.5c-4 1-4.5 5.5-4.5 5.5s-.5-4.5-4.5-5.5c4-1 4.5-5.5 4.5-5.5zm6 11s.25 2.25 2.25 2.75c-2 .5-2.25 2.75-2.25 2.75s-.25-2.25-2.25-2.75c2-.5 2.25-2.75 2.25-2.75zm-11 3s.15 1.35 1.35 1.65c-1.2.3-1.35 1.65-1.35 1.65s-.15-1.35-1.35-1.65c1.2-.3 1.35-1.65 1.35-1.65z"/>
              </svg>
              <span className="font-bold text-xs tracking-wider uppercase">Gemini Assistant</span>
            </div>
            <button 
              onClick={() => setIsChatOpen(false)} 
              className="text-white/70 hover:text-white text-xl font-bold focus:outline-none"
            >
              &times;
            </button>
          </div>

          {/* Conversation Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 flex flex-col scrollbar-thin">
            {chatHistory.map((msg, index) => (
              <div 
                key={index} 
                className={`max-w-[85%] p-3 rounded-xl text-xs leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-cyan-600 text-white self-end rounded-br-none shadow-md shadow-cyan-900/20' 
                    : 'bg-neutral-800 text-neutral-200 self-start rounded-bl-none border border-neutral-700/50'
                }`}
              >
                {msg.text}
              </div>
            ))}
            {isChatLoading && (
              <div className="bg-neutral-800 border border-neutral-700/50 text-neutral-400 self-start p-3 rounded-xl rounded-bl-none text-xs flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Bar Form */}
          <form onSubmit={handleSendChatMessage} className="p-3 bg-black/40 border-t border-neutral-800 flex gap-2">
            <input
              type="text"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Ask me something..."
              className="flex-1 bg-neutral-800 text-white text-xs px-3 py-2.5 rounded-xl border border-neutral-700/40 focus:outline-none focus:border-cyan-500/80 transition placeholder-neutral-500"
            />
            <button 
              type="submit" 
              disabled={isChatLoading}
              className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-neutral-800 disabled:text-neutral-600 text-white px-3 py-2.5 rounded-xl transition font-semibold text-xs tracking-wide uppercase"
            >
              Send
            </button>
          </form>
        </div>
      )}

      {/* Floating Action Trigger Badge Button */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="w-14 h-14 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-full shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center text-white border border-white/10 group shadow-cyan-500/10"
      >
        {isChatOpen ? (
          <span className="text-2xl font-light">&times;</span>
        ) : (
          <svg className="w-6 h-6 fill-current group-hover:rotate-12 transition-transform duration-300" viewBox="0 0 24 24">
            <path d="M12 2s.5 4.5 4.5 5.5c-4 1-4.5 5.5-4.5 5.5s-.5-4.5-4.5-5.5c4-1 4.5-5.5 4.5-5.5zm6 11s.25 2.25 2.25 2.75c-2 .5-2.25 2.75-2.25 2.75s-.25-2.25-2.25-2.75c2-.5 2.25-2.75 2.25-2.75zm-11 3s.15 1.35 1.35 1.65c-1.2.3-1.35 1.65-1.35 1.65s-.15-1.35-1.35-1.65c1.2-.3 1.35-1.65 1.35-1.65z"/>
          </svg>
        )}
      </button>
    </div>
  );
}