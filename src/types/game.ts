export type GameType = "roulette" | "ladder" | "card" | "draw";

export interface RoomLocation {
  id: string;
  name: string;
}

export interface GamePlay {
  id: string;
  nickname: string;
  result: string;
  playedAt: string;
}

export interface GameRoom {
  id: string;
  gameType: GameType;
  createdAt: string;
  locations: RoomLocation[];
  plays: GamePlay[];
}
