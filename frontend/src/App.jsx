import { useState, useEffect } from 'react';
import axios from 'axios';
import { Lock } from 'lucide-react';
import LinkCard from './components/LinkCard';
import LoginModal from './components/LoginModal';
import AdminPanel from './components/AdminPanel';

function App() {
  const [links, setLinks] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    axios.get('https://profilelinks.onrender.com/')
      .then(res => setLinks(res.data))
      .catch(err => console.error("Error fetching links", err));
  }, []);

  const handleLogin = async (password) => {
    try {
      const res = await axios.post('https://profilelinks.onrender.com/', { password });
      localStorage.setItem('adminToken', res.data.token);
      setIsAdmin(true);
      setShowLogin(false);
    } catch (err) {
      alert('Incorrect Password');
    }
  };

  const handleAddLink = async (newLinkData) => {
    const token = localStorage.getItem('adminToken');
    try {
      const res = await axios.post('https://profilelinks.onrender.com/', newLinkData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLinks([res.data.data, ...links]); 
      setIsAdmin(false); 
    } catch (err) {
      alert('Session expired. Please log in again.');
      setIsAdmin(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-screen p-6 max-w-xl mx-auto w-full bg-[#050505] selection:bg-cyan-500/30">
      
      {/* Header */}
      <header className="flex flex-col items-center text-center mt-12 mb-12 w-full z-10">
        
        {/* Glowing Welcome Badge */}
        <div className="relative group mb-6 cursor-default">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full blur opacity-40 group-hover:opacity-75 transition duration-500 animate-gradient-xy"></div>
          <div className="relative px-6 py-2 bg-black rounded-full border border-slate-800">
            <span className="text-xs font-black tracking-[0.2em] uppercase bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Welcome
            </span>
          </div>
        </div>
        
        <h1 className="text-4xl font-extrabold text-white tracking-tight mb-3">
          My Profiles
        </h1>
        <p className="text-slate-400 font-light max-w-sm text-sm">
          Connect with me across my professional portfolio and platforms.
        </p>
      </header>

      {/* Public Links Section */}
      <main className="w-full flex-grow z-10">
        {links.length === 0 ? (
          <p className="text-center text-slate-600 text-sm mt-10">No links added yet.</p>
        ) : (
          links.map(link => (
            <LinkCard key={link._id} title={link.title} url={link.url} />
          ))
        )}
      </main>

      {/* Admin Panel */}
      <footer className="w-full mt-12 mb-6 flex justify-center z-10">
        {isAdmin ? (
          <AdminPanel onAdd={handleAddLink} />
        ) : (
          <button 
            className="group flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-600 hover:text-cyan-400 transition-colors"
            onClick={() => setShowLogin(true)}
          >
            <Lock size={14} className="group-hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" /> 
            Manage Profile Links
          </button>
        )}
      </footer>

      {showLogin && <LoginModal onVerify={handleLogin} onClose={() => setShowLogin(false)} />}
    </div>
  );
}

export default App;