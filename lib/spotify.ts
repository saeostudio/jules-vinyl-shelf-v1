import axios from 'axios';
import { MOCK_SPOTIFY_DATA } from './mockData';

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

let accessToken: string | null = null;
let tokenExpiresAt: number = 0;

async function getAccessToken() {
    if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) return null;
    
    if (accessToken && Date.now() < tokenExpiresAt) {
        return accessToken;
    }

    try {
        const response = await axios.post('https://accounts.spotify.com/api/token', 
            new URLSearchParams({ grant_type: 'client_credentials' }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + (Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString('base64'))
                }
            }
        );

        accessToken = response.data.access_token;
        tokenExpiresAt = Date.now() + (response.data.expires_in * 1000);
        return accessToken;
    } catch (error) {
        console.error("Failed to get Spotify access token", error);
        return null;
    }
}

export async function searchSpotifyAlbums(query: string) {
    const token = await getAccessToken();

    if (!token) {
        // Return mock data filtered by query
        return MOCK_SPOTIFY_DATA.albums.filter(a => 
            a.name.toLowerCase().includes(query.toLowerCase()) || 
            a.artists[0].name.toLowerCase().includes(query.toLowerCase())
        );
    }

    try {
        const response = await axios.get(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=album&limit=10`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.albums.items;
    } catch (error) {
        console.error("Spotify search error", error);
        return [];
    }
}

export async function getAlbumTracksAndFeatures(albumId: string) {
    const token = await getAccessToken();

    if (!token) {
        // Return mock features
        // @ts-ignore
        return MOCK_SPOTIFY_DATA.audioFeatures[albumId] || { energy: 0.5, valence: 0.5, danceability: 0.5, tempo: 120 };
    }

    try {
        // 1. Get Album Tracks
        const tracksResponse = await axios.get(`https://api.spotify.com/v1/albums/${albumId}/tracks?limit=20`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const trackIds = tracksResponse.data.items.map((t: any) => t.id).join(',');

        // 2. Get Audio Features for tracks
        const featuresResponse = await axios.get(`https://api.spotify.com/v1/audio-features?ids=${trackIds}`, {
             headers: { Authorization: `Bearer ${token}` }
        });

        // 3. Calculate Average
        const features = featuresResponse.data.audio_features.filter((f: any) => f !== null);
        if (features.length === 0) return { energy: 0.5, valence: 0.5, danceability: 0.5, tempo: 120 };

        const avg = features.reduce((acc: any, curr: any) => ({
            energy: acc.energy + curr.energy,
            valence: acc.valence + curr.valence,
            danceability: acc.danceability + curr.danceability,
            tempo: acc.tempo + curr.tempo
        }), { energy: 0, valence: 0, danceability: 0, tempo: 0 });

        return {
            energy: avg.energy / features.length,
            valence: avg.valence / features.length,
            danceability: avg.danceability / features.length,
            tempo: avg.tempo / features.length
        };

    } catch (error) {
        console.error("Spotify features error", error);
        return { energy: 0.5, valence: 0.5, danceability: 0.5, tempo: 120 };
    }
}
