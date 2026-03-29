import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const room = await prisma.gameRoom.findUnique({
    where: { id },
    include: {
      locations: true,
      plays: { orderBy: { playedAt: "asc" } },
    },
  });

  if (!room) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(room);
}
