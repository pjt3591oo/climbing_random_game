"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  locations: string[];
  onResult: (result: string) => void;
}

export default function DrawLots({ locations, onResult }: Props) {
  const [sticks, setSticks] = useState<{ location: string; pulled: boolean }[]>([]);
  const [pulledIndex, setPulledIndex] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const shuffled = [...locations]
      .sort(() => Math.random() - 0.5)
      .map((loc) => ({ location: loc, pulled: false }));
    setSticks(shuffled);
  }, [locations]);

  const handlePull = (index: number) => {
    if (pulledIndex !== null) return;
    setPulledIndex(index);

    const updated = [...sticks];
    updated[index].pulled = true;
    setSticks(updated);

    setTimeout(() => {
      setShowResult(true);
      onResult(sticks[index].location);
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <p className="text-zinc-500">제비를 하나 뽑아보세요!</p>

      <div className="relative flex items-end justify-center gap-2 h-64">
        {/* 제비통 */}
        <div className="absolute bottom-0 w-full max-w-xs h-24 bg-gradient-to-t from-amber-800 to-amber-700 rounded-t-2xl border-2 border-amber-900 z-10" />

        {sticks.map((stick, i) => (
          <motion.button
            key={i}
            onClick={() => handlePull(i)}
            disabled={pulledIndex !== null}
            animate={
              stick.pulled
                ? { y: -120, transition: { type: "spring", stiffness: 200 } }
                : { y: 0 }
            }
            whileHover={pulledIndex === null ? { y: -20 } : {}}
            className="relative z-20 w-8 cursor-pointer disabled:cursor-not-allowed"
          >
            <div
              className={`w-3 mx-auto rounded-t-full ${
                stick.pulled
                  ? "h-40 bg-gradient-to-b from-red-400 to-red-600"
                  : "h-32 bg-gradient-to-b from-amber-300 to-amber-500 hover:from-amber-200 hover:to-amber-400"
              }`}
            >
              {/* 제비 머리 */}
              <div
                className={`w-6 h-6 -ml-1.5 rounded-full ${
                  stick.pulled ? "bg-red-500" : "bg-amber-400"
                }`}
              />
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {showResult && pulledIndex !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="text-5xl mb-4">🎊</div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              결과: {sticks[pulledIndex].location}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
