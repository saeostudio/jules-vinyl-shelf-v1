// Mock data for Spotify API if no keys are provided
export const MOCK_SPOTIFY_DATA = {
  albums: [
    {
      id: "mock1",
      name: "Abbey Road",
      artists: [{ name: "The Beatles" }],
      images: [{ url: "https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg" }],
      release_date: "1969-09-26",
    },
    {
      id: "mock2",
      name: "The Dark Side of the Moon",
      artists: [{ name: "Pink Floyd" }],
      images: [{ url: "https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png" }],
      release_date: "1973-03-01",
    },
    {
      id: "mock3",
      name: "Thriller",
      artists: [{ name: "Michael Jackson" }],
      images: [{ url: "https://upload.wikimedia.org/wikipedia/en/5/55/Michael_Jackson_-_Thriller.png" }],
      release_date: "1982-11-30",
    },
    {
        id: "mock4",
        name: "Rumours",
        artists: [{ name: "Fleetwood Mac" }],
        images: [{ url: "https://upload.wikimedia.org/wikipedia/en/f/fb/FMacRumours.PNG" }],
        release_date: "1977-02-04",
    },
    {
        id: "mock5",
        name: "Back to Black",
        artists: [{ name: "Amy Winehouse" }],
        images: [{ url: "https://upload.wikimedia.org/wikipedia/en/6/67/Amy_Winehouse_-_Back_to_Black_%28album%29.png" }],
        release_date: "2006-10-27",
    }
  ],
  audioFeatures: {
    "mock1": { energy: 0.5, valence: 0.7, danceability: 0.6, tempo: 110 },
    "mock2": { energy: 0.4, valence: 0.3, danceability: 0.4, tempo: 100 },
    "mock3": { energy: 0.9, valence: 0.8, danceability: 0.9, tempo: 120 },
    "mock4": { energy: 0.6, valence: 0.5, danceability: 0.7, tempo: 115 },
    "mock5": { energy: 0.7, valence: 0.4, danceability: 0.6, tempo: 105 },
  }
};
