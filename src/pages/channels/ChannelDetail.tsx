import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { type ChannelData, fetchChannel } from "../../api/channel.ts";
import { twMerge } from "tailwind-merge";
import Spinner from "../../components/ui/Spinner.tsx";
import { useAuthStore } from "../../store/useAuthStore.ts";
import Avatar from "../../components/ui/Avatar.tsx";
import { toggleSubscribed } from "../../api/subscription.ts";
import { useModalStore } from "../../store/useModalStore.ts";
import VideoCard from "../../components/video/VideoCard.tsx";

function ChannelDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isLoggedIn } = useAuthStore();
    const { openModal } = useModalStore();

    const [channel, setChannel] = useState<ChannelData | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(1);
    const tabList = [
        { index: 1, label: "홈", name: "home" },
        { index: 2, label: "동영상", name: "video" },
        { index: 3, label: "재생목록", name: "playlist" },
        { index: 4, label: "거뮤니티", name: "community" },
    ];

    useEffect(() => {
        loadChannel().then(() => {});
    }, [id]);

    const loadChannel = async () => {
        try {
            const result = await fetchChannel(Number(id));
            setChannel(result);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    const handleSubscribeClick = async () => {
        if (!channel) {
            return;
        }
        if (!isLoggedIn) {
            openModal("LOGIN_REQUIRED");
            return;
        }

        //API 요청을 통해서 좋아요 상태를 변경하기 이전에 미리 UI를 변경하여 즉시 반영되도록 사용자에게 눈속임
        const prevIsSubscribed = channel.isSubscribed;
        const prevSubscriberCount = channel.subscriberCount;

        const newSubscriberCount = prevIsSubscribed
            ? prevSubscriberCount - 1
            : prevSubscriberCount + 1;

        setChannel({
            ...channel,
            isSubscribed: !prevIsSubscribed,
            subscriberCount: newSubscriberCount,
        });

        try {
            await toggleSubscribed(channel.id);
        } catch (e) {
            console.log(e);
            setChannel({
                ...channel,
                subscriberCount: prevSubscriberCount,
                isSubscribed: prevIsSubscribed,
            });
        }
    };

    if (loading)
        return (
            <div className={twMerge(["h-[50dvh]", "flex", "justify-center", "items-center"])}>
                <Spinner color={"disabled"} />
            </div>
        );

    if (!channel)
        return (
            <div className={twMerge(["h-[50dvh]", "flex", "justify-center", "items-center"])}>
                채널을 찾을 수 없습니다.
            </div>
        );

    const isMyChannel = user?.id === channel.id;

    return (
        <div className={twMerge(["w-full", "min-h-screen", "pb-10"])}>
            {/*채널헤더*/}
            <div className={twMerge(["max-w-6xl", "mx-auto", "px-4", "sm:px-6", "mb-4"])}>
                <div
                    className={twMerge([
                        "flex",
                        "flex-col",
                        "sm:flex-row",
                        "items-start",
                        "sm:items-center",
                        "gap-6",
                    ])}>
                    <Avatar
                        nickname={channel.nickname}
                        src={channel.profileImage}
                        size={"xl"}
                        className={"text-4xl"}
                    />
                    <div className={twMerge(["flex-1", "flex", "flex-col", "gap-2"])}>
                        <h1 className={"text-2xl sm:text-3xl font-bold"}>{channel.nickname}</h1>
                        <div className={twMerge(["space-y-1", "text-sm", "text-text-disabled"])}>
                            <p>@{channel.email.split("@")[0]}</p>
                            <p>
                                구독자 {channel.subscriberCount}명 / 동영상 {channel.videoCount}개
                            </p>
                        </div>
                    </div>
                    <div className={twMerge(["mt-2"])}>
                        {isMyChannel ? (
                            //내 채널일 땐 " 프로필 수정" 버튼과 "동영상 등록" 버튼
                            <div className={twMerge(["flex", "gap-2"])}>
                                <button
                                    onClick={() => navigate("/users/edit")}
                                    className={twMerge(
                                        ["px-4", "py-2"],
                                        ["border", "border-divider", "rounded-full"],
                                        ["text-sm", "font-semibold"],
                                    )}>
                                    프로필 수정
                                </button>
                                <button
                                    onClick={() => navigate("/videos/upload")}
                                    className={twMerge(
                                        ["px-4", "py-2"],
                                        ["border", "border-divider", "rounded-full"],
                                        ["text-sm", "font-semibold"],
                                    )}>
                                    동영상 관리
                                </button>
                            </div>
                        ) : (
                            //내 채널이 아닐땐 "구독" 버튼
                            <button
                                onClick={handleSubscribeClick}
                                className={twMerge(
                                    ["ml-4", "px-4", "py-2", "rounded-full"],
                                    ["text-sm", "font-medium", "hover:opacity-90"],
                                    channel.isSubscribed
                                        ? ["bg-success-main", "text-success-contrastText"]
                                        : ["bg-text-default", "text-background-default"],
                                )}>
                                {channel.isSubscribed ? "구독중" : "구독"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
            {/*탭*/}
            <div
                className={twMerge(
                    ["sticky", "z-10", "top-14"],
                    ["border-b", "border-divider", "mb-6"],
                )}>
                <div
                    className={twMerge([
                        "max-w-6xl",
                        "mx-auto",
                        "px-4",
                        "flex",
                        "gap-3",
                        "overflow-x-auto",
                    ])}>
                    {tabList.map(tab => (
                        <button
                            key={tab.index}
                            className={twMerge(
                                ["py-3", "text-sm", "font-semibold", "border-b-2"],
                                tab.index === activeTab
                                    ? ["border-text-default", "text-text-default"]
                                    : ["border-transparent", "text-text-disabled"],
                            )}
                            onClick={() => setActiveTab(tab.index)}>
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>
            {/*동영상 목록*/}
            <div className={twMerge(["max-w-400", "mx-auto", "px-4"])}>
                {activeTab === 1 && <>
                    <h1 className={twMerge(
                        ["text-2xl", "mb-6","font-bold"],
                        ["flex", "items-center", "gap-3"])}>동영상
                    </h1>
                    <div className={twMerge(["flex", "flex-wrap"])}>
                        {channel.videos.map(video => (
                            <div
                                key={video.id}
                                className={twMerge(
                                    ["w-full", "sm:w-1/2", "md:w-1/3", "lg:w-1/4"],
                                    ["px-2", "mb-8"],
                                )}>
                                <VideoCard video={video} />
                            </div>
                        ))}
                    </div></>}
                {activeTab === 2 && <></>}
                {activeTab === 3 && <></>}
                {activeTab === 4 && <></>}
            </div>
        </div>
    );
}
export default ChannelDetail;
