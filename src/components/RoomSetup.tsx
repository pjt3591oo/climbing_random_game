"use client";

import { useState } from "react";
import { GameType } from "@/types/game";

const GAME_TYPES: { type: GameType; label: string; icon: string; desc: string }[] = [
  { type: "roulette", label: "룰렛", icon: "🎡", desc: "룰렛을 돌려서 장소 선택" },
  { type: "ladder", label: "사다리 타기", icon: "🪜", desc: "사다리를 타고 장소 선택" },
  { type: "card", label: "카드 뒤집기", icon: "🃏", desc: "카드를 뒤집어 장소 확인" },
  { type: "draw", label: "제비뽑기", icon: "🎋", desc: "제비를 뽑아 장소 선택" },
];

interface Props {
  onCreate: (locations: string[], gameType: GameType) => void;
  loading?: boolean;
}

export default function RoomSetup({ onCreate, loading }: Props) {
  const [locations, setLocations] = useState<string[]>(["", ""]);
  const [gameType, setGameType] = useState<GameType | null>(null);

  const updateLocation = (index: number, value: string) => {
    const updated = [...locations];
    updated[index] = value;
    setLocations(updated);
  };

  const addLocation = () => setLocations([...locations, ""]);

  const removeLocation = (index: number) => {
    if (locations.length > 2) setLocations(locations.filter((_, i) => i !== index));
  };

  const validLocations = locations.filter((l) => l.trim());
  const canCreate = validLocations.length >= 2 && gameType !== null;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* 장소 입력 */}
      <section className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <span className="text-2xl">📍</span> 클라이밍장 후보
          <span className="text-sm font-normal text-zinc-400 ml-1">(최소 2개)</span>
        </h2>
        <div className="space-y-3">
          {locations.map((location, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={location}
                onChange={(e) => updateLocation(i, e.target.value)}
                placeholder={`장소 ${i + 1}`}
                className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              {locations.length > 2 && (
                <button
                  onClick={() => removeLocation(i)}
                  className="px-3 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950 rounded-xl transition"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addLocation}
            className="w-full py-2.5 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl text-zinc-500 hover:border-blue-400 hover:text-blue-500 transition"
          >
            + 장소 추가
          </button>
        </div>
      </section>

      {/* 게임 유형 선택 */}
      <section className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <span className="text-2xl">🎮</span> 게임 선택
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {GAME_TYPES.map((game) => (
            <button
              key={game.type}
              onClick={() => setGameType(game.type)}
              className={`p-4 rounded-xl border-2 text-left transition ${
                gameType === game.type
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                  : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-400"
              }`}
            >
              <div className="text-3xl mb-2">{game.icon}</div>
              <div className="font-semibold">{game.label}</div>
              <div className="text-sm text-zinc-500 mt-1">{game.desc}</div>
            </button>
          ))}
        </div>
      </section>

      {/* 생성 버튼 */}
      <button
        onClick={() => canCreate && onCreate(validLocations, gameType!)}
        disabled={!canCreate || loading}
        className="w-full py-4 rounded-2xl font-bold text-lg text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-lg"
      >
        {loading ? "방 생성 중..." : "게임 방 만들기"}
      </button>
    </div>
  );
}
