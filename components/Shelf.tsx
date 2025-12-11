"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import VinylSpine from "./VinylSpine";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import VinylDetail from "./VinylDetail"; // We'll create this next
import AddAlbumModal from "./AddAlbumModal"; // And this
import QuizModal from "./QuizModal"; // And this
import Link from "next/link";

export default function Shelf({ user }: { user: any }) {
  const [albums, setAlbums] = useState<any[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<any | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      const res = await axios.get("/api/albums");
      setAlbums(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRandomPick = () => {
    if (albums.length === 0) return;
    const random = albums[Math.floor(Math.random() * albums.length)];
    setSelectedAlbum(random);
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-end pb-0 overflow-hidden relative">
      
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-40 bg-gradient-to-b from-black/80 to-transparent">
         <div>
            <h1 className="text-white text-2xl font-bold">Vinyl Shelf</h1>
            <p className="text-neutral-400 text-sm">Welcome, {user.username}</p>
         </div>
         
         <div className="flex gap-4">
            <button 
                onClick={() => setIsAddModalOpen(true)}
                className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition"
            >
                <Plus size={24} />
            </button>
            <Link 
                href="/stats"
                className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition flex flex-col justify-center items-center gap-[2px]"
            >
                {/* 3 Vertical Stripes Icon */}
                <div className="w-[2px] h-4 bg-white rounded-full"></div>
                <div className="w-[2px] h-3 bg-white rounded-full"></div>
                <div className="w-[2px] h-5 bg-white rounded-full"></div>
            </Link>
         </div>
      </div>

      {/* Buttons for Pick/Quiz */}
      <div className="absolute top-32 flex gap-4 z-30">
        <button onClick={handleRandomPick} className="px-6 py-2 bg-neutral-800 text-white rounded-full border border-neutral-700 hover:bg-neutral-700 transition">
            Random Pick
        </button>
        <button onClick={() => setIsQuizOpen(true)} className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition">
            Mood Picker
        </button>
      </div>

      {/* The Shelf Visual */}
      <div className="w-full max-w-6xl h-[350px] bg-[#3a3a3a] relative shadow-2xl flex items-end px-12 perspective-1000 border-t-8 border-[#2a2a2a]">
         {/* Wooden texture/color for shelf */}
         <div className="absolute inset-0 bg-[#463e3f] shadow-[inset_0_10px_20px_rgba(0,0,0,0.5)] z-0" />
         
         {/* Spines Container */}
         <div className="relative z-10 flex items-end h-[320px] w-full overflow-x-auto overflow-y-hidden no-scrollbar gap-[1px] perspective-1000">
            {albums.map((album) => (
                <VinylSpine key={album.id} album={album} onClick={setSelectedAlbum} />
            ))}
            
            {albums.length === 0 && (
                <div className="text-white/30 w-full text-center mt-20">Your shelf is empty. Add some albums!</div>
            )}
         </div>
      </div>

      {/* Modals & Overlays */}
      <AnimatePresence>
        {selectedAlbum && (
            <VinylDetail 
                album={selectedAlbum} 
                onClose={() => setSelectedAlbum(null)} 
                onPlay={() => {
                   fetchAlbums(); // Refresh stats maybe?
                }}
            />
        )}
      </AnimatePresence>

      {isAddModalOpen && <AddAlbumModal onClose={() => setIsAddModalOpen(false)} onAdd={fetchAlbums} />}
      {isQuizOpen && <QuizModal onClose={() => setIsQuizOpen(false)} albums={albums} onSelect={setSelectedAlbum} />}

    </div>
  );
}
