import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, BarChart3, ExternalLink, Folder, Move } from 'lucide-react';

const AdminPanel = ({ onAdd, links = [] }) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('Socials');
  
  // Local state copy tracking order to allow real-time shifting rendering
  const [localLinks, setLocalLinks] = useState([]);
  const [isSavingOrder, setIsSavingOrder] = useState(false);

  const categoriesList = ['Socials', 'Coding', 'Portfolio', 'Other'];

  // Keep local layout in sync when parent lists change or a new link is successfully appended
  useEffect(() => {
    setLocalLinks(links);
  }, [links]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title && url) {
      onAdd({ title, url, category });
      setTitle('');
      setUrl('');
      setCategory('Socials');
    }
  };

  // =========================================================
  // HTML5 DRAG AND DROP HANDLERS
  // =========================================================
  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('text/plain', index);
    e.currentTarget.classList.add('opacity-40');
  };

  const handleDragEnd = (e) => {
    e.currentTarget.classList.remove('opacity-40');
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Required to allow drop events to fire
  };

  const handleDrop = async (e, targetIndex) => {
    e.preventDefault();
    const sourceIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    if (sourceIndex === targetIndex) return;

    // Rearrange our item indices position mapping locally
    const updatedList = [...localLinks];
    const [removedItem] = updatedList.splice(sourceIndex, 1);
    updatedList.splice(targetIndex, 0, removedItem);

    // Immediate optimistic rendering update
    setLocalLinks(updatedList);
    setIsSavingOrder(true);

    try {
      const token = localStorage.getItem('adminToken');
      // Push reordered structure sequence directly to our new backend router API endpoint
      await axios.put('https://profilelinks.onrender.com/api/links/reorder', 
        { orderedLinks: updatedList },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error('Failed to sync reorder positioning details:', err);
      alert('Could not save reordered list layout sequence. Please refresh.');
      setLocalLinks(links); // Rollback to parent context state if failure occurs
    } finally {
      setIsSavingOrder(false);
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
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <label className="text-xs font-medium text-slate-400 flex items-center gap-1.5 whitespace-nowrap">
              <Folder size={14} className="text-indigo-400" /> Assign Folder:
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-slate-900 text-slate-200 border border-slate-700 text-xs rounded-lg p-2.5 focus:outline-none focus:border-indigo-500 cursor-pointer w-full sm:w-auto min-w-[120px]"
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

      {/* Analytics Feed & Drag-Drop Sort Management Section */}
      <div className="w-full bg-slate-900/40 border border-slate-800/80 rounded-xl p-4 relative">
        <div className="w-full flex justify-between items-center mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <BarChart3 size={14} className="text-cyan-400" /> Management Dashboard
          </h3>
          {isSavingOrder && (
            <span className="text-[10px] px-2 py-0.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded animate-pulse font-medium">
              Saving Layout...
            </span>
          )}
        </div>
        
        <p className="text-[11px] text-slate-500 mb-3 italic">💡 Tip: Drag and pull cards vertically using the handle to rearrange placement order instantly.</p>
        
        {localLinks.length === 0 ? (
          <p className="text-xs text-slate-600 italic">No links available to track yet.</p>
        ) : (
          <div className="flex flex-col gap-2 max-h-80 overflow-y-auto pr-1 scrollbar-thin">
            {localLinks.map((link, index) => (
              <div 
                key={link._id} 
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                className="flex items-center justify-between p-3 bg-black/40 border border-slate-800/60 rounded-lg group hover:border-slate-700/80 transition-all active:scale-[0.99] cursor-grab active:cursor-grabbing"
              >
                <div className="flex items-center gap-3 min-w-0 pr-4">
                  {/* Visual Drag and Pull Icon indicator handle */}
                  <Move size={14} className="text-slate-600 group-hover:text-slate-400 transition-colors flex-shrink-0" />
                  
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium text-slate-200 truncate flex items-center gap-1.5">
                      {link.title}
                      <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-normal uppercase tracking-wider">
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
                </div>

                {/* Counter Analytics Badge */}
                <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-950 border border-slate-800 rounded-full shadow-inner flex-shrink-0">
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