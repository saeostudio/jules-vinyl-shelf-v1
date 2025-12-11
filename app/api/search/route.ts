import { getSession } from '@/lib/auth';
import { searchSpotifyAlbums } from '@/lib/spotify';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');

    if (!q) return NextResponse.json([]);

    const results = await searchSpotifyAlbums(q);
    return NextResponse.json(results);
}
