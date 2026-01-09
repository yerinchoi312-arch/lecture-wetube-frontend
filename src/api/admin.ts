import { api } from "./axios.ts";

export interface DashboardData {
    stats:{
        totalUsers: number;
        totalVideos: number;
        totalViews: number;
        pendingInquiries: number;
    };
    recentUsers: {
        id: number;
        email: string;
        nickname: string;
        profileImage: string | null;
        createdAt: string;
    }[];
    recentVideos: {
        id: number;
        title: string;
        thumbnailPath: string;
        views:number;
        createdAt: string;
        author:{
            nickname: string;
        }
    }[];
}

export interface UserData {
    id: number;
    email: string;
    nickname: string;
    role : "USER" | "ADMIN";
    profileImage: string | null;
    createdAt: string;
    _count :{
        videos:number;
        comments:number;
    }
}

export interface AdminUserList {
    users: UserData[];
    total : number;
    page : number;
    totalPages : number;
}

export interface VideoData {
    id: number;
    title: string;
    description: string;
    videoPath: string;
    thumbnailPath: string;
    views:number;
    createdAt: string;
    author:{
        nickname: string;
        email: string;
    };
    _count:{
        links:number;
        comments:number;
    }
}

export interface AdminVideoList {
    videos: VideoData[];
    total : number;
    page : number;
    totalPages : number;
}


export const fetchDashboardStats = async () => {
    const response = await api.get<DashboardData>("/admin/stats");
    return response.data;
}

export const fetchAdminUsers = async (page=1) => {
    const response = await api.get<AdminUserList>("/admin/users",{
        params: {page}
    });
    return response.data;
}

export const fetchAdminVideos = async (page=1) => {
    const response = await api.get<AdminVideoList>("/admin/videos", {
        params: {page}
    });
    return response.data;
}