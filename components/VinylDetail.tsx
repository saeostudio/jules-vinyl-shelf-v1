"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play } from "lucide-react";
import axios from "axios";
import { useState } from "react";

interface VinylDetailProps {
  album: any;
  onClose: () => void;
  onPlay: () => void;
}

export default function VinylDetail({ album, onClose, onPlay }: VinylDetailProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = async () => {
    try {
        await axios.post("/api/play", { albumId: album.id });
        setIsPlaying(true);
        onPlay();
        // Reset playing state visually after a while or keep it?
        // User requirements: "click a button to tell the app they´re playing that record"
        // It doesn't need to actually play audio.
    } catch (e) {
        console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 50 }}
        className="relative w-full max-w-4xl h-[600px] flex items-center justify-center perspective-1000 pointer-events-none" // pointer-events-none on container to let clicks pass through if needed, but we have content
      >
         {/* Close Button */}
         <button 
            onClick={onClose}
            className="absolute top-0 right-0 p-3 text-white bg-black/50 hover:bg-white/20 rounded-full z-[60] pointer-events-auto"
         >
            <X size={32} />
         </button>

         <div className="flex items-center relative pointer-events-auto">
             
             {/* The Sleeve */}
             <motion.div 
                className="relative w-[400px] h-[400px] shadow-2xl z-20 rounded-sm overflow-hidden"
                initial={{ x: -100, rotateY: -10 }}
                animate={{ x: -100, rotateY: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
             >
                <img 
                    src={album.coverUrl} 
                    alt={album.title} 
                    className="w-full h-full object-cover"
                />
                {/* Texture Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-white/10 pointer-events-none" />
             </motion.div>

             {/* The Vinyl Record */}
             <motion.div
                className="absolute w-[380px] h-[380px] rounded-full bg-black shadow-xl z-10 flex items-center justify-center"
                initial={{ x: -100 }}
                animate={{ 
                    x: 100,
                    rotate: isPlaying ? 360 : 0
                }}
                transition={{ 
                    x: { duration: 1, delay: 0.2, ease: "easeOut" },
                    rotate: { 
                        repeat: isPlaying ? Infinity : 0, 
                        duration: 2, 
                        ease: "linear" 
                    }
                }}
             >
                {/* Vinyl Grooves Texture */}
                <div className="absolute inset-0 rounded-full border-[30px] border-neutral-900/90" 
                     style={{ 
                        backgroundImage: 'repeating-radial-gradient(#111 0, #111 2px, #222 3px, #222 4px)' 
                     }}
                />
                
                {/* Label */}
                <div className="relative z-10 w-[140px] h-[140px] rounded-full overflow-hidden border-4 border-neutral-800" style={{ backgroundColor: album.primaryColor }}>
                    <div className="flex flex-col items-center justify-center h-full text-center p-2">
                        <p className="text-[8px] font-bold text-white uppercase tracking-widest">{album.artist}</p>
                        <p className="text-[10px] font-serif text-white leading-tight mt-1">{album.title}</p>
                    </div>
                </div>
             </motion.div>

         </div>

         {/* Controls */}
         <motion.div 
            className="absolute bottom-10 flex flex-col items-center gap-4 pointer-events-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
         >
            <h2 className="text-3xl font-bold text-white text-center drop-shadow-md">{album.title}</h2>
            <p className="text-xl text-neutral-300 drop-shadow-sm">{album.artist}</p>
            
            <button 
                onClick={handlePlay}
                disabled={isPlaying}
                className={`flex items-center gap-2 px-8 py-3 rounded-full font-bold text-lg transition shadow-lg
                    ${isPlaying ? 'bg-green-600 text-white cursor-default' : 'bg-white text-black hover:scale-105'}
                `}
            >
                <Play fill={isPlaying ? "white" : "black"} size={20} />
                {isPlaying ? "Playing..." : "Play Record"}
            </button>
         </motion.div>

      </motion.div>
    </div>
  );
}
