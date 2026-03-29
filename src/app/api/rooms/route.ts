import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { gameType, locations } = await request.json();

  const room = await prisma.gameRoom.create({
    data: {
      gameType,
      locations: {
        create: locations.map((name: string) => ({ name })),
      },
    },
    include: { locations: true },
  });

  return NextResponse.json({ id: room.id });
}
