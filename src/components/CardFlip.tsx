"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Props {
  locations: string[];
  onResult: (result: string) => void;
}

export default function CardFlip({ locations, onResult }: Props) {
  const [cards, setCards] = useState<string[]>([]);
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);
  const [shuffling, setShuffling] = useState(true);

  useEffect(() => {
    const shuffled = [...locations].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setTimeout(() => setShuffling(false), 1500);
  }, [locations]);

  const handleFlip = (index: number) => {
    if (flippedIndex !== null || shuffling) return;
    setFlippedIndex(index);
    setTimeout(() => {
      onResult(cards[index]);
    }, 800);
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <p className="text-zinc-500">카드를 선택하세요!</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-lg">
        {cards.map((location, i) => (
          <motion.div
            key={i}
            initial={{ rotateY: 0, x: 0 }}
            animate={
              shuffling
                ? { x: [0, Math.random() * 100 - 50, 0], y: [0, Math.random() * 50 - 25, 0] }
                : flippedIndex === i
                ? { rotateY: 180 }
                : {}
            }
            transition={shuffling ? { duration: 1.5, ease: "easeInOut" } : { duration: 0.6 }}
            className="perspective-1000"
          >
            <button
              onClick={() => handleFlip(i)}
              disabled={flippedIndex !== null || shuffling}
              className="relative w-28 h-40 cursor-pointer disabled:cursor-not-allowed"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Card Back */}
              <div
                className={`absolute inset-0 rounded-xl border-2 flex items-center justify-center text-4xl transition-all duration-500 ${
                  flippedIndex === i ? "opacity-0 rotate-y-180" : "opacity-100"
                } ${
                  flippedIndex !== null && flippedIndex !== i
                    ? "bg-zinc-300 dark:bg-zinc-700 border-zinc-400"
                    : "bg-gradient-to-br from-blue-500 to-purple-600 border-blue-400 hover:from-blue-600 hover:to-purple-700 shadow-lg"
                }`}
              >
                ❓
              </div>

              {/* Card Front */}
              <div
                className={`absolute inset-0 rounded-xl border-2 border-amber-400 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900 dark:to-amber-950 flex items-center justify-center transition-all duration-500 ${
                  flippedIndex === i ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className="text-center px-2">
                  <div className="text-2xl mb-1">📍</div>
                  <div className="font-bold text-sm text-amber-800 dark:text-amber-200">
                    {location}
                  </div>
                </div>
              </div>
            </button>
          </motion.div>
        ))}
      </div>

      {flippedIndex !== null && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-blue-600 dark:text-blue-400"
        >
          🎉 결과: {cards[flippedIndex]}
        </motion.div>
      )}
    </div>
  );
}
