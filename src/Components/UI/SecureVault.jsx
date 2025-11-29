import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, Lock, Unlock, Database, AlertTriangle, CheckCircle, 
  Plus, Key, RefreshCw, FileJson, Trash2, Bug, Terminal, 
  User, LogOut, Eye, EyeOff, Server, X, MessageSquare
} from 'lucide-react';
import { 
  collection, addDoc, serverTimestamp, query, onSnapshot, 
  getDocs, deleteDoc, doc, updateDoc, where 
} from 'firebase/firestore';
import { db } from '../../utils/firebase';

const appId = "portfolio-v5-production";

// --- SHARED SECRET FOR ADMIN CHANNEL ---
const ADMIN_CHANNEL_SECRET = "Admin_Access_Protocol_v5_Secure_Key_99";

// --- CRYPTO UTILS (Optimized) ---
// Reduced iterations from 100,000 to 10,000 for better performance in a demo environment.
// In a high-security production app, you would use Web Workers to keep the UI responsive with higher iterations.
const PBKDF2_ITERATIONS = 10000; 

const deriveKey = async (password, salt) => {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw", enc.encode(password), { name: "PBKDF2" }, false, ["deriveKey"]
  );
  return window.crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: enc.encode(salt), iterations: PBKDF2_ITERATIONS, hash: "SHA-256" },
    keyMaterial, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]
  );
};

const encryptData = async (key, data) => {
  const enc = new TextEncoder();
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encodedData = enc.encode(JSON.stringify(data));
  const encryptedContent = await window.crypto.subtle.encrypt({ name: "AES-GCM", iv: iv }, key, encodedData);
  
  const buffer = new Uint8Array(iv.byteLength + encryptedContent.byteLength);
  buffer.set(iv, 0);
  buffer.set(new Uint8Array(encryptedContent), iv.byteLength);
  return btoa(String.fromCharCode(...buffer));
};

const decryptData = async (key, encryptedBase64) => {
  try {
    const binaryString = atob(encryptedBase64);
    const buffer = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) { buffer[i] = binaryString.charCodeAt(i); }
    
    const iv = buffer.slice(0, 12);
    const data = buffer.slice(12);
    
    const decryptedContent = await window.crypto.subtle.decrypt({ name: "AES-GCM", iv: iv }, key, data);
    return JSON.parse(new TextDecoder().decode(decryptedContent));
  } catch (e) { 
    throw new Error("Decryption failed."); 
  }
};

const computeHash = async (dataString) => {
  const enc = new TextEncoder();
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', enc.encode(dataString));
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
};

// --- MAIN COMPONENT ---
const SecureVault = ({ isOpen, onClose }) => {
  const [view, setView] = useState('login'); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [currentUser, setCurrentUser] = useState(null);
  const [userKey, setUserKey] = useState(null);   
  const [adminKey, setAdminKey] = useState(null); 
  
  const [regForm, setRegForm] = useState({ username: '', password: '', fullName: '', org: '' });
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [msgInput, setMsgInput] = useState('');
  
  const [chain, setChain] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [activeTab, setActiveTab] = useState('ledger');
  const chainEndRef = useRef(null);

  // --- Handlers ---
  const handleRegister = async (e) => {
    e.preventDefault();
    if(!regForm.username || !regForm.password) return setError("Credentials required.");
    setLoading(true); setError('');
    
    try {
      const q = query(collection(db, 'artifacts', appId, 'public', 'data', 'vault_users'), where("username", "==", regForm.username));
      const snap = await getDocs(q);
      if (!snap.empty) throw new Error("Username taken.");

      const passwordHash = await computeHash(regForm.password);
      
      const newUser = {
        username: regForm.username,
        fullName: regForm.fullName,
        org: regForm.org,
        passwordHash, 
        role: 'user',
        createdAt: serverTimestamp(),
        status: 'active'
      };

      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'vault_users'), newUser);
      
      const key = await deriveKey(regForm.password, regForm.username); 
      setUserKey(key);
      setCurrentUser(newUser);
      setView('dashboard');
      
    } catch (err) { setError(err.message); }
    setLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');

    try {
      // ADMIN LOGIN
      if (loginForm.username === 'amananubhav' && loginForm.password === 'youcantguess') {
        setCurrentUser({ username: 'amananubhav', role: 'admin', fullName: 'System Administrator' });
        
        const admKey = await deriveKey(ADMIN_CHANNEL_SECRET, "admin_salt_v5");
        setAdminKey(admKey);
        
        setView('dashboard');
        setLoading(false);
        return;
      }

      // USER LOGIN
      const q = query(collection(db, 'artifacts', appId, 'public', 'data', 'vault_users'), where("username", "==", loginForm.username));
      const snap = await getDocs(q);
      
      if (snap.empty) throw new Error("User not found.");
      
      const userData = snap.docs[0].data();
      const inputHash = await computeHash(loginForm.password);

      if (userData.passwordHash !== inputHash) throw new Error("Invalid password.");
      if (userData.status === 'blocked') throw new Error("Account Blocked.");

      const key = await deriveKey(loginForm.password, loginForm.username);
      setUserKey(key);
      setCurrentUser({ id: snap.docs[0].id, ...userData });
      setView('dashboard');

    } catch (err) { setError(err.message); }
    setLoading(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUserKey(null);
    setAdminKey(null);
    setView('login');
    setLoginForm({ username: '', password: '' });
    setChain([]);
  };

  // --- Data Sync & Decryption ---
  useEffect(() => {
    if (view !== 'dashboard') return;

    const chainUnsub = onSnapshot(query(collection(db, 'artifacts', appId, 'public', 'data', 'vault_chain')), async (snapshot) => {
      const fetchedChain = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      fetchedChain.sort((a, b) => a.index - b.index);

      const processedChain = await Promise.all(fetchedChain.map(async (block) => {
        let decrypted = null;
        let source = null;

        if (currentUser?.role === 'admin' && adminKey && block.adminPayload) {
            try {
                const content = await decryptData(adminKey, block.adminPayload);
                decrypted = content;
                source = 'admin';
            } catch (e) { /* key mismatch */ }
        }

        if (userKey && block.userPayload) {
            try {
                const content = await decryptData(userKey, block.userPayload);
                if (content.sender === block.sender) {
                    decrypted = content;
                    source = 'user';
                }
            } catch (e) { /* not my message */ }
        }

        return { ...block, decryptedContent: decrypted, decryptSource: source };
      }));

      setChain(processedChain);
      setTimeout(() => chainEndRef.current?.scrollIntoView({ behavior: "smooth" }), 200);
    });

    let usersUnsub = () => {};
    if (currentUser?.role === 'admin') {
      usersUnsub = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'vault_users'), (snap) => {
        setUsersList(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      });
    }

    return () => { chainUnsub(); usersUnsub(); };
  }, [view, currentUser, userKey, adminKey]);

  const handleAddBlock = async () => {
    if (!msgInput.trim()) return;
    setLoading(true);
    try {
      const index = chain.length;
      const previousHash = index === 0 ? '0' : chain[index - 1].hash;
      const payload = { sender: currentUser.username, text: msgInput, timestamp: Date.now() };

      const userPayload = await encryptData(userKey, payload);

      const adminKeyTemp = await deriveKey(ADMIN_CHANNEL_SECRET, "admin_salt_v5");
      const adminPayload = await encryptData(adminKeyTemp, payload);

      const hash = await computeHash(`${index}${previousHash}${userPayload}`);

      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'vault_chain'), {
        index, 
        previousHash, 
        userPayload, 
        adminPayload,
        hash, 
        sender: currentUser.username, 
        timestamp: serverTimestamp()
      });
      setMsgInput('');
    } catch (err) { console.error(err); setError("Failed to commit block."); }
    setLoading(false);
  };

  const deleteBlock = async (id) => deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'vault_chain', id));
  const toggleUserStatus = async (id, s) => updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'vault_users', id), { status: s === 'active' ? 'blocked' : 'active' });
  const deleteUser = async (id) => deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'vault_users', id));
  const nukeChain = async () => {
      if(!confirm("NUKE CHAIN? This is irreversible.")) return;
      const snap = await getDocs(collection(db, 'artifacts', appId, 'public', 'data', 'vault_chain'));
      snap.forEach(d => deleteDoc(d.ref));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-lg flex items-center justify-center p-4 font-cyber animate-in fade-in duration-300">
      <div className="w-full max-w-6xl h-[85vh] bg-zinc-950 border border-zinc-800 rounded-lg flex overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] relative">
        
        <button onClick={onClose} className="absolute top-4 right-4 z-50 text-zinc-500 hover:text-white hover:bg-zinc-800 p-2 rounded-full transition-all"><X size={20} /></button>

        <div className="w-64 bg-black border-r border-zinc-800 p-6 flex flex-col hidden md:flex">
          <div className="flex items-center gap-3 text-green-500 mb-10">
            <Shield size={28} />
            <div>
                <h1 className="font-bold text-xl tracking-tighter leading-none">VAULT</h1>
                <div className="text-[10px] text-zinc-500 tracking-widest">SECURE NODE</div>
            </div>
          </div>
          {currentUser && (
             <div className="mb-8 p-4 bg-zinc-900/50 rounded border border-zinc-800">
                <div className="font-bold text-white truncate text-sm">{currentUser.username}</div>
                <div className={`text-[10px] font-bold uppercase mt-2 inline-flex px-2 py-0.5 rounded items-center gap-2 ${currentUser.role === 'admin' ? 'bg-red-900/20 text-red-400' : 'bg-green-900/20 text-green-400'}`}>
                    {currentUser.role}
                </div>
             </div>
          )}
          {currentUser && (
             <nav className="space-y-2 flex-1">
                <button onClick={() => setActiveTab('ledger')} className={`w-full text-left px-4 py-3 rounded text-xs font-bold tracking-wider transition-all flex items-center gap-3 ${activeTab === 'ledger' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}>
                    <Database size={14} /> LEDGER
                </button>
                {currentUser.role === 'admin' && (
                    <button onClick={() => setActiveTab('users')} className={`w-full text-left px-4 py-3 rounded text-xs font-bold tracking-wider transition-all flex items-center gap-3 ${activeTab === 'users' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}>
                        <Server size={14} /> USERS
                    </button>
                )}
             </nav>
          )}
          {currentUser && (
            <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 hover:text-red-400 text-xs font-bold mt-auto px-2"><LogOut size={14} /> DISCONNECT</button>
          )}
        </div>

        <div className="flex-1 flex flex-col relative bg-zinc-950/50">
          {view === 'login' && (
             <div className="flex-1 flex items-center justify-center p-8 relative">
                <div className="w-full max-