import { useEffect, useState } from "react";
import { fetchAdminVideos, type VideoData } from "../../api/admin.ts";
import Spinner from "../../components/ui/Spinner.tsx";
import { twMerge } from "tailwind-merge";

function AdminVideo() {
    const [data, setData] = useState<VideoData[]>([]);
    const [page, setPage] = useState(0);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    const loadData = async (page: number) => {
        try {
            const result = await fetchAdminVideos(page);
            setData(result.videos);
            setTotal(result.total);
            setPage(result.page);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        loadData(Number(page)).then(() => {});
    }, []);

    if (loading)
        return (
            <div className={"flex justify-center items-center h-[50dvh]"}>
                <Spinner />
            </div>
        );

    if (!data) return null;

    return (
        <div
            className={twMerge([
                "bg-white",
                "border",
                "border-gray-200",
                "rounded-lg",
                "divide-y",
                "divide-gray-100",
            ])}>
            <div className={twMerge(["flex", "justify-between", "p-6"])}>
                <h1 className={"font-bold text-xl"}>동영상 목록</h1>
                <p>
                    총 {total}개 (현재 페이지: {page})
                </p>
            </div>

            <div
                className={twMerge(
                    ["flex", "justify-between"],
                    ["px-6", "py-3", "text-center", "text-text-disabled", "font-semibold"],
                    ["bg-gray-100"],
                )}>
                <div className={"w-1/4"}>제목</div>
                <div className={"flex-1"}>설명</div>
            </div>

            {data.map(item => (
                <div
                    key={item.id}
                    className={twMerge(
                        ["flex", "justify-between", "items-center"],
                        ["px-6", "py-3"],
                    )}>
                    <div className={"text-sm text-gray-500 text-left w-1/4"}>
                        <img src={item.thumbnailPath} />
                        <p>{item.title}</p>
                    </div>

                    <div className={"text-sm font-bold text-center flex-1"}>{item.description}</div>
                </div>
            ))}
            <div></div>
        </div>
    );
}
export default AdminVideo;
