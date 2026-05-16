
import { ExternalLink } from 'lucide-react';

const LinkCard = ({ title, url }) => {
  return (
    <div className="relative group w-full mb-5">
      {/* This is the glowing background. 
        It is fully transparent (opacity-0) until you hover over the group (group-hover:opacity-100).
      */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition duration-500 group-hover:duration-200 animate-gradient-xy"></div>
      
      {/* The Actual Card */}
      <a 
        href={url} 
        target="_blank" 
        rel="noreferrer" 
        className="relative flex items-center justify-between w-full p-5 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl transition-all duration-300"
      >
        <span className="font-bold text-slate-300 group-hover:text-white tracking-wide">{title}</span>
        <ExternalLink size={20} className="text-slate-500 group-hover:text-cyan-300 transition-colors" />
      </a>
    </div>
  );
};

export default LinkCard;