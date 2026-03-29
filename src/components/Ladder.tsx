"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface Props {
  players: string[];
  locations: string[];
  onResult: (result: string) => void;
}

interface Bridge {
  col: number;
  row: number;
}

export default function Ladder({ players, locations, onResult }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [bridges, setBridges] = useState<Bridge[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null);
  const [traceResult, setTraceResult] = useState<string | null>(null);
  const [tracePath, setTracePath] = useState<{ x: number; y: number }[]>([]);
  const [animIndex, setAnimIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const cols = players.length;
  const rows = 8;
  const colWidth = 80;
  const rowHeight = 40;
  const padX = 60;
  const padY = 50;
  const width = padX * 2 + (cols - 1) * colWidth;
  const height = padY * 2 + rows * rowHeight;

  const shuffled = useRef<string[]>([]);

  useEffect(() => {
    // Shuffle locations to match player count
    const locs = [...locations];
    while (locs.length < cols) locs.push(locations[locs.length % locations.length]);
    for (let i = locs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [locs[i], locs[j]] = [locs[j], locs[i]];
    }
    shuffled.current = locs.slice(0, cols);

    // Generate bridges
    const newBridges: Bridge[] = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols - 1; col++) {
        if (Math.random() > 0.5) {
          if (!newBridges.some((b) => b.row === row && (b.col === col - 1 || b.col === col + 1))) {
            newBridges.push({ col, row });
          }
        }
      }
    }
    setBridges(newBridges);
  }, [cols, locations, rows]);

  const drawLadder = useCallback((ctx: CanvasRenderingContext2D, currentPath: { x: number; y: number }[], animIdx: number) => {
    ctx.clearRect(0, 0, width, height);

    // Draw vertical lines
    for (let c = 0; c < cols; c++) {
      const x = padX + c * colWidth;
      ctx.beginPath();
      ctx.moveTo(x, padY);
      ctx.lineTo(x, padY + rows * rowHeight);
      ctx.strokeStyle = "#d1d5db";
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    // Draw bridges
    bridges.forEach((bridge) => {
      const x1 = padX + bridge.col * colWidth;
      const x2 = padX + (bridge.col + 1) * colWidth;
      const y = padY + (bridge.row + 0.5) * rowHeight;
      ctx.beginPath();
      ctx.moveTo(x1, y);
      ctx.lineTo(x2, y);
      ctx.strokeStyle = "#9ca3af";
      ctx.lineWidth = 3;
      ctx.stroke();
    });

    // Draw player names on top
    players.forEach((name, i) => {
      const x = padX + i * colWidth;
      ctx.fillStyle = selectedPlayer === i ? "#3b82f6" : "#374151";
      ctx.font = "bold 14px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(name.length > 5 ? name.slice(0, 5) + ".." : name, x, padY - 15);
    });

    // Draw location names (hidden or revealed)
    shuffled.current.forEach((name, i) => {
      const x = padX + i * colWidth;
      ctx.fillStyle = "#374151";
      ctx.font = "bold 14px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(revealed ? (name.length > 5 ? name.slice(0, 5) + ".." : name) : "?", x, padY + rows * rowHeight + 30);
    });

    // Draw trace path
    if (currentPath.length > 1) {
      ctx.beginPath();
      ctx.moveTo(currentPath[0].x, currentPath[0].y);
      for (let i = 1; i < Math.min(animIdx + 1, currentPath.length); i++) {
        ctx.lineTo(currentPath[i].x, currentPath[i].y);
      }
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 4;
      ctx.stroke();

      // Draw ball at current position
      const ballIdx = Math.min(animIdx, currentPath.length - 1);
      ctx.beginPath();
      ctx.arc(currentPath[ballIdx].x, currentPath[ballIdx].y, 8, 0, Math.PI * 2);
      ctx.fillStyle = "#ef4444";
      ctx.fill();
    }
  }, [bridges, cols, height, padX, padY, players, revealed, rows, selectedPlayer, width, colWidth, rowHeight]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    drawLadder(ctx, tracePath, animIndex);
  }, [bridges, tracePath, animIndex, revealed, drawLadder]);

  const traceLadder = (startCol: number) => {
    const path: { x: number; y: number }[] = [];
    let col = startCol;
    let x = padX + col * colWidth;
    let y = padY;
    path.push({ x, y });

    for (let row = 0; row < rows; row++) {
      const midY = padY + (row + 0.5) * rowHeight;

      // Move down to bridge level
      path.push({ x, y: midY });

      // Check for bridge to right
      if (bridges.some((b) => b.col === col && b.row === row)) {
        col++;
        x = padX + col * colWidth;
        path.push({ x, y: midY });
      }
      // Check for bridge to left
      else if (bridges.some((b) => b.col === col - 1 && b.row === row)) {
        col--;
        x = padX + col * colWidth;
        path.push({ x, y: midY });
      }

      // Move down to next row
      const nextY = padY + (row + 1) * rowHeight;
      path.push({ x, y: nextY });
    }

    return { path, endCol: col };
  };

  const handlePlayerClick = (index: number) => {
    if (selectedPlayer !== null) return;
    setSelectedPlayer(index);

    const { path, endCol } = traceLadder(index);
    setTracePath(path);

    let idx = 0;
    const interval = setInterval(() => {
      idx++;
      setAnimIndex(idx);
      if (idx >= path.length - 1) {
        clearInterval(interval);
        setRevealed(true);
        const resultLocation = shuffled.current[endCol];
        setTraceResult(resultLocation);
        onResult(resultLocation);
      }
    }, 80);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-zinc-500">참가자를 클릭하면 사다리를 탑니다!</p>

      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700"
      />

      {selectedPlayer === null && (
        <div className="flex gap-3 flex-wrap justify-center">
          {players.map((name, i) => (
            <button
              key={i}
              onClick={() => handlePlayerClick(i)}
              className="px-4 py-2 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition"
            >
              {name}
            </button>
          ))}
        </div>
      )}

      {traceResult && (
        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 text-center">
          🎉 {players[selectedPlayer!]}의 결과: {traceResult}
        </div>
      )}
    </div>
  );
}
