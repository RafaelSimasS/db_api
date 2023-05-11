export interface SaveDataFormat {
    user: string,
    images: {
        [key: string]: string,
    };
}

export interface RetrieveUserFaces {
    user: string,

}