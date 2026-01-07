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
interface VideoListResponse {
    videos :Video[],
    total:number,
    page:number,
    totalPages:number,
    hasNextPage:boolean,
}


export const fetchVideos = async (page=1,limit=24) => {
    const response = await api.get<VideoListResponse>(`/videos?page=${page}&limit=${limit}`);
    return response.data;
}

export const fetchVideo = async (videoId:number) => {
    const response = await  api.get<Video>(`/videos/${videoId}`);
    return response.data;
}

export const toggleVideoLike = async (videoId:number) => {
    const response = await api.post<{isLiked:boolean}>(`/videos/${videoId}/like`);
    return response.data;
}
// video 검색 API
export const searchVideos = async (query: string) => {
    const response = await api.get<Video[]>(`/videos/search`, {
        params: { q: query }
    });
    return response.data;
}

//구독채널영상조회
export const fetchSubscribedVideos = async () =>{
    const response = await api.get<Video[]>("/videos/subscribed");
    return response.data;
}
