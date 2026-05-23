import { useState } from 'react';
import { Plus, BarChart3, ExternalLink, Folder } from 'lucide-react';

const AdminPanel = ({ onAdd, links = [] }) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('Socials'); // New state tracking selection

  const categoriesList = ['Socials', 'Coding', 'Portfolio', 'Other'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title && url) {
      onAdd({ title, url, category }); // Include category payload on callback
      setTitle('');
      setUrl('');
      setCategory('Socials');
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* Create Link Form */}
      <form onSubmit={handleSubmit} className="w-full bg-slate-800/50 p-4 border border-slate-700/60 rounded-xl flex flex-col gap-3">
        <div className="w-full flex flex-col md:flex-row gap-3 items-center">
          <input 
            value={title}
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="Link Title (e.g., LeetCode)" 
            className="w-full md:w-1/3 p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500"
          />
          <input 
            value={url}
            onChange={(e) => setUrl(e.target.value)} 
            placeholder="URL (https://...)" 
            className="w-full md:w-2/3 p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500"
          />
        </div>
        
        <div className="w-full flex flex-col sm:flex-row gap-3 items-center justify-between border-t border-slate-700/40 pt-3">
          {/* Category Dropdown Picker */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <label className="text-xs font-medium text-slate-400 flex items-center gap-1">
              <Folder size={14} /> Assign Folder:
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-slate-900 text-slate-200 border border-slate-700 text-xs rounded-lg p-2 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              {categoriesList.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <button 
            type="submit"
            className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
          >
            <Plus size={16}/> Add Link
          </button>
        </div>
      </form>

      {/* Analytics Feed Section */}
      <div className="w-full bg-slate-900/40 border border-slate-800/80 rounded-xl p-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
          <BarChart3 size={14} className="text-cyan-400" /> Link Analytics Dashboard
        </h3>
        
        {links.length === 0 ? (
          <p className="text-xs text-slate-600 italic">No links available to track yet.</p>
        ) : (
          <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1 scrollbar-thin">
            {links.map((link) => (
              <div 
                key={link._id} 
                className="flex items-center justify-between p-3 bg-black/40 border border-slate-800/60 rounded-lg group hover:border-slate-700/80 transition-colors"
              >
                <div className="flex flex-col min-w-0 pr-4">
                  <span className="text-sm font-medium text-slate-200 truncate flex items-center gap-1.5">
                    {link.title}
                    <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-normal">
                      {link.category || 'Socials'}
                    </span>
                    <a 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-slate-500 hover:text-cyan-400 transition-colors"
                    >
                      <ExternalLink size={12} />
                    </a>
                  </span>
                  <span className="text-[11px] text-slate-500 truncate mt-0.5 font-light">
                    {link.url}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-950 border border-slate-800 rounded-full shadow-inner">
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></span>
                  <span className="text-xs font-mono font-bold text-cyan-400">
                    {link.clicks || 0}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium tracking-wide">
                    {link.clicks === 1 ? 'click' : 'clicks'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminPanel;