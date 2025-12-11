"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { X, Search, Loader, Check } from "lucide-react";
import { motion } from "framer-motion";

interface AddAlbumModalProps {
  onClose: () => void;
  onAdd: () => void;
}

export default function AddAlbumModal({ onClose, onAdd }: AddAlbumModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [addingId, setAddingId] = useState<string | null>(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim()) {
        searchAlbums();
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const searchAlbums = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/search?q=${encodeURIComponent(query)}`);
      setResults(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (album: any) => {
    setAddingId(album.id);
    try {
        await axios.post("/api/albums", {
            spotifyId: album.id,
            title: album.name,
            artist: album.artists[0].name,
            coverUrl: album.images[0]?.url || "",
        });
        onAdd();
        onClose();
    } catch (e) {
        console.error(e);
        setAddingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl bg-neutral-900 rounded-xl overflow-hidden shadow-2xl border border-neutral-800 flex flex-col max-h-[80vh]"
      >
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Add Album</h2>
            <button onClick={onClose} className="text-neutral-400 hover:text-white"><X /></button>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b border-neutral-800 relative">
            <Search className="absolute left-7 top-7 text-neutral-500" size={20} />
            <input 
                type="text" 
                placeholder="Search for an album..." 
                className="w-full bg-neutral-800 text-white rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
            />
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {loading && <div className="flex justify-center p-8"><Loader className="animate-spin text-white" /></div>}
            
            {!loading && results.length === 0 && query && (
                <div className="text-center text-neutral-500 p-8">No albums found.</div>
            )}

            <div className="grid grid-cols-1 gap-2">
                {results.map((album) => (
                    <div key={album.id} className="flex items-center gap-4 p-2 hover:bg-white/5 rounded-lg transition group">
                        <img src={album.images[0]?.url} alt={album.name} className="w-16 h-16 rounded object-cover" />
                        <div className="flex-1">
                            <h3 className="text-white font-medium">{album.name}</h3>
                            <p className="text-neutral-400 text-sm">{album.artists[0].name}</p>
                        </div>
                        <button 
                            onClick={() => handleAdd(album)}
                            disabled={!!addingId}
                            className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full opacity-0 group-hover:opacity-100 transition disabled:opacity-50"
                        >
                            {addingId === album.id ? <Loader className="animate-spin" size={16} /> : <Check size={16} />}
                        </button>
                    </div>
                ))}
            </div>
        </div>
      </motion.div>
    </div>
  );
}
