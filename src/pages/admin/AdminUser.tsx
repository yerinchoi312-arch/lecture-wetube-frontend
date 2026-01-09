import { twMerge } from "tailwind-merge";
import { useEffect, useState } from "react";
import { fetchAdminUsers, type UserData } from "../../api/admin.ts";
import Spinner from "../../components/ui/Spinner.tsx";
import Avatar from "../../components/ui/Avatar.tsx";
import dayjs from "dayjs";

function AdminUser() {
    const [data, setData] = useState<UserData[]>([]);
    const [page, setPage] = useState(0);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    const loadData = async (page: number) => {
        try {
            const result = await fetchAdminUsers(page);
            setData(result.users);
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
                <h1 className={"font-bold text-xl"}>회원 목록</h1>
                <p>
                    총 {total}명 (현재 페이지: {page})
                </p>
            </div>

            <div
                className={twMerge(
                    ["flex", "justify-between"],
                    ["px-6", "py-3", "text-center", "text-text-disabled", "font-semibold"],
                    ["bg-gray-100"],
                )}>
                <div className={"w-1/6 text-left"}>사용자</div>
                <div className={"w-1/6"}>이메일</div>
                <div className={"w-1/6"}>권한</div>
                <div className={"w-1/6"}>활동 (영상/댓글)</div>
                <div className={"w-1/6"}>가입일</div>
            </div>

            {data.map(item => (
                <div
                    key={item.id}
                    className={twMerge(
                        ["flex", "justify-between", "items-center"],
                        ["px-6", "py-3"],
                    )}>
                    <div
                        className={twMerge([
                            "flex",
                            "items-center",
                            "text-sm",
                            "gap-2",
                            "font-semibold",
                            "w-1/6",
                        ])}>
                        <Avatar nickname={item.nickname} src={item.profileImage} size={"sm"} />
                        {item.nickname}
                    </div>
                    <div className={"text-sm text-gray-500 text-left w-1/6"}>{item.email}</div>
                    <div className={"text-sm font-bold text-center w-1/6"}>{item.role}</div>
                    <div className={"text-sm text-gray-500 text-center w-1/6"}>
                        {item._count.videos} / {item._count.comments}
                    </div>
                    <div className={"text-sm text-gray-600 text-center w-1/6"}>
                        {dayjs(item.createdAt).format("YYYY-MM-DD")}
                    </div>
                </div>
            ))}
            <div></div>
        </div>
    );
}
export default AdminUser;
