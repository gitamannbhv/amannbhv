import React, { useState, useEffect } from 'react';
import { Shield, X, Lock, Trash2 } from 'lucide-react';
import { collection, addDoc, serverTimestamp, query, onSnapshot, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { cryptoUtils } from '../../utils/crypto';

const appId = "portfolio-v5-production";

const SecureVault = ({ isOpen, onClose, isDark }) => {
  const [view, setView] = useState('login'); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeUser, setActiveUser] = useState(null);
  const [regForm, setRegForm] = useState({ username: '', password: '', name: '' });
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
  }, [view]);

  useEffect(() => {
    if (view === 'admin' && db) {
      getDocs(query(collection(db, 'artifacts', appId, 'public', 'data', 'vault_users'))).then(snap => 
        setUsersList(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      );
    }
  }, [view]);

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
    <div className="fixed inset-0 z-[100] bg-red-950/90 backdrop-blur-xl flex items-center justify-center p-4 animate-in zoom-in duration-300 font-cyber">
      <div className="w-full max-w-4xl h-[80vh] bg-black border border-red-900/50 rounded-lg flex overflow-hidden relative shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-red-500 hover:text-white z-20"><X/></button>
        
        {/* Sidebar */}
        <div className="w-64 border-r border-red-900/30 p-6 bg-black hidden md:block">
          <div className="text-red-600 font-bold tracking-widest mb-8 flex items-center gap-2"><Shield size={18}/> VAULT_OS</div>
          {activeUser && <div className="text-xs text-red-400">LOGGED AS:<br/><span className="text-white text-sm font-bold">{activeUser.username}</span></div>}
        </div>

        {/* Main Content */}
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

export default SecureVault;