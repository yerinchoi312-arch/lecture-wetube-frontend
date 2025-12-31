import {api} from "./axios.ts";

export interface Video{
    id:number;
    createdAt:string;

    title:string;
    description:string;
    videoPath:string;
    thumbnailPath:string;
    views:number;
    likeCount:number;
    isLiked?:boolean;
    isSubscribed?:boolean;
    subscriberCount?:number;
    author:{
        id:number;
        nickname:string;
        profileImage?:string;
    }
}
export const fetchVideos = async () => {
    const response = await api.get<Video[]>("/videos");
    return response.data;
}