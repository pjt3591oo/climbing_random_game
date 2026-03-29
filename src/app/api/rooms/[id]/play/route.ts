import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { nickname, result } = await request.json();

  const play = await prisma.gamePlay.create({
    data: { nickname, result, gameRoomId: id },
  });

  return NextResponse.json(play);
}
