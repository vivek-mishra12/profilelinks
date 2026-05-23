import { useState, useEffect } from 'react';
import axios from 'axios';
import { Lock } from 'lucide-react';
import LinkCard from './components/LinkCard';
import LoginModal from './components/LoginModal';
import AdminPanel from './components/AdminPanel';
import AIChatWidget from './components/AIChatWidget';

function App() {
  const [links, setLinks] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  
  // Categorization Filters State
  const [activeTab, setActiveTab] = useState('All');
  const tabs = ['All', 'Socials', 'Coding', 'Portfolio', 'Other'];

  useEffect(() => {
    axios.get('https://profilelinks.onrender.com/api/links')
      .then(res => setLinks(res.data))
      .catch(err => console.error("Error fetching links", err));
  }, []);

  const handleLogin = async (password) => {
    try {
      const res = await axios.post('https://profilelinks.onrender.com/api/links/auth/verify', { password });
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
      const res = await axios.post('https://profilelinks.onrender.com/api/links', newLinkData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLinks([res.data.data, ...links]); 
      setIsAdmin(false); 
    } catch (err) {
      alert('Session expired. Please log in again.');
      setIsAdmin(false);
    }
  };

  // Filter links dynamically based on the active tab selection
  const filteredLinks = links.filter(link => {
    if (activeTab === 'All') return true;
    return (link.category || 'Socials') === activeTab;
  });

  return (
    <div className="flex flex-col items-center justify-between min-h-screen p-6 max-w-xl mx-auto w-full bg-[#050505] selection:bg-cyan-500/30 relative">
      
      {/* Header */}
      <header className="flex flex-col items-center text-center mt-12 mb-8 w-full z-10">
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

      {/* Dynamic Folders / Tab Switcher Navigation Bar */}
      <div className="w-full flex items-center justify-start gap-1 overflow-x-auto pb-3 mb-6 border-b border-slate-900/80 z-10 scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 text-xs font-semibold tracking-wide uppercase rounded-full transition-all whitespace-nowrap border ${
              activeTab === tab
                ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-md shadow-cyan-500/5'
                : 'bg-transparent text-slate-500 border-transparent hover:text-slate-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Public Links Section */}
      <main className="w-full flex-grow z-10">
        {filteredLinks.length === 0 ? (
          <p className="text-center text-slate-600 text-xs italic mt-10">No items categorized inside this folder folder.</p>
        ) : (
          filteredLinks.map(link => (
            <LinkCard key={link._id} id={link._id} title={link.title} url={link.url} />
          ))
        )}
      </main>

      {/* Admin Panel */}
      <footer className="w-full mt-12 mb-6 flex justify-center z-10">
        {isAdmin ? (
          <AdminPanel onAdd={handleAddLink} links={links} />
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

      {/* Render the isolated AI Chatbot floating over the viewport */}
      <AIChatWidget />
    </div>
  );
}

export default App;