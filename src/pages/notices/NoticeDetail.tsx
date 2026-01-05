import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { deleteNotice, fetchNotice, type Notice } from "../../api/notice.ts";
import { useAuthStore } from "../../store/useAuthStore.ts";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";
import Button from "../../components/ui/Button.tsx";

dayjs.extend(relativeTime);
dayjs.locale("ko");

function NoticeDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [notice, setNotice] = useState<Notice | null>(null);
    const [loading, setLoading] = useState(true);

    const { user } = useAuthStore();

    useEffect(() => {
        loadNotice(Number(id)).then(() => {});
    }, []);

    const loadNotice = async (noticeId: number) => {
        try {
            const result = await fetchNotice(noticeId);
            setNotice(result);
        } catch (e) {
            console.log(e);
            alert("공지사항을 불러오지 못했습니다.");
            navigate("/notices");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if(!window.confirm("공지사항을 삭제하시겠습니까?"))  return;
        try{
            await deleteNotice(Number(id));
            alert("공지사항이 삭제되었습니다.");
            navigate("/notices");
        }catch(e){
            console.log(e);
            alert("삭제 권한이 없거나 오류가 발생했습니다.")
        }
    }

    if (loading) return <div>loading,,,</div>
    if (!notice) return null;

    return (
        <div className={twMerge(["w-full", "max-w-4xl", "mx-auto", "px-4"])}>
            <div className={twMerge(["border", "border-divider", "rounded-lg", "p-8"])}>
                {/*제목헤더*/}
                <div className={twMerge(["border-b", "border-divider", "pb-6", "mb-6"])}>
                    <h3 className={twMerge(["text-2xl", "font-bold", "mb-3"])}>{notice.title}</h3>
                    <div className={twMerge(["flex","justify-between","items-center"],
                        ["text-sm","text-text-disabled"])}>
                        <div>작성일 : {dayjs(notice.createdAt).format("YYYY년 MM월 DD일")}</div>
                        <div>조회수 : {notice.viewCount.toLocaleString()}</div>

                    </div>
                </div>
                {/*본문*/}
                <div className={twMerge(["min-h-50","whitespace-pre-wrap"])}>
                    {notice.content}
                </div>
                {/*버튼 푸터*/}
                <div className={twMerge(["border-t","border-divider","pt-6","mt-6"],
                    ["flex","justify-between","items-center"])}>
                    <Button variant={"secondary"} onClick={()=>navigate("/notices")}>목록</Button>
                    {user?.role === "ADMIN" && (
                        <div className={"flex gap-2"}>
                            <Button variant={"info"} onClick={()=> navigate(`/notices/${notice.id}/edit`)}>수정</Button>
                            <Button variant={"error"} onClick={handleDelete}>삭제</Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
export default NoticeDetail;
