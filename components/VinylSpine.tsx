"use client";
import { motion } from "framer-motion";

interface VinylSpineProps {
  album: any;
  onClick: (album: any) => void;
}

export default function VinylSpine({ album, onClick }: VinylSpineProps) {
  // Determine text color based on background luminance (simple approximation)
  // or just use a contrasting color if we had one. For now, white or black.
  // We'll stick to white with a shadow or black if very light.
  // Actually, let's assume white text with text-shadow for readability on most colors.
  
  return (
    <motion.div
      layoutId={`spine-${album.id}`}
      className="relative h-full w-8 cursor-pointer group flex items-end justify-center py-4 border-l border-white/10 shadow-lg transform transition-transform hover:scale-y-105 hover:z-10 origin-bottom"
      style={{ backgroundColor: album.primaryColor }}
      onClick={() => onClick(album)}
      whileHover={{ y: -10 }}
    >
      {/* Spine Text - Rotated */}
      <div 
        className="text-white font-bold text-xs tracking-wider truncate w-[250px] text-left origin-bottom-left -rotate-90 translate-x-3 translate-y-[-10px] opacity-90 group-hover:opacity-100"
        style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
      >
        <span className="opacity-70 mr-2">{album.artist}</span>
        <span>{album.title}</span>
      </div>

      {/* Realistic lighting overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-white/10 pointer-events-none" />
    </motion.div>
  );
}
