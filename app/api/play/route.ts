import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { albumId } = await request.json();

    // Verify ownership
    const album = await prisma.album.findUnique({ where: { id: albumId } });
    if (!album || album.userId !== session.user.id) {
        return NextResponse.json({ error: 'Album not found' }, { status: 404 });
    }

    const updated = await prisma.album.update({
        where: { id: albumId },
        data: {
            playCount: { increment: 1 },
            lastPlayedAt: new Date(),
        }
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
