import React, { useState, useEffect, useRef } from 'react';
import { 
  Github, Linkedin, Mail, ArrowRight, Code, 
  Award, Zap, Shield, Lock, Database, Server, 
  Terminal, X, Maximize2, Minimize2, Sun, Moon, 
  AlertTriangle, Send, Trash2, ExternalLink, User, 
  Reply, Cpu, Activity, Globe, Search, Wifi, Minus
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp, query, onSnapshot, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';

// ==========================================
// 1. CONFIGURATION
// ==========================================

const firebaseConfig = {
  apiKey: "AIzaSyAA_HoCCSagZNg31t642wjwxIRrkIPU4uQ",
  authDomain: "amannbhv-m.firebaseapp.com",
  projectId: "amannbhv-m",
  storageBucket: "amannbhv-m.firebasestorage.app",
  messagingSenderId: "499252124944",
  appId: "1:499252124944:web:6a64ac80518d04873a1995"
};

const GEMINI_API_KEY = "AIzaSyCQseebBsR-6hJA-51OcPgOUZBBt24GpZc"; 
const isConfigValid = !!firebaseConfig.apiKey;

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = "portfolio-v5-production";

// --- Crypto Utils ---
const SYSTEM_SECRET = "MY_SUPER_SECRET_MASTER_KEY_2025";
const cryptoUtils = {
  sha256: async (message) => {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  },
  encrypt: async (text) => {
    const textBytes = new TextEncoder().encode(text);
    const keyBytes = new TextEncoder().encode(SYSTEM_SECRET);
    const encryptedBytes = textBytes.map((b, i) => b ^ keyBytes[i % keyBytes.length]);
    return btoa(String.fromCharCode(...encryptedBytes));
  },
  decrypt: async (cipherText) => {
    try {
      const encryptedBytes = Uint8Array.from(atob(cipherText), c => c.charCodeAt(0));
      const keyBytes = new TextEncoder().encode(SYSTEM_SECRET);
      const decryptedBytes = encryptedBytes.map((b, i) => b ^ keyBytes[i % keyBytes.length]);
      return new TextDecoder().decode(decryptedBytes);
    } catch (e) { return "Decryption Error"; }
  }
};

// --- Resume Data ---
const RESUME = {
  name: "AMAN ANUBHAV",
  role: "AI RESEARCHER / ENGINEER",
  about: "I didn't inherit talent—I built it. I engineer intelligent agents and scalable systems to solve real-world problems like climate change and financial exclusion.",
  projects: [
    { 
      id: "p1", 
      title: "YVOO", 
      type: "FinTech AI", 
      tech: ["XGBoost", "React", "Flask"], 
      desc: "AI-driven credit intelligence platform. Automates credit scoring with 90%+ accuracy using synthetic data & ML ensembles.", 
      link: "https://github.com/gitamannbhv/YVOO",
      year: "2024"
    },
    { 
      id: "p2", 
      title: "OceanBot", 
      type: "Marine AI", 
      tech: ["InceptionV3", "NLP", "TensorFlow"], 
      desc: "Marine life classification system achieving 98.87% accuracy. Integrates chatbot for oceanographic data queries.", 
      link: "https://github.com/gitamannbhv",
      year: "2023"
    },
    { 
      id: "p3", 
      title: "Mario-RL", 
      type: "Autonomous Agent", 
      tech: ["DDQN", "PPO", "Reinforcement Learning"], 
      desc: "Autonomous agent trained to master Super Mario Bros using deep reinforcement learning and custom reward functions.", 
      link: "https://github.com/gitamannbhv/Mario-RL",
      year: "2023"
    },
    { 
      id: "p4", 
      title: "PAVANA", 
      type: "Climate Tech", 
      tech: ["Thermodynamics", "CAD", "Simulation"], 
      desc: "Solar-powered carbon capture system design capable of removing 90% atmospheric CO2 at reduced costs.", 
      link: "https://github.com/gitamannbhv",
      year: "2022"
    },
    { 
      id: "p5", 
      title: "KANAD", 
      type: "AgriTech", 
      tech: ["IoT", "LSTM", "CNN"], 
      desc: "Smart irrigation & disease detection system serving 23 farmers, reducing water usage by 23%.", 
      link: "https://github.com/gitamannbhv",
      year: "2021"
    }
  ],
  experience: [
    { 
      role: "Growth Specialist", 
      org: "Google Developers Group (GDG)", 
      time: "2024 — Present", 
      detail: "Top 8% talent. Drove 23% engagement growth. Organized 'Building Bad' hackathon & mentored students in Cloud/AI." 
    },
    { 
      role: "Founder & CEO", 
      org: "DeuxStem Org", 
      time: "2020 — Present", 
      detail: "Scaled Ed-Tech non-profit to 2M+ global audience. Partnered with NASA for asteroid search campaigns." 
    },
    { 
      role: "Student Ambassador", 
      org: "Microsoft Learn", 
      time: "2024", 
      detail: "Contributed to Project Wing (RL Algorithms). Taught AI/ML concepts and cloud computing." 
    },
    { 
      role: "Researcher", 
      org: "Liquid Neural Networks", 
      time: "Active", 
      detail: "Investigating continuous-time neural networks for adaptive AI systems in robotics and edge computing." 
    }
  ]
};

// ==========================================
// 2. UTILS & ANIMATIONS
// ==========================================

// Mouse Hook for Lens Effect
const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    let animationFrameId;
    const updateMousePosition = ev => {
      animationFrameId = window.requestAnimationFrame(() => {
        setMousePosition({ x: ev.clientX, y: ev.clientY });
      });
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, []);
  return mousePosition;
};

const useScrollReveal = () => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return [ref, isVisible];
};

const Reveal = ({ children, delay = 0 }) => {
  const [ref, isVisible] = useScrollReveal();
  return (
    <div 
      ref={ref} 
      style={{ 
        opacity: isVisible ? 1 : 0, 
        transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
        transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`
      }}
    >
      {children}
    </div>
  );
};

const Preloader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsFinished(true), 300);
          setTimeout(onComplete, 1200); 
          return 100;
        }
        return Math.min(prev + 5, 100); 
      });
    }, 50);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-[100] bg-black flex flex-col justify-between p-8 transition-transform duration-1000 ease-[cubic-bezier(0.76,0,0.24,1)] ${isFinished ? '-translate-y-full' : 'translate-y-0'}`}
    >
      <div className="flex justify-between text-zinc-500 text-xs font-mono uppercase tracking-widest">
        <span>Portfolio V5</span>
        <span>System Boot</span>
      </div>
      <div className="text-[15vw] font-black leading-none text-white mix-blend-difference text-right">
        {Math.floor(progress)}%
      </div>
      <div className="w-full h-[1px] bg-white/20 overflow-hidden">
        <div className="h-full bg-white transition-all duration-200 ease-out" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
};

// ==========================================
// 3. 2D LENS HERO (RESTORED)
// ==========================================

const LensHero = () => {
  const { x, y } = useMousePosition();
  
  return (
    <section id="home" className="relative h-screen w-full overflow-hidden flex flex-col justify-center items-center cursor-none bg-black transition-colors duration-500">
      
      {/* LAYER 1: Base Layer (Dark/Visible outside lens) */}
      <div className="absolute inset-0 flex flex-col justify-center items-center z-10 pointer-events-none select-none bg-black text-zinc-800">
         {/* Background Noise */}
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
         
         <div className="mb-4 text-xs font-mono tracking-widest opacity-50"> &gt;_ AMAN ANUBHAV</div>
         
         <h1 className="text-[12vw] font-black leading-none tracking-tighter text-center opacity-20">
           ENGINEER
           <br />
           ARCHITECT
         </h1>

         <div className="mt-8 flex gap-4 text-xs font-mono tracking-widest opacity-30">
            <span>SYSTEMS</span>
            <span>//</span>
            <span>INTELLIGENCE</span>
         </div>
      </div>

      {/* LAYER 2: Reveal Layer (Visible inside lens - Inverted/White) */}
      <div 
        className="absolute inset-0 z-20 flex flex-col justify-center items-center bg-white text-black pointer-events-none select-none"
        style={{
          maskImage: `radial-gradient(250px circle at ${x}px ${y}px, black 0%, transparent 100%)`,
          WebkitMaskImage: `radial-gradient(250px circle at ${x}px ${y}px, black 0%, transparent 100%)`
        }}
      >
         {/* Background Noise Inverted */}
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-multiply"></div>
         
         <div className="mb-4 text-xs font-mono tracking-widest font-bold text-red-600"> &gt;_ AMAN ANUBHAV</div>
         
         <h1 className="text-[12vw] font-black leading-none tracking-tighter text-center text-black">
           ENGINEER
           <br />
           ARCHITECT
         </h1>

         <div className="mt-8 flex gap-4 text-xs font-mono tracking-widest font-bold">
            <span>SYSTEMS</span>
            <span>//</span>
            <span>INTELLIGENCE</span>
         </div>
      </div>
      
      {/* Custom Cursor Ring */}
      <div 
        className="fixed top-0 left-0 w-12 h-12 border border-white mix-blend-difference rounded-full pointer-events-none z-50 transition-transform duration-75 flex items-center justify-center" 
        style={{ transform: `translate(${x - 24}px, ${y - 24}px)` }}
      >
          <div className="w-1 h-1 bg-white rounded-full"></div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-zinc-500 animate-bounce z-30">
        <Minus className="rotate-90" />
      </div>
    </section>
  );
};

// ==========================================
// 4. UI COMPONENTS
// ==========================================

const NavButton = ({ id, label, onClick, active }) => (
  <button 
    onClick={() => {
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
      if (onClick) onClick(id);
    }}
    className={`relative px-4 py-2 text-xs font-bold tracking-widest transition-all duration-300 ${active ? 'text-white' : 'text-zinc-500 hover:text-white'}`}
  >
    {label}
  </button>
);

// --- GEMINI AI TERMINAL ---
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
      if (!GEMINI_API_KEY) {
        // Fallback simulation if key fails or isn't set
        setTimeout(() => {
           let mockReply = "API Key check failed. Entering simulation mode... ";
           if (userQuery.toLowerCase().includes("project")) mockReply += "Aman has built OceanBot (Marine AI), YVOO (FinTech), and PAVANA (Climate Tech).";
           else if (userQuery.toLowerCase().includes("contact")) mockReply += "You can reach him at amannbhv.cswork@gmail.com";
           else mockReply += "Aman is an AI Researcher & Engineer specializing in scalable systems, LNNs, and intelligent agents.";
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

// --- SECURE VAULT ---
const SecureVault = ({ isOpen, onClose, user, db }) => {
  const [view, setView] = useState('login'); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeUser, setActiveUser] = useState(null);
  const [regForm, setRegForm] = useState({ username: '', password: '', name: '', email: '', phone: '', org: '' });
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [msgInput, setMsgInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [usersList, setUsersList] = useState([]);

  const handleAuth = async (isRegister) => {
    setLoading(true); setError('');
    try {
      const form = isRegister ? regForm : loginForm;
      if (!isRegister && form.username === 'amannbhv' && form.password === 'amans') {
        setActiveUser({ username: 'amannbhv', role: 'admin', name: 'Administrator' });
        setView('admin'); setLoading(false); return;
      }
      const passHash = await cryptoUtils.sha256(form.password);
      const usersRef = collection(db, 'artifacts', appId, 'public', 'data', 'vault_users');
      if (isRegister) {
        const q = query(usersRef); const snap = await getDocs(q);
        if (snap.docs.find(d => d.data().username === form.username)) throw new Error("Username taken");
        const newUser = { ...regForm, passHash, role: 'user', createdAt: serverTimestamp(), status: 'active' };
        delete newUser.password;
        await addDoc(usersRef, newUser);
        setActiveUser(newUser); setView('dashboard');
      } else {
        const q = query(usersRef); const snap = await getDocs(q);
        const userDoc = snap.docs.find(d => d.data().username === form.username && d.data().passHash === passHash);
        if (userDoc) { setActiveUser(userDoc.data()); setView('dashboard'); } 
        else { throw new Error("Invalid Credentials"); }
      }
    } catch (err) { setError(err.message); }
    setLoading(false);
  };

  useEffect(() => {
    if (!db || (view !== 'dashboard' && view !== 'admin')) return;
    const unsub = onSnapshot(query(collection(db, 'artifacts', appId, 'public', 'data', 'vault_messages')), (snap) => {
      const msgs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      msgs.sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));
      setMessages(msgs);
    });
    return () => unsub();
  }, [view, db]);

  useEffect(() => {
    if (view === 'admin' && db) {
      getDocs(query(collection(db, 'artifacts', appId, 'public', 'data', 'vault_users'))).then(snap => 
        setUsersList(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      );
    }
  }, [view, db]);

  const sendMessage = async () => {
    if (!msgInput.trim()) return;
    await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'vault_messages'), {
      sender: activeUser.username, senderName: activeUser.name, content: await cryptoUtils.encrypt(msgInput), timestamp: serverTimestamp(), replies: []
    });
    setMsgInput('');
  };

  const deleteUser = async (userId) => {
    if(!confirm("Delete user?")) return;
    try { await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'vault_users', userId)); setUsersList(prev => prev.filter(u => u.id !== userId)); } catch(e) {}
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-red-950/90 backdrop-blur-xl flex items-center justify-center p-4 animate-in zoom-in duration-300 font-mono">
      <div className="w-full max-w-4xl h-[80vh] bg-black border border-red-900/50 rounded-lg flex overflow-hidden relative shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-red-500 hover:text-white z-20"><X/></button>
        <div className="w-64 border-r border-red-900/30 p-6 bg-black hidden md:block">
          <div className="text-red-600 font-bold tracking-widest mb-8 flex items-center gap-2"><Shield size={18}/> VAULT_OS</div>
          {activeUser && <div className="text-xs text-red-400">LOGGED AS:<br/><span className="text-white text-sm font-bold">{activeUser.username}</span></div>}
        </div>
        <div className="flex-1 flex flex-col bg-black/90 p-8">
          {(view === 'login' || view === 'register') ? (
            <div className="m-auto w-full max-w-sm space-y-4">
              <h2 className="text-2xl font-bold text-white text-center">ACCESS PROTOCOL</h2>
              {view === 'register' && <input placeholder="Full Name" className="w-full bg-red-900/20 border border-red-900/50 p-3 text-white outline-none" value={regForm.name} onChange={e=>setRegForm({...regForm, name: e.target.value})}/>}
              <input placeholder="Username" className="w-full bg-red-900/20 border border-red-900/50 p-3 text-white outline-none" value={view === 'register' ? regForm.username : loginForm.username} onChange={e => view === 'register' ? setRegForm({...regForm, username: e.target.value}) : setLoginForm({...loginForm, username: e.target.value})} />
              <input type="password" placeholder="Password" className="w-full bg-red-900/20 border border-red-900/50 p-3 text-white outline-none" value={view === 'register' ? regForm.password : loginForm.password} onChange={e => view === 'register' ? setRegForm({...regForm, password: e.target.value}) : setLoginForm({...loginForm, password: e.target.value})} />
              {error && <div className="text-red-500 text-xs text-center">{error}</div>}
              <button onClick={() => handleAuth(view === 'register')} className="w-full py-3 bg-red-700 hover:bg-red-600 text-white font-bold transition-colors">{loading ? '...' : 'AUTHENTICATE'}</button>
              <button onClick={() => setView(view === 'login' ? 'register' : 'login')} className="w-full text-xs text-red-400 hover:text-white mt-2 underline">{view === 'login' ? 'Create Identity' : 'Back to Login'}</button>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {messages.map(msg => (
                  <div key={msg.id} className="border border-red-900/30 p-3 rounded bg-red-950/10">
                    <div className="flex justify-between text-xs text-red-500 mb-1"><span>{msg.senderName}</span><span>{msg.timestamp?.toDate().toLocaleTimeString()}</span></div>
                    <div className="text-sm text-white break-all">
                      {view === 'admin' || msg.sender === activeUser.username ? <span className="text-red-200">DATA DECRYPTED</span> : <span className="flex items-center gap-1 opacity-50"><Lock size={12}/> ENCRYPTED</span>}
                    </div>
                  </div>
                ))}
              </div>
              {view !== 'admin' && <div className="flex gap-2"><input className="flex-1 bg-red-900/20 border border-red-900/50 p-2 text-white outline-none" value={msgInput} onChange={e => setMsgInput(e.target.value)} placeholder="Secure Payload..."/><button onClick={sendMessage} className="bg-red-700 px-4 text-white font-bold hover:bg-red-600">SEND</button></div>}
              {view === 'admin' && <div className="border-t border-red-900/30 pt-4"><div className="text-xs text-red-500 font-bold mb-2">USERS</div><div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">{usersList.map(u => <div key={u.id} className="text-xs text-white border border-white/10 p-2 flex justify-between"><span>{u.username}</span><button onClick={()=>deleteUser(u.id)}><Trash2 size={12}/></button></div>)}</div></div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP ---
const App = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try { 
        if (isConfigValid && auth) await signInAnonymously(auth); 
      } catch(e) { console.error("Auth Error:", e); }
    };
    init();
    if (auth) return onAuthStateChanged(auth, setUser);
  }, []);

  if (!isConfigValid) return <div className="min-h-screen bg-black text-red-500 flex items-center justify-center p-4 text-center font-mono"><h1>ERROR: Configuration variables missing.</h1></div>;

  return (
    <>
      {loading && <Preloader onComplete={() => setLoading(false)} />}
      
      <div className={`font-sans text-white bg-black min-h-screen transition-opacity duration-1000 selection:bg-white/30 ${loading ? 'opacity-0 overflow-hidden' : 'opacity-100'}`}>
        
        {isVaultOpen && <SecureVault user={user} db={db} onClose={() => setIsVaultOpen(false)} />}
        <TerminalOverlay isOpen={isTerminalOpen} onClose={() => setIsTerminalOpen(false)} />
        
        <nav className="fixed top-0 w-full z-40 backdrop-blur-md border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <span className="text-xl font-bold tracking-tighter cursor-pointer z-50" onClick={() => window.scrollTo({top:0, behavior:'smooth'})}>AA.</span>
            <div className="hidden md:flex gap-10">
               {['projects', 'experience'].map(id => (
                 <NavButton key={id} id={id} label={id.toUpperCase()} onClick={setActiveSection} active={activeSection === id} />
               ))}
               <NavButton id="footer" label="CONTACT" onClick={() => document.querySelector('footer')?.scrollIntoView({ behavior: 'smooth'})} />
            </div>
            <div className="flex items-center gap-4 z-50">
              <button onClick={() => setIsTerminalOpen(true)} className="p-2 hover:text-green-400 transition-colors" title="Open AI Terminal"><Terminal size={18}/></button>
              <button 
                onClick={() => setIsVaultOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-red-900/20 text-red-500 text-[10px] font-bold tracking-widest rounded-sm hover:bg-red-900/40 transition-colors border border-red-900/50"
              >
                <Lock size={12} /> VAULT
              </button>
            </div>
          </div>
        </nav>

        {/* RESTORED 2D LENS HERO */}
        <LensHero />
        
        {/* PROJECTS SECTION */}
        <section id="projects" className="px-6 py-40 max-w-7xl mx-auto">
          <Reveal>
            <h2 className="text-xs font-mono text-zinc-500 mb-20 tracking-widest uppercase border-b border-zinc-800 pb-4">Selected Works (05)</h2>
          </Reveal>
          <div className="flex flex-col">
            {RESUME.projects.map((p, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <a href={p.link} target="_blank" className="group relative border-t border-zinc-900 py-12 flex flex-col md:flex-row md:items-baseline gap-4 md:gap-12 transition-colors hover:bg-white/5 px-4 -mx-4 rounded-lg">
                   <span className="text-xs font-mono text-zinc-600 w-24">{p.year}</span>
                   <div className="flex-1">
                     <h3 className="text-3xl md:text-5xl font-bold text-zinc-300 group-hover:text-white transition-colors mb-2">{p.title}</h3>
                     <div className="flex flex-wrap gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                        {p.tech.map(t => <span key={t} className="text-[10px] uppercase tracking-wider border border-white/10 px-2 py-1 rounded-full text-zinc-400">{t}</span>)}
                     </div>
                   </div>
                   <div className="md:w-1/3 text-sm text-zinc-500 font-light leading-relaxed group-hover:text-zinc-300 transition-colors">{p.desc}</div>
                   <div className="absolute right-8 top-12 opacity-0 group-hover:opacity-100 transition-all duration-300 -rotate-45 group-hover:rotate-0 text-white"><ArrowRight size={24} /></div>
                </a>
              </Reveal>
            ))}
          </div>
        </section>

        {/* EXPERIENCE SECTION */}
        <section id="experience" className="px-6 py-40 bg-zinc-950/50">
           <div className="max-w-7xl mx-auto">
             <Reveal>
               <div className="flex justify-between items-end mb-20 border-b border-zinc-800 pb-4">
                 <h2 className="text-xs font-mono text-zinc-500 tracking-widest uppercase">Experience Log</h2>
                 <span className="text-xs font-mono text-zinc-600">2020 — 2025</span>
               </div>
             </Reveal>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-12">
               {RESUME.experience.map((exp, i) => (
                 <Reveal key={i} delay={i * 0.1}>
                   <div className="group border-l border-zinc-800 pl-6 hover:border-white transition-colors duration-500">
                     <span className="block text-xs font-mono text-zinc-600 mb-2">{exp.time}</span>
                     <h3 className="text-xl font-bold text-white mb-1">{exp.role}</h3>
                     <div className="text-sm text-zinc-400 mb-4">{exp.org}</div>
                     <p className="text-sm text-zinc-500 leading-relaxed group-hover:text-zinc-300 transition-colors">{exp.detail}</p>
                   </div>
                 </Reveal>
               ))}
             </div>
           </div>
        </section>

        <footer className="px-6 py-32 border-t border-white/10 text-center relative overflow-hidden">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900/20 via-black to-black pointer-events-none"></div>
           <Reveal>
             <h2 className="text-[15vw] font-black text-zinc-900 leading-none select-none pointer-events-none tracking-tighter">ANUBHAV</h2>
           </Reveal>
           <div className="mt-12 flex flex-col md:flex-row justify-center items-center gap-12 relative z-10">
             <a href="mailto:amannbhv.cswork@gmail.com" className="text-sm font-bold tracking-widest text-zinc-500 hover:text-white transition-colors">EMAIL</a>
             <a href="https://www.linkedin.com/in/amananubhav/" className="text-sm font-bold tracking-widest text-zinc-500 hover:text-white transition-colors">LINKEDIN</a>
             <a href="https://github.com/gitamannbhv" className="text-sm font-bold tracking-widest text-zinc-500 hover:text-white transition-colors">GITHUB</a>
           </div>
           <p className="mt-16 text-zinc-800 text-xs font-mono">&copy; {new Date().getFullYear()} AMAN ANUBHAV. SYSTEMS ONLINE.</p>
        </footer>
      </div>
    </>
  );
};

export default App;