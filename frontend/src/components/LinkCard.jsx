import  { useState } from 'react';
import axios from 'axios';

export default function LinkCard({ id, title, url }) {
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleLinkClick = async () => {
    if (isRedirecting) return;
    setIsRedirecting(true);

    try {
      // 1. Send request to the backend to log the click tracking event
      const res = await axios.post(`https://profilelinks.onrender.com/api/links/${id}/click`);
      
      // 2. Open the destination URL returned by your backend in a new tab
      window.open(res.data.url, '_blank', 'noopener,noreferrer');
    } catch (err) {
      console.error('Failed to log click analytic event:', err);
      // Fallback: If tracking fails, open the link anyway so user experience isn't broken
      window.open(url, '_blank', 'noopener,noreferrer');
    } finally {
      setIsRedirecting(false);
    }
  };

  return (
    <button
      onClick={handleLinkClick}
      className="w-full mb-4 p-4 rounded-2xl bg-neutral-900 border border-neutral-800 text-white font-medium hover:border-cyan-500/50 hover:bg-neutral-800/50 transition-all text-center relative overflow-hidden group shadow-md"
    >
      {/* Background Hover Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition duration-500"></div>
      
      <span className="relative z-10 text-sm tracking-wide transition-colors group-hover:text-cyan-400">
        {title}
      </span>
    </button>
  );
}