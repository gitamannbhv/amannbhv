import React, { useState, useEffect, useRef } from 'react';
import { Terminal, X, Send } from 'lucide-react';
import { RESUME } from '../../data/resume';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const TerminalOverlay = ({ isOpen, onClose }) => {
  const [input, setInput] = useState('');
  const [logs, setLogs] = useState([
    { src: 'SYS', msg: 'Initializing Neural Link...' },
    { src: 'SYS', msg: 'Connected. Ask me about Aman.' }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    if (isOpen) endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs, isOpen]);

  const handleCommand = async (e) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;
    
    const userQuery = input;
    setLogs(prev => [...prev, { src: 'USR', msg: userQuery }]);
    setInput('');
    setIsProcessing(true);

    try {
      // Simulation mode if no key is present to prevent crash
      if (!GEMINI_API_KEY) {
        setTimeout(() => {
           let mockReply = "API Key check failed (Simulated Response). ";
           if (userQuery.toLowerCase().includes("project")) mockReply += "Aman has built OceanBot, YVOO, and PAVANA.";
           else if (userQuery.toLowerCase().includes("contact")) mockReply += "Reach him at amannbhv.cswork@gmail.com";
           else mockReply += "Aman is an AI Researcher & Engineer.";
           setLogs(prev => [...prev, { src: 'AI', msg: mockReply }]);
           setIsProcessing(false);
        }, 600);
        return;
      }

      const systemPrompt = `You are an advanced AI assistant for Aman Anubhav's portfolio. Context: ${JSON.stringify(RESUME)}. Instructions: Answer questions about Aman, his projects, and experience. Style: Tech-noir, concise, terminal-like.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: userQuery }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] }
          })
        }
      );

      const data = await response.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No valid response.";
      setLogs(prev => [...prev, { src: 'AI', msg: reply }]);
    } catch (err) {
      setLogs(prev => [...prev, { src: 'ERR', msg: "Connection Interrupted." }]);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 font-mono animate-in zoom-in duration-200">
      <div className="w-full max-w-3xl h-[600px] bg-black border border-zinc-800 rounded shadow-2xl flex flex-col overflow-hidden relative">
        <div className="h-10 border-b border-zinc-800 flex items-center justify-between px-4 bg-zinc-900/50">
          <div className="flex items-center gap-2 text-xs text-green-500">
            <Terminal size={14} />
            <span>GEMINI_LINK_V2.5</span>
          </div>
          <button onClick={onClose} className="hover:text-red-500 transition-colors"><X size={16} /></button>
        </div>
        <div className="flex-1 p-6 overflow-y-auto space-y-3 text-sm z-10">
          {logs.map((l, i) => (
            <div key={i} className="flex gap-4 items-start">
              <span className={`w-10 font-bold mt-1 ${l.src === 'USR' ? 'text-blue-400' : l.src === 'AI' ? 'text-green-500' : 'text-gray-500'}`}>{l.src}</span>
              <span className={`text-gray-300 whitespace-pre-wrap leading-relaxed`}>{l.msg}</span>
            </div>
          ))}
          {isProcessing && <div className="text-gray-500 animate-pulse ml-14">Processing...</div>}
          <div ref={endRef} />
        </div>
        <div className="p-4 border-t border-zinc-800 bg-black z-10">
          <form onSubmit={handleCommand} className="flex gap-3 items-center">
            <span className="text-green-500 animate-pulse">➜</span>
            <input 
              autoFocus
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              className="flex-1 bg-transparent outline-none text-white font-mono placeholder-zinc-700"
              placeholder="Ask query..."
            />
            <button type="submit" className="text-green-500 disabled:opacity-50" disabled={isProcessing}><Send size={16}/></button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TerminalOverlay;