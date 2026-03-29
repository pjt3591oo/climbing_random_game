"use client";

import { use, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import NicknameInput from "@/components/NicknameInput";
import Roulette from "@/components/Roulette";
import Ladder from "@/components/Ladder";
import CardFlip from "@/components/CardFlip";
import DrawLots from "@/components/DrawLots";
import { GameRoom } from "@/types/game";
import Link from "next/link";

type Step = "nickname" | "playing";

const GAME_LABELS: Record<string, string> = {
  roulette: "🎡 룰렛",
  ladder: "🪜 사다리 타기",
  card: "🃏 카드 뒤집기",
  draw: "🎋 제비뽑기",
};

export default function RoomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [room, setRoom] = useState<GameRoom | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [step, setStep] = useState<Step>("nickname");
  const [nickname, setNickname] = useState("");

  const fetchRoom = useCallback(async () => {
    const res = await fetch(`/api/rooms/${id}`);
    if (!res.ok) { setNotFound(true); return; }
    setRoom(await res.json());
  }, [id]);

  useEffect(() => { fetchRoom(); }, [fetchRoom]);

  const handleNickname = (name: string) => {
    setNickname(name);
    setStep("playing");
  };

  const handleResult = async (selected: string) => {
    const res = await fetch(`/api/rooms/${id}/play`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nickname, result: selected }),
    });
    const play = await res.json();
    router.push(`/room/${id}/result?playId=${play.id}`);
  };

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

  const locationNames = room.locations.map((l) => l.name);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 text-sm">
            ← 홈
          </Link>
          <h1 className="text-lg font-bold">{GAME_LABELS[room.gameType]}</h1>
          {step !== "nickname" && (
            <span className="ml-auto text-sm text-zinc-500">
              👤 {nickname}
            </span>
          )}
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {step === "nickname" && (
          <NicknameInput room={room} onConfirm={handleNickname} />
        )}

        {step === "playing" && (
          <div>
            {room.gameType === "roulette" && (
              <Roulette locations={locationNames} onResult={handleResult} />
            )}
            {room.gameType === "ladder" && (
              <Ladder players={[nickname]} locations={locationNames} onResult={handleResult} />
            )}
            {room.gameType === "card" && (
              <CardFlip locations={locationNames} onResult={handleResult} />
            )}
            {room.gameType === "draw" && (
              <DrawLots locations={locationNames} onResult={handleResult} />
            )}
          </div>
        )}
      </main>
    </div>
  );
}
