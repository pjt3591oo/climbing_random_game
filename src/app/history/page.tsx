"use client";

import { useEffect, useState } from "react";
import { GameRoom } from "@/types/game";
import Link from "next/link";

const GAME_LABELS: Record<string, string> = {
  roulette: "🎡 룰렛",
  ladder: "🪜 사다리",
  card: "🃏 카드",
  draw: "🎋 제비뽑기",
};

export default function HistoryPage() {
  const [rooms, setRooms] = useState<GameRoom[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/history")
      .then((res) => res.json())
      .then((data) => { setRooms(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 text-sm">
            ← 뒤로
          </Link>
          <h1 className="text-lg font-bold">📜 게임 히스토리</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center text-zinc-500 py-20">로딩 중...</div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🏔️</div>
            <p className="text-zinc-500">아직 게임 기록이 없습니다</p>
            <Link href="/" className="inline-block mt-4 px-6 py-3 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition">
              첫 게임 시작하기
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {rooms.map((room) => {
              const locationCounts = room.locations.map((loc) => ({
                name: loc.name,
                count: room.plays.filter((p) => p.result === loc.name).length,
              }));
              const topLocation = locationCounts.sort((a, b) => b.count - a.count)[0];

              return (
                <div key={room.id} className="bg-white dark:bg-zinc-900 rounded-2xl p-5 shadow-sm border border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold px-3 py-1 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-full">
                      {GAME_LABELS[room.gameType]}
                    </span>
                    <span className="text-sm text-zinc-400">
                      {new Date(room.createdAt).toLocaleDateString("ko-KR", {
                        month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                      })}
                    </span>
                  </div>

                  {/* 장소별 선택 횟수 */}
                  <div className="space-y-1.5 mb-3">
                    {locationCounts.map((loc) => (
                      <div key={loc.name} className="flex items-center gap-2 text-sm">
                        <span className={`font-medium min-w-0 truncate ${loc.name === topLocation?.name && loc.count > 0 ? "text-blue-600 dark:text-blue-400" : ""}`}>
                          📍 {loc.name}
                        </span>
                        <span className="text-zinc-400 shrink-0">{loc.count}회</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-500">
                      총 {room.plays.length}명 참여
                    </span>
                    <Link
                      href={`/room/${room.id}`}
                      className="text-sm px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition"
                    >
                      방 입장
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
