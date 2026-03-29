"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";

interface Props {
  locations: string[];
  onResult: (result: string) => void;
}

const COLORS = [
  "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4",
  "#FFEAA7", "#DDA0DD", "#FF8C00", "#87CEEB",
  "#98FB98", "#F0E68C",
];

export default function Roulette({ locations, onResult }: Props) {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const hasSpun = useRef(false);

  const segmentAngle = 360 / locations.length;

  const spin = () => {
    if (spinning || hasSpun.current) return;
    setSpinning(true);

    const extraSpins = 5 + Math.random() * 5;
    const randomAngle = Math.random() * 360;
    const totalRotation = rotation + extraSpins * 360 + randomAngle;

    setRotation(totalRotation);

    setTimeout(() => {
      const normalizedAngle = totalRotation % 360;
      const pointerAngle = (360 - normalizedAngle + 90) % 360;
      const selectedIndex = Math.floor(pointerAngle / segmentAngle) % locations.length;
      const selected = locations[selectedIndex];

      setResult(selected);
      setSpinning(false);
      hasSpun.current = true;
      onResult(selected);
    }, 4000);
  };

  const radius = 150;
  const center = 160;

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="relative">
        {/* 포인터 */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10 text-3xl">
          🔻
        </div>

        <motion.svg
          width={320}
          height={320}
          animate={{ rotate: rotation }}
          transition={{ duration: 4, ease: [0.2, 0.8, 0.2, 1] }}
          className="drop-shadow-xl"
        >
          {locations.map((loc, i) => {
            const startAngle = (i * segmentAngle - 90) * (Math.PI / 180);
            const endAngle = ((i + 1) * segmentAngle - 90) * (Math.PI / 180);
            const x1 = center + radius * Math.cos(startAngle);
            const y1 = center + radius * Math.sin(startAngle);
            const x2 = center + radius * Math.cos(endAngle);
            const y2 = center + radius * Math.sin(endAngle);
            const largeArc = segmentAngle > 180 ? 1 : 0;

            const midAngle = ((i + 0.5) * segmentAngle - 90) * (Math.PI / 180);
            const textX = center + radius * 0.65 * Math.cos(midAngle);
            const textY = center + radius * 0.65 * Math.sin(midAngle);
            const textRotation = (i + 0.5) * segmentAngle;

            return (
              <g key={i}>
                <path
                  d={`M${center},${center} L${x1},${y1} A${radius},${radius} 0 ${largeArc},1 ${x2},${y2} Z`}
                  fill={COLORS[i % COLORS.length]}
                  stroke="white"
                  strokeWidth="2"
                />
                <text
                  x={textX}
                  y={textY}
                  fill="white"
                  fontSize={locations.length > 6 ? "10" : "12"}
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${textRotation}, ${textX}, ${textY})`}
                  style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}
                >
                  {loc.length > 6 ? loc.slice(0, 6) + ".." : loc}
                </text>
              </g>
            );
          })}
          <circle cx={center} cy={center} r="20" fill="white" stroke="#ddd" strokeWidth="2" />
        </motion.svg>
      </div>

      {!result ? (
        <button
          onClick={spin}
          disabled={spinning}
          className="px-8 py-4 rounded-2xl font-bold text-lg text-white bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 disabled:opacity-50 transition shadow-lg"
        >
          {spinning ? "돌아가는 중..." : "룰렛 돌리기!"}
        </button>
      ) : (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center"
        >
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            🎉 결과: {result}
          </div>
        </motion.div>
      )}
    </div>
  );
}
