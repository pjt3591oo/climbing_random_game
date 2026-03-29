"use client";

import { use, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { GameRoom } from "@/types/game";
import KakaoShareButton from "@/components/KakaoShareButton";

const GAME_LABELS: Record<string, string> = {
  roulette: "🎡 룰렛",
  ladder: "🪜 사다리 타기",
  card: "🃏 카드 뒤집기",
  draw: "🎋 제비뽑기",
};

export default function ResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const playId = searchParams.get("playId");

  const [room, setRoom] = useState<GameRoom | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/rooms/${id}`)
      .then((r) => {
        if (!r.ok) { setNotFound(true); return null; }
        return r.json();
      })
      .then((data) => data && setRoom(data));
  }, [id]);

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="text-5xl">🔍</div>
        <p className="text-xl font-bold">방을 찾을 수 없습니다</p>
        <Link href="/" className="px-6 py-3 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition">
          홈으로
        </Link>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-zinc-400 animate-pulse">로딩 중...</div>
      </div>
    );
  }

  const myPlay = playId ? room.plays.find((p) => p.id === playId) : null;
  const locationCounts = room.locations.map((loc) => {
    const matched = room.plays.filter((p) => p.result === loc.name);
    return { name: loc.name, count: matched.length, players: matched.map((p) => p.nickname) };
  });
  const maxCount = Math.max(...locationCounts.map((l) => l.count), 1);
  const roomUrl = typeof window !== "undefined" ? `${window.location.origin}/room/${id}` : `/room/${id}`;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href={`/room/${id}`} className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 text-sm">
            ← 게임으로
          </Link>
          <h1 className="text-lg font-bold">{GAME_LABELS[room.gameType]} 결과</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-8 space-y-5">
        {/* 내 결과 */}
        {myPlay && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white text-center shadow-lg"
          >
            <div className="text-4xl mb-2">🏆</div>
            <div className="text-sm opacity-80 mb-1">{myPlay.nickname}의 결과</div>
            <div className="text-3xl font-black">{myPlay.result}</div>
          </motion.div>
        )}

        {/* 장소별 통계 */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <span>📊</span> 장소별 선택 횟수
          </h3>
          <div className="space-y-3">
            {locationCounts.map((loc) => (
              <div key={loc.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">{loc.name}</span>
                  <span className="text-sm text-zinc-500">{loc.count}회</span>
                </div>
                <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(loc.count / maxCount) * 100}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
                  />
                </div>
                {loc.players.length > 0 && (
                  <div className="flex gap-1 mt-1.5 flex-wrap">
                    {loc.players.map((name) => (
                      <span
                        key={name}
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          name === myPlay?.nickname
                            ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold"
                            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                        }`}
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 참가자 목록 */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <span>👥</span> 참가자 결과 ({room.plays.length}명)
          </h3>
          <div className="space-y-2">
            {room.plays.map((play) => (
              <div
                key={play.id}
                className={`flex items-center justify-between py-2 px-3 rounded-xl ${
                  play.id === playId
                    ? "bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800"
                    : "bg-zinc-50 dark:bg-zinc-800"
                }`}
              >
                <span className="font-medium text-sm">
                  {play.id === playId ? "⭐ " : ""}{play.nickname}
                </span>
                <span className="text-sm text-zinc-600 dark:text-zinc-400">📍 {play.result}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 카카오 공유 */}
        {myPlay && (
          <KakaoShareButton
            type="result"
            roomUrl={roomUrl}
            nickname={myPlay.nickname}
            result={myPlay.result}
            gameLabel={GAME_LABELS[room.gameType]}
          />
        )}

        {/* 버튼 */}
        <div className="flex gap-3">
          <Link
            href={`/room/${id}`}
            className="flex-1 py-3 rounded-xl bg-blue-500 text-white font-bold text-center hover:bg-blue-600 transition"
          >
            게임하기
          </Link>
          <Link
            href="/history"
            className="flex-1 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 font-bold text-center hover:bg-zinc-50 dark:hover:bg-zinc-800 transition"
          >
            히스토리
          </Link>
        </div>
      </main>
    </div>
  );
}
