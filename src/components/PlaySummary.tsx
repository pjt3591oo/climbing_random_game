"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { GamePlay, GameType, RoomLocation } from "@/types/game";
import KakaoShareButton from "@/components/KakaoShareButton";

const GAME_LABELS: Record<string, string> = {
  roulette: "🎡 룰렛",
  ladder: "🪜 사다리 타기",
  card: "🃏 카드 뒤집기",
  draw: "🎋 제비뽑기",
};

interface Props {
  myNickname: string;
  myResult: string;
  plays: GamePlay[];
  locations: RoomLocation[];
  roomId: string;
  gameType: GameType;
  onPlayAgain: () => void;
}

export default function PlaySummary({
  myNickname,
  myResult,
  plays,
  locations,
  roomId,
  gameType,
  onPlayAgain,
}: Props) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (typeof window !== "undefined" ? window.location.origin : "");
  const roomUrl = `${baseUrl}/room/${roomId}`;
  const locationCounts = locations.map((loc) => {
    const matched = plays.filter((p) => p.result === loc.name);
    return {
      name: loc.name,
      count: matched.length,
      players: matched.map((p) => p.nickname),
    };
  });

  const maxCount = Math.max(...locationCounts.map((l) => l.count), 1);

  return (
    <div className="w-full max-w-lg mx-auto space-y-5 mt-6">
      {/* 내 결과 */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white text-center shadow-lg"
      >
        <div className="text-4xl mb-2">🏆</div>
        <div className="text-sm opacity-80 mb-1">{myNickname}의 결과</div>
        <div className="text-3xl font-black">{myResult}</div>
      </motion.div>

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
                        name === myNickname
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

      {/* 전체 참가자 목록 */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <h3 className="font-bold mb-3 flex items-center gap-2">
          <span>👥</span> 참가자 결과 ({plays.length}명)
        </h3>
        <div className="space-y-2">
          {plays.map((play) => (
            <div
              key={play.id}
              className={`flex items-center justify-between py-2 px-3 rounded-xl ${
                play.nickname === myNickname
                  ? "bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800"
                  : "bg-zinc-50 dark:bg-zinc-800"
              }`}
            >
              <span className="font-medium text-sm">
                {play.nickname === myNickname ? "⭐ " : ""}{play.nickname}
              </span>
              <span className="text-sm text-zinc-600 dark:text-zinc-400">📍 {play.result}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 카카오 공유 */}
      <KakaoShareButton
        type="result"
        roomUrl={roomUrl}
        nickname={myNickname}
        result={myResult}
        gameLabel={GAME_LABELS[gameType]}
      />

      {/* 버튼 */}
      <div className="flex gap-3">
        <button
          onClick={onPlayAgain}
          className="flex-1 py-3 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition"
        >
          다시 하기
        </button>
        <Link
          href={`/room/${roomId}`}
          className="flex-1 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 font-bold text-center hover:bg-zinc-50 dark:hover:bg-zinc-800 transition"
        >
          처음으로
        </Link>
        <Link
          href="/history"
          className="flex-1 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 font-bold text-center hover:bg-zinc-50 dark:hover:bg-zinc-800 transition"
        >
          히스토리
        </Link>
      </div>
    </div>
  );
}
