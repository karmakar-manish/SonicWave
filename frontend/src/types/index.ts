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