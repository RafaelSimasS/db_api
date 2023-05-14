export interface SaveDataFormat {
    user: string,
    images: {
        [key: string]: string,
    };
}

export interface RetrieveUserFaces {
    user: string,

}
export interface DeleteUser {
    user: string,
}
export interface FindUser {
    user: string
}

export interface UpdateUser{
    user: string,
    images: {
        [key: string]: string,
    };
}
