import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { fetchMyInquiries, type Inquiry } from "../../api/inquiry.ts";
import { twMerge } from "tailwind-merge";
import Button from "../../components/ui/Button.tsx";
import dayjs from "dayjs";
import Pagination from "../../components/ui/Pagination.tsx";

function InquiryList() {
    const navigate = useNavigate();
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [loading, setLoading] = useState(true);

    const[currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const LIMIT = 5;

    useEffect(() => {
        loadInquiries(currentPage).then(() => {});
    }, [currentPage]);

    const loadInquiries = async (page:number) => {
        try {
            const result = await fetchMyInquiries(page,LIMIT);
            setInquiries(result.inquiries);
            setTotalPages(result.totalPages)
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };
    const onPageChange = (page:number) => {
        setCurrentPage(page);
        window.scrollTo(0, 0);
    }

    return (
        <div className={twMerge(["max-w-4xl", "mx-auto", "px-4"])}>
            <div className={twMerge(["flex", "justify-between", "items-center", "mb-6"])}>
                <h1 className={"text-2xl font-bold"}>1:1 문의</h1>
                <Button onClick={() => navigate("/inquiries/new")}>문의하기</Button>
            </div>
            {/*게시판 목록*/}
            <div className={twMerge(["border", "border-divider", "rounded-lg"])}>
                <table className={twMerge(["w-full"])}>
                    <thead className={twMerge(["border-b", "border-divider"])}>
                        <tr>
                            <th
                                className={twMerge(
                                    ["px-6", "py-3", "w-[10%]", "min-w-20"],
                                    ["text-sm", "font-medium"],
                                )}>
                                상태
                            </th>
                            <th
                                className={twMerge(
                                    ["px-6", "py-3", "w-[70%]"],
                                    ["text-sm", "font-medium"],
                                )}>
                                제목
                            </th>
                            <th
                                className={twMerge(
                                    ["px-6", "py-3", "w-[20%]", "min-w-25"],
                                    ["text-sm", "font-medium"],
                                )}>
                                날짜
                            </th>
                        </tr>
                    </thead>
                    <tbody className={twMerge(["divide-y","divide-divider"])}>
                    {loading? (
                        <tr>
                            <td colSpan={3} className={twMerge(["p-8","text-center"])}>
                                로딩중...
                            </td>
                        </tr>
                    ) : (
                        inquiries.length === 0 ?(
                            <tr>
                                <td colSpan={3} className={twMerge(["p-8","text-center"])}>
                                   문의 내역이 없습니다.
                                </td>
                            </tr>
                        ):(
                            inquiries.map(inquiry=>(
                                <tr key={inquiry.id}
                                className={twMerge(["hover:bg-background-disabled/10","transition-colors"])}>
                                    <td className={twMerge(["px-6","py-4"])}>
                                        <span className={twMerge(["px-2","py-1","text-xs","rounded-full","whitespace-nowrap"],
                                        inquiry.isAnswered
                                            ? ["bg-success-main/10","text-success-main"]
                                            : ["bg-text-disabled/10","text-text-disabled"]
                                        )}>
                                            {inquiry.isAnswered ? "답변완료" : "답변대기"}
                                        </span>
                                    </td>
                                    <td className={twMerge(["px-6","py-4"])}>
                                        <Link to={`/inquiries/${inquiry.id}`}>{inquiry.title}</Link>
                                    </td>
                                    <td className={twMerge(["px-6","py-4"])}>{dayjs(inquiry.createdAt).format("YYYY.MM.DD")}</td>
                                </tr>
                            ))
                        )
                    )}
                    </tbody>
                </table>
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
        </div>
    );
}
export default InquiryList;
