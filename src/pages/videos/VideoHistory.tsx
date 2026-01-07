import { useEffect, useState } from "react";
import {  historyVideos, type Video } from "../../api/video.ts";
import Spinner from "../../components/ui/Spinner.tsx";
import { twMerge } from "tailwind-merge";
import { MdSubscriptions, MdVideoLibrary } from "react-icons/md";
import VideoCard from "../../components/video/VideoCard.tsx";

function VideoHistory() {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        loadVideos().then(() => {});
    }, []);
    const loadVideos = async () => {
        try {
            const data = await historyVideos();
            setVideos(data);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };
    if (loading)
        return (
            <div className={"p-10 text-center justify-center items-center"}>
                <Spinner color={"disabled"} />
            </div>
        );
    if (videos.length === 0) {
        return (
            <div
                className={twMerge([
                    "flex",
                    "flex-col",
                    "items-center",
                    "justify-center",
                    "h-[50dvh]",
                ])}>
                <MdSubscriptions className={"w-10 h-10 text-text-disabled"} />
                <h2 className={"text-xl font-bold mb-2"}>동영상 시청기록 </h2>
                <p className={"text-text-disabled mb-6 text-sm text-center max-w-60"}>
                </p>
            </div>
        );
    }
    return (
        <div className={twMerge(["p-4", "sm:p-6"])}>
            <h1
                className={twMerge(
                    ["text-2xl", "mb-6", "font-bold"],
                    ["flex", "items-center", "gap-3"],
                )}>
                <MdVideoLibrary className={"text-primary-main"} /> 시청기록
            </h1>
            <div className={twMerge(["flex", "flex-wrap"])}>
                {videos.map(video => (
                    <div
                        key={video.id}
                        className={twMerge(
                            ["w-full", "sm:w-1/2", "md:w-1/3", "lg:w-1/4"],
                            ["px-2", "mb-8"],
                        )}>
                        <VideoCard video={video} />
                    </div>
                ))}
            </div>
        </div>
    );
}
export default VideoHistory;
