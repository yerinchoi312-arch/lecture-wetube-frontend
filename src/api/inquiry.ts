import { api } from "./axios.ts";

export interface Inquiry {
    id:number;
    title:string;
    content:string;
    answer?:string;
    isAnswered:boolean;
    answeredAt?:string;
    createdAt:string;
    author:{
        id:number;
        nickname:string;
        email:string;
        profileImage?:string;
    }
}

interface InquiryListResponse {
    inquiries:Inquiry[];
    total:number;
    page:number;
    totalPages:number;
}
//1:1 내 문의 목록 조회 API
export const fetchMyInquiries = async (page =1, limit=10) => {
    const response = await api.get<InquiryListResponse>(`/inquiries`,{
        params:{page,limit}
    });
    return response.data;
}
//1:1 문의 등록
export const createInquiry = async (title: string, content: string) => {
    const response = await api.post<Inquiry>("/inquiries", { title, content });
    return response.data;
};
//1:1 문의 상세
export const fetchInquiryDetail = async (inquiryId:number) => {
    const response = await api.get<Inquiry>(`/inquiries/${inquiryId}`);
    return response.data;
}
//1:1 문의 삭제
export const deleteInquiry = async (inquiryId:number) => {
    const response = await api.delete(`/inquiries/${inquiryId}`);
    return response.data;
}

//1:1 문의 답변 삭제
export const deleteInquiryAnswer = async (inquiryId:number) => {
    const response = await api.delete(`/inquiries/${inquiryId}/answer`);
    return response.data;
}
//1:1문의 수정
export const updateInquiry = async(inquiryId:number,data:{ title: string, content: string}) => {
    const response = await api.patch<Inquiry>(`/inquiries/${inquiryId}`,data);
    return response.data;
};
