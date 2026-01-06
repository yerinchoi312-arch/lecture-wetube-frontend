import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { createInquiry } from "../../api/inquiry.ts";
import Button from "../../components/ui/Button.tsx";
import Input from "../../components/ui/Input.tsx";
type InquiryCreateFormData = {
    title: string;
    content: string;
};
function InquiryCreate() {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<InquiryCreateFormData>();

    const onSubmit = async (formData: InquiryCreateFormData) => {
        try {
            await createInquiry(formData.title, formData.content);
            navigate("/inquiries");
        } catch (e) {
            console.log(e);
            alert("등록에 실패했습니다.");
        }
    };


    return (
        <div className={twMerge(["max-w-4xl", "mx-auto", "px-4"])}>
            <h1 className={twMerge(["text-2xl", "font-bold", "mb-6"])}>1:1 문의 작성</h1>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className={twMerge(["p-6", "rounded-lg", "border", "border-divider", "space-y-6"])}>
                <Input
                    label={" 제목"}
                    placeholder={"제목을 입력하세요."}
                    error={errors.title?.message}
                    registration={register("title", { required: "제목은 필수입니다." })}
                />
                <div className={twMerge(["flex", "flex-col", "gap-2"])}>
                    <label className={twMerge(["text-sm", "font-medium"])}>내용</label>
                    <textarea
                        className={twMerge(
                            ["h-80", "p-3", "rounded-md", "border", "border-divider"],
                            ["focus:outline-none", "focus:border-secondary-main", "resize-none"],
                        )}
                        placeholder={"내용을 입력하세요."}
                        {...register("content", { required: "내용은 필수입니다." })}
                    />
                    {errors.content && (
                        <span className={"text-xs text-error-main"}>{errors.content.message}</span>
                    )}
                </div>

                <div
                    className={twMerge(
                        ["border-t", "border-divider", "pt-4"],
                        ["flex", "justify-end", "items-center", "gap-3"],
                    )}>
                    <Button
                        variant={"ghost"}
                        className={"border"}
                        type={"button"}
                        onClick={() => navigate("/inquiries")}>
                        취소
                    </Button>
                    <Button type={"submit"} disabled={isSubmitting}>
                        {isSubmitting ? "등록 중 ..." : "등록하기"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
export default InquiryCreate;
