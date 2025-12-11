"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";

interface QuizModalProps {
  onClose: () => void;
  albums: any[];
  onSelect: (album: any) => void;
}

const QUESTIONS = [
  {
    id: "energy",
    text: "How much energy do you need right now?",
    options: [
      { label: "Chill / Low Key", value: 0.2 },
      { label: "Moderate Vibe", value: 0.5 },
      { label: "High Energy / Hype", value: 0.9 },
    ]
  },
  {
    id: "valence",
    text: "What's the mood?",
    options: [
      { label: "Melancholic / Sad", value: 0.2 },
      { label: "Neutral / Focused", value: 0.5 },
      { label: "Happy / Uplifting", value: 0.9 },
    ]
  },
  {
    id: "tempo",
    text: "How fast should the beat be?",
    options: [
      { label: "Slow & Steady", value: 80 },
      { label: "Normal", value: 120 },
      { label: "Fast Paced", value: 160 },
    ]
  }
];

export default function QuizModal({ onClose, albums, onSelect }: QuizModalProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<any>({});
  const [finding, setFinding] = useState(false);

  const handleAnswer = (val: number) => {
    const questionId = QUESTIONS[step].id;
    const newAnswers = { ...answers, [questionId]: val };
    setAnswers(newAnswers);

    if (step < QUESTIONS.length - 1) {
        setStep(step + 1);
    } else {
        findMatch(newAnswers);
    }
  };

  const findMatch = (finalAnswers: any) => {
    setFinding(true);
    // Simple Euclidean distance or just weighted score
    setTimeout(() => {
        if (albums.length === 0) {
            alert("No albums to pick from!");
            onClose();
            return;
        }

        let bestMatch = null;
        let minDiff = Infinity;

        // Normalization for Tempo since it's 0-200 unlike others 0-1
        const normTempo = (t: number) => Math.min(Math.max((t - 60) / 140, 0), 1);
        const targetTempoNorm = normTempo(finalAnswers.tempo);

        albums.forEach(album => {
            const albumTempoNorm = normTempo(album.tempo);
            
            const diff = 
                Math.abs(album.energy - finalAnswers.energy) +
                Math.abs(album.valence - finalAnswers.valence) +
                Math.abs(albumTempoNorm - targetTempoNorm);
            
            if (diff < minDiff) {
                minDiff = diff;
                bestMatch = album;
            }
        });

        // Add a bit of randomness if multiple are close? 
        // For now, deterministic is fine.

        onSelect(bestMatch);
        onClose();
    }, 1500); // Fake "processing" delay for effect
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-indigo-900/90 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-2xl p-8 shadow-2xl relative text-center"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black"><X /></button>
        
        {finding ? (
            <div className="py-12 flex flex-col items-center">
                <Sparkles className="text-indigo-600 w-12 h-12 animate-pulse mb-4" />
                <h2 className="text-2xl font-bold text-gray-800">Finding the perfect record...</h2>
                <p className="text-gray-500 mt-2">Analyzing your vibe</p>
            </div>
        ) : (
            <>
                <div className="mb-8">
                    <span className="text-xs font-bold text-indigo-500 tracking-wider uppercase">Question {step + 1} of {QUESTIONS.length}</span>
                    <h2 className="text-2xl font-bold text-gray-800 mt-2">{QUESTIONS[step].text}</h2>
                </div>

                <div className="space-y-3">
                    {QUESTIONS[step].options.map((opt, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleAnswer(opt.value)}
                            className="w-full p-4 rounded-xl border-2 border-gray-100 hover:border-indigo-600 hover:bg-indigo-50 transition font-medium text-gray-700 text-left flex justify-between group"
                        >
                            {opt.label}
                            <span className="opacity-0 group-hover:opacity-100 transition text-indigo-600">→</span>
                        </button>
                    ))}
                </div>
            </>
        )}
      </motion.div>
    </div>
  );
}
