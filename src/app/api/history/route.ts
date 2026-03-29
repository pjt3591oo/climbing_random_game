import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const rooms = await prisma.gameRoom.findMany({
    include: { locations: true, plays: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json(rooms);
}
