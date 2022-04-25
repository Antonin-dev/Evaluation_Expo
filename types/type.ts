export interface ImageType {
    id : string;
    height: number;
    width: number;
    latitude: number;
    longitude: number;
    uri: string;
}

export interface StoreImages {
    data: ImageType[] | []
    error: any;
    loading: boolean;
}