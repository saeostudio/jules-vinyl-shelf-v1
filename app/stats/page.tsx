"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeft, Play } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function StatsPage() {
  const [albums, setAlbums] = useState<any[]>([]);

  useEffect(() => {
    // Re-use the albums endpoint, we can sort it here or add a specific stats endpoint.
    // Since we fetch all albums anyway for the shelf, let's just fetch them and sort client-side for simplicity 
    // unless the list is huge.
    axios.get("/api/albums").then(res => {
        const sorted = res.data.sort((a: any, b: any) => b.playCount - a.playCount);
        setAlbums(sorted);
    });
  }, []);

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
            <Link href="/" className="p-2 bg-neutral-800 rounded-full hover:bg-neutral-700 transition">
                <ArrowLeft size={24} />
            </Link>
            <h1 className="text-3xl font-bold">Your Statistics</h1>
        </div>

        <div className="bg-neutral-800/50 rounded-2xl p-6 backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-6 text-neutral-400">Top Played Albums</h2>
            
            <div className="space-y-4">
                {albums.map((album, index) => (
                    <motion.div 
                        key={album.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center gap-4 p-4 bg-neutral-900/50 rounded-xl border border-neutral-800"
                    >
                        <div className="font-mono text-2xl text-neutral-500 w-8 text-center">{index + 1}</div>
                        <img src={album.coverUrl} alt={album.title} className="w-16 h-16 rounded object-cover shadow-md" />
                        <div className="flex-1">
                            <h3 className="text-lg font-bold">{album.title}</h3>
                            <p className="text-neutral-400">{album.artist}</p>
                        </div>
                        <div className="flex flex-col items-center px-4">
                            <span className="text-2xl font-bold text-indigo-400">{album.playCount}</span>
                            <span className="text-xs text-neutral-500 uppercase tracking-wider">Plays</span>
                        </div>
                    </motion.div>
                ))}
                
                {albums.length === 0 && (
                    <div className="text-center py-12 text-neutral-500">
                        No plays yet. Go spin some records!
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
