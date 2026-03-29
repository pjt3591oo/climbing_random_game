"use client";

import { useState } from "react";
import { GameRoom } from "@/types/game";

const GAME_LABELS: Record<string, string> = {
  roulette: "🎡 룰렛",
  ladder: "🪜 사다리 타기",
  card: "🃏 카드 뒤집기",
  draw: "🎋 제비뽑기",
};

interface Props {
  room: GameRoom;
  onConfirm: (nickname: string) => void;
}

export default function NicknameInput({ room, onConfirm }: Props) {
  const [nickname, setNickname] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = nickname.trim();
    if (trimmed) onConfirm(trimmed);
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* 방 정보 */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="text-sm text-zinc-500 mb-1">게임 방</div>
        <div className="font-bold text-lg mb-3">{GAME_LABELS[room.gameType]}</div>
        <div className="text-sm text-zinc-500 mb-1">후보 장소</div>
        <div className="flex flex-wrap gap-2">
          {room.locations.map((loc) => (
            <span
              key={loc.id}
              className="px-3 py-1 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium"
            >
              {loc.name}
            </span>
          ))}
        </div>
      </div>

      {/* 닉네임 입력 */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <span className="text-2xl">👤</span> 닉네임 입력
        </h2>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="닉네임을 입력하세요"
          maxLength={20}
          autoFocus
          className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-lg"
        />
        <button
          type="submit"
          disabled={!nickname.trim()}
          className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-md"
        >
          게임 참여하기
        </button>
      </form>
    </div>
  );
}
