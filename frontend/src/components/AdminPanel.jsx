import  { useState } from 'react';
import { Plus } from 'lucide-react';

const AdminPanel = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title && url) {
      onAdd({ title, url });
      setTitle('');
      setUrl('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full bg-slate-800/50 p-4 border border-slate-700/60 rounded-xl flex flex-col md:flex-row gap-3 items-center">
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
      <button 
        type="submit"
        className="w-full md:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
      >
        <Plus size={16}/> Add Link
      </button>
    </form>
  );
};

export default AdminPanel;