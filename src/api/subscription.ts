import { api } from "./axios.ts";


export const toggleSubscribed = async (channelId:number) => {
    const response = await api.post<{isSubscribed:boolean}>(`/subscriptions/${channelId}`);
    return response.data;
}