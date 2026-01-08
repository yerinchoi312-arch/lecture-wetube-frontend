import { useEffect, useState } from "react";
import { type DashboardData, fetchDashboardStats } from "../../api/admin.ts";
import Spinner from "../../components/ui/Spinner.tsx";
import { MdLiveHelp, MdPeople, MdVideoLibrary, MdVisibility } from "react-icons/md";
import { twMerge } from "tailwind-merge";
import { Link } from "react-router";
import Avatar from "../../components/ui/Avatar.tsx";
import dayjs from "dayjs";

function AdminDashboard() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        loadData().then(() => {});
    }, []);
    const loadData = async () => {
        try {
            const result = await fetchDashboardStats();
            setData(result);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading)
        return (
            <div className={"flex justify-center items-center h-[50dvh]"}>
                <Spinner color={"disabled"} />
            </div>
        );

    if (!data) return null;

    const stats = [
        {
            label: "총 회원 수",
            value: data.stats.totalUsers.toLocaleString(),
            icon: MdPeople,
            color: "bg-blue-500",
            sub: "명",
        },
        {
            label: "총 동영상",
            value: data.stats.totalVideos.toLocaleString(),
            icon: MdVideoLibrary,
            color: "bg-indigo-500",
            sub: "개",
        },
        {
            label: "누적 조회수",
            value: data.stats.totalViews.toLocaleString(),
            icon: MdVisibility,
            color: "bg-orange-500",
            sub: "회",
        },
        {
            label: "답변 대기 문의",
            value: data.stats.pendingInquiries.toLocaleString(),
            icon: MdLiveHelp,
            color: "bg-emerald-500",
            sub: "건",
        },
    ];

    return (
        <div className={twMerge(["space-y-3"])}>
            <h1 className={"text-2xl font-bold text-gray-800"}>대시보드</h1>
            {/*카드 목록*/}
            <div className={"flex gap-3"}>
                {stats.map(stat => (
                    <div
                        key={stat.label}
                        className={twMerge(
                            ["w-full", "p-6"],
                            ["border", "border-gray-200", "bg-white", "rounded-xl"],
                            ["flex", "justify-between", "items-center"],
                            ["hover:shadow-lg"],
                        )}>
                        <div>
                            <p
                                className={twMerge([
                                    "text-sm",
                                    "font-medium",
                                    "text-gray-500",
                                    "mb-1",
                                ])}>
                                {stat.label}
                            </p>
                            <h3 className={"text-2xl font-bold text-gray-800"}>
                                {stat.value}{" "}
                                <span className={"text-sm font-normal text-gray-400"}>
                                    {stat.sub}
                                </span>
                            </h3>
                        </div>
                        <div
                            className={twMerge(
                                ["w-12", "h-12", "rounded-lg", "text-white"],
                                ["flex", "justify-center", "items-center"],
                                stat.color,
                            )}>
                            <stat.icon className={"w-6 h-6"} />
                        </div>
                    </div>
                ))}
            </div>
            {/*최근 가입 회원, 최근 등록 동영상*/}
            <div className={twMerge(["flex", "gap-3"])}>
                <div
                    className={twMerge(
                        ["w-full", "bg-white", "rounded-xl", "p-5"],
                        ["border", "border-gray-200"],
                    )}>
                    <div
                        className={twMerge(
                            ["flex", "justify-between", "items-center", "pb-5", "mb-5"],
                            ["border-b", "border-gray-100"],
                        )}>
                        <h3 className={twMerge(["font-bold", "text-gray-800"])}>최근 가입 회원</h3>
                        <Link to={"/admin/users"} className={"text-xs text-blue-600"}>
                            전체보기
                        </Link>
                    </div>
                    <div className={twMerge(["divide-y", "divide-gray-100"])}>
                        {data.recentUsers.map(user => (
                            <div
                                key={user.id}
                                className={twMerge(
                                    ["p-4", "flex", "items-center", "gap-3"],
                                    ["hover:bg-gray-50"],
                                )}>
                                <Avatar
                                    nickname={user.nickname}
                                    src={user.profileImage}
                                    size={"sm"}
                                />
                                <div className={"flex-1"}>
                                    <p className={"text-sm font-medium text-gray-800"}>
                                        {user.nickname}
                                    </p>
                                    <p className={"text-xs  text-gray-500"}>{user.email}</p>
                                </div>
                                <span className={"text-xs text-gray-400"}>
                                    {dayjs(user.createdAt).format("MM.DD")}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>


                <div
                    className={twMerge(
                        ["w-full", "bg-white", "rounded-xl", "p-5"],
                        ["border", "border-gray-200"],
                    )}>
                    <div
                        className={twMerge(
                            ["flex", "justify-between", "items-center", "pb-5", "mb-5"],
                            ["border-b", "border-gray-100"],
                        )}>
                        <h3 className={twMerge(["font-bold", "text-gray-800"])}>최근 업로드 영상</h3>
                        <Link to={"/admin/videos"} className={"text-xs text-blue-600"}>
                            전체보기
                        </Link>
                    </div>
                    <div className={twMerge(["divide-y", "divide-gray-100"])}>
                        {data.recentVideos.map(video => (
                            <div
                                key={video.id}
                                className={twMerge(
                                    ["p-4", "flex", "items-center", "gap-3"],
                                    ["hover:bg-gray-50"],
                                )}>
                                <div className={twMerge(["w-10","h-6","bg-gray-200","rounded-md","overflow-hidden"])}>
                                    {video.thumbnailPath ?
                                        <img src={video.thumbnailPath} className={"w-full h-full object-cover"} />
                                        : <div className={"w-full h-full flex justify-center items-center"}>No Image</div>}
                                </div>
                                <div className={"flex-1"}>
                                    <p className={"text-sm font-medium text-gray-800"}>
                                        {video.title}
                                    </p>
                                    <p className={"text-xs  text-gray-500"}>{video.author.nickname}</p>
                                </div>
                                <span className={"text-xs text-gray-400"}>
                                    {video.views} Views
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
export default AdminDashboard;
