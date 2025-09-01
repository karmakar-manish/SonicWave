export interface songInterface {
    id: number,
    title: string,
    artist: string,
    imageUrl: string,
    audioUrl: string,
    duration: number,
    albumId: number | null,
    createdAt: string,
    updatedAt: string
}

export interface albumInterface{
    id: number,
    title: string,
    artist: string,
    imageUrl: string,
    songs: []
    releaseYear: string,
    createdAt: string,
    updatedAt: string
}

export interface userInterface{
    id: number,
    fullname: string,
    email: string,
    imageUrl: string,
}

export interface Stats{
    totalSongs: number,
    totalAlbums: number,
    totalUsers: number,
    totalArtists: number
}