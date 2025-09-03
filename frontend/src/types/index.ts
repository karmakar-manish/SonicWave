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

export interface albumInterface {
    id: number,
    title: string,
    artist: string,
    imageUrl: string,
    songs: []
    releaseYear: string,
    createdAt: string,
    updatedAt: string
}

export interface userInterface {
    id: number,
    fullname: string,
    email: string,
    imageUrl: string,
}

export interface Stats {
    totalSongs: number,
    totalAlbums: number,
    totalUsers: number,
    totalArtists: number
}

export interface MessageInterface {
    id: number,
    senderId: string,
    receiverId: string,
    content: string,
    createdAt: string,
    updatedAt: string
}

export interface UserInterface {
    id: number,
    fullname: string,
    email: string,
    imageUrl: string
}