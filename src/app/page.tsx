"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RoomSetup from "@/components/RoomSetup";
import { GameType } from "@/types/game";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCreate = async (locations: string[], gameType: GameType) => {
    setLoading(true);
    const res = await fetch("/api/rooms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locations, gameType }),
    });
    const data = await res.json();
    setLoading(false);
    setRoomId(data.id);
  };

  const handleCopy = () => {
    const url = `${window.location.origin}/room/${roomId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-black bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            🧗 Climbing Random
          </h1>
          <Link
            href="/history"
            className="text-sm px-4 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          >
            히스토리
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {roomId ? (
          /* 방 생성 완료 */
          <div className="w-full max-w-md mx-auto space-y-5 text-center">
            <div className="text-5xl">🎉</div>
            <h2 className="text-2xl font-black">방이 만들어졌어요!</h2>
            <p className="text-zinc-500">아래 링크를 멤버들에게 공유하세요</p>

            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3">
              <div className="flex gap-2">
                <input
                  readOnly
                  value={`${typeof window !== "undefined" ? window.location.origin : ""}/room/${roomId}`}
                  className="flex-1 px-3 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm font-mono truncate"
                />
                <button
                  onClick={handleCopy}
                  className="px-4 py-2.5 rounded-xl bg-blue-500 text-white text-sm font-bold hover:bg-blue-600 transition whitespace-nowrap"
                >
                  {copied ? "✓ 복사됨" : "복사"}
                </button>
              </div>
              <button
                onClick={() => router.push(`/room/${roomId}`)}
                className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition shadow-md"
              >
                지금 바로 참여하기
              </button>
            </div>

            <button
              onClick={() => setRoomId(null)}
              className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition"
            >
              새 방 만들기
            </button>
          </div>
        ) : (
          /* 방 생성 폼 */
          <>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">오늘 어디서 클라이밍할까?</h2>
              <p className="text-zinc-500">후보 장소와 게임을 선택하고 방을 만드세요</p>
            </div>
            <RoomSetup onCreate={handleCreate} loading={loading} />
          </>
        )}
      </main>
    </div>
  );
}
