import React, { useState, useEffect, useRef } from 'react';
import { Terminal, X, Send, Wifi, WifiOff, Cpu } from 'lucide-react';
import { RESUME } from '../../Data/resume';

const GEMINI_API = import.meta.env.VITE_GEMINI_API;

// --- LOCAL KNOWLEDGE BASE ---
const SYSTEM_COMMANDS = {
  help: "List available commands",
  clear: "Clear terminal",
  bio: "Display biography",
  skills: "View technical stack",
  projects: "View project portfolio",
  contact: "Show contact channels"
};

const OFFLINE_RESPONSES = {
  "who": "Aman Anubhav is a Genetically Engineered Learner, AI Researcher & Engineer.",
  "aman": "That's me. I'm a Genetically Engineered Learner focused on AI, MLOps, and Climate Tech.",
  "yvoo": "YVOO is an AI-driven credit intelligence platform I built. It automates credit scoring with 90%+ accuracy.",
  "pavana": "PAVANA is a solar-powered carbon capture system design utilizing novel gradient composite metal chambers.",
  "rakshak": "RAKSHAK is a wildlife-friendly river-flow energy harvester I designed.",
  "liquid": "I am researching Liquid Neural Networks (LNNs) for adaptive, continuous-time AI systems.",
  "contact": "Email: amannbhv.cswork@gmail.com",
  "default": "Connection lost. Retrying... [Failed]. Type 'help' for local commands."
};

const TerminalOverlay = ({ isOpen, onClose }) => {
  const [input, setInput] = useState('');
  const [logs, setLogs] = useState([
    { src: 'SYS', msg: 'Initializing Neural Interface...' },
    { src: 'SYS', msg: 'Mounting File System... OK' },
    { src: 'SYS', msg: GEMINI_API ? 'Uplink Established.' : 'WARNING: Uplink Offline (Missing API Key)' },
    { src: 'AI', msg: "Ready. Awaiting input." }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }
  }, [logs, isOpen]);

  const processLocalCommand = (cmd) => {
    const lowerCmd = cmd.toLowerCase().trim();
    if (lowerCmd === 'clear') { setLogs([]); return true; }
    if (lowerCmd === 'help') {
      const helpText = Object.entries(SYSTEM_COMMANDS).map(([k, v]) => `${k.padEnd(10)} - ${v}`).join('\n');
      setLogs(prev => [...prev, { src: 'SYS', msg: helpText }]);
      return true;
    }
    if (lowerCmd === 'bio' || lowerCmd === 'about') { setLogs(prev => [...prev, { src: 'SYS', msg: RESUME.about }]); return true; }
    if (lowerCmd === 'projects') {
      const projectList = RESUME.projects.map(p => `• ${p.title}: ${p.desc}`).join('\n');
      setLogs(prev => [...prev, { src: 'SYS', msg: projectList }]);
      return true;
    }
    if (lowerCmd === 'contact') {
      setLogs(prev => [...prev, { src: 'SYS', msg: `Email: ${RESUME.links.email}\nLinkedIn: ${RESUME.links.linkedin}` }]);
      return true;
    }
    return false;
  };

  const handleCommand = async (e) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userQuery = input;
    setLogs(prev => [...prev, { src: 'USR', msg: userQuery }]);
    setInput('');
    setIsProcessing(true);

    if (processLocalCommand(userQuery)) {
      setIsProcessing(false);
      return;
    }

    try {
      if (!GEMINI_API) throw new Error("Missing VITE_GEMINI_API in .env");

      const systemPrompt = `
        You are the AI interface for Aman Anubhav's portfolio. 
        Identity: A helpful, minimalist technical assistant.
        Tone: Professional, direct, no fluff.
        Context: ${JSON.stringify(RESUME)}
        Instruction: Answer succinctly. Max 60 words.
      `;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: `System: ${systemPrompt}\n\nUser: ${userQuery}` }]
            }]
          })
        }
      );

      if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
      const data = await response.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (reply) {
        setLogs(prev => [...prev, { src: 'AI', msg: reply }]);
      } else {
        throw new Error("No response content");
      }

    } catch (err) {
      console.error("Terminal AI Error:", err);
      // Fallback
      let offlineReply = OFFLINE_RESPONSES.default;
      const lowerQ = userQuery.toLowerCase();
      for (const [key, response] of Object.entries(OFFLINE_RESPONSES)) {
        if (lowerQ.includes(key) && key !== 'default') offlineReply = response;
      }

      setLogs(prev => [...prev, {
        src: 'SYS',
        msg: `Error: Connection failed (${err.message}). Using local fallback.\n> ${offlineReply}`
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 font-mono animate-in fade-in zoom-in duration-300">
      <div className="w-full max-w-3xl h-[600px] bg-[#1a1a1a] border border-zinc-700/50 rounded-xl shadow-2xl flex flex-col overflow-hidden relative ring-1 ring-white/5">

        {/* Header */}
        <div className="h-11 border-b border-zinc-800 flex items-center justify-between px-4 bg-zinc-900/80">
          <div className="flex items-center gap-3 text-xs">
            <Terminal size={14} className="text-zinc-400" />
            <span className="text-zinc-400 font-bold tracking-wider">TERMINAL.APP</span>
            <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border ${GEMINI_API
              ? 'bg-zinc-800 border-zinc-700 text-zinc-300'
              : 'bg-red-900/20 border-red-900/30 text-red-400'}`}>
              {GEMINI_API ? <Wifi size={10} /> : <WifiOff size={10} />}
              <span className="font-semibold">{GEMINI_API ? 'ONLINE' : 'OFFLINE'}</span>
            </div>
          </div>
          <button onClick={onClose} className="hover:text-white text-zinc-500 transition-colors bg-zinc-800/50 hover:bg-zinc-700 p-1 rounded-md"><X size={14} /></button>
        </div>

        {/* Console Output */}
        <div className="flex-1 p-6 overflow-y-auto space-y-3 text-sm z-10 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-700" onClick={() => inputRef.current?.focus()}>
          {logs.map((l, i) => (
            <div key={i} className="flex gap-4 items-start animate-in slide-in-from-left-2 duration-200">
              <span className={`w-10 font-bold mt-0.5 shrink-0 text-xs ${l.src === 'USR' ? 'text-zinc-100' :
                l.src === 'AI' ? 'text-zinc-400' :
                  'text-zinc-500'}`
              }>{l.src}</span>
              <span className={`${l.src === 'USR' ? 'text-zinc-100' :
                l.src === 'AI' ? 'text-zinc-300' :
                  'text-zinc-400'
                } whitespace-pre-wrap leading-relaxed`}>{l.msg}</span>
            </div>
          ))}
          {isProcessing && (
            <div className="flex gap-4 items-center text-zinc-500 mt-2">
              <span className="w-10" />
              <Cpu size={14} className="animate-spin text-zinc-400" />
              <span className="text-xs animate-pulse">Thinking...</span>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-zinc-800 bg-[#1e1e1e] z-10">
          <form onSubmit={handleCommand} className="flex gap-3 items-center">
            <span className="text-zinc-400">➜</span>
            <input
              ref={inputRef}
              autoFocus
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              className="flex-1 bg-transparent outline-none text-zinc-100 font-mono placeholder-zinc-700 caret-zinc-400"
              placeholder="Type a command..."
              autoComplete="off"
            />
            <button
              type="submit"
              className="text-zinc-600 hover:text-zinc-200 disabled:opacity-30 transition-colors"
              disabled={isProcessing}
            >
              <Send size={16} />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default TerminalOverlay;