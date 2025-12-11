import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { Vibrant } from 'node-vibrant/node';
import { getAlbumTracksAndFeatures } from '@/lib/spotify';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const albums = await prisma.album.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(albums);
}

export async function POST(request: Request) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { spotifyId, title, artist, coverUrl } = await request.json();

        // 1. Check if already exists for this user
        const existing = await prisma.album.findFirst({
            where: { userId: session.user.id, spotifyId },
        });

        if (existing) {
             return NextResponse.json({ error: 'Album already in shelf' }, { status: 400 });
        }

        // 2. Extract Color
        let primaryColor = "#000000";
        try {
            // node-vibrant works best with file paths or Buffers, sometimes URLs can be tricky if headers are strict
            // We'll try fetching the buffer first
            // Note: In browser context Vibrant works with URL, but in node it expects path or buffer usually.
            // But let's try the URL method first, or fetch buffer.
            
            // Actually, we can just save it for now and let the client handle it? 
            // No, the requirement was "sides of the records are the main color".
            // It's better to compute once.
            
            const palette = await Vibrant.from(coverUrl).getPalette();
            primaryColor = palette.Vibrant?.hex || palette.DarkVibrant?.hex || "#000000";
        } catch (e) {
            console.error("Color extraction failed", e);
        }

        // 3. Fetch Audio Features (from Spotify or Mock)
        const features = await getAlbumTracksAndFeatures(spotifyId);

        // 4. Save to DB
        const album = await prisma.album.create({
            data: {
                userId: session.user.id,
                spotifyId,
                title,
                artist,
                coverUrl,
                primaryColor,
                ...features
            }
        });

        return NextResponse.json(album);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
