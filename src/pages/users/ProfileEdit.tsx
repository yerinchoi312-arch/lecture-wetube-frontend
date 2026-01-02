import { twMerge } from "tailwind-merge";
import Input from "../../components/ui/Input.tsx";
import Button from "../../components/ui/Button.tsx";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import Avatar from "../../components/ui/Avatar.tsx";
import { MdCameraAlt } from "react-icons/md";
import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/useAuthStore.ts";
import { useModalStore } from "../../store/useModalStore.ts";
import { api } from "../../api/axios.ts";
import type { AxiosError } from "axios";

type ProfileEditFormData = {
    nickname: string;
    phoneNumber: string;
    gender: "MALE" | "FEMALE";
    birthDate: string;
    zipCode: string;
    address1: string;
    address2?: string;
    profileImage: FileList;
};

function ProfileEdit() {
    const navigate = useNavigate();
    const { user, updateUser } = useAuthStore();
    const { openModal } = useModalStore();
    const {
        register,
        handleSubmit,
        watch,
        setError,
        setValue,
        getValues,
        clearErrors,
        formState: { errors, isSubmitting },
    } = useForm<ProfileEditFormData>(
        //input에 들어갈 초기값을 설정함
        //우리가 useAuthStore에서 가져온 user는 우리가 생각했을 때 당연히 값이 있어야 하지만,
        //useAuthStore에서의 user 타입은 User | null 이기 때문에
        //Javascript 엔진은 없을수도 있다고 가정함, 따라서 모든 값들에 ? 가 붙는 것
        {
            defaultValues: {
                nickname: user?.nickname || "",
                phoneNumber: user?.phoneNumber || "",
                gender: user?.gender || "MALE",
                zipCode: user?.zipCode || "",
                address1: user?.address1 || "",
                address2: user?.address2 || "",
                birthDate: user?.birthDate || "",
            },
        },
    );

    const profileImageFileList = watch("profileImage");

    //원래 사진이 있거나, 인풋을 통해 발급된 임시URL이 출력이 되거나 > string
    //원래 사진이 없거나, 인풋을 통해 파일이 선택이 안됐거나 > null

    const [previewUrl, setPreviewUrl] = useState<string | null>(user?.profileImage || null);

    useEffect(() => {
        if (profileImageFileList && profileImageFileList.length > 0) {
            const file = profileImageFileList[0];
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [profileImageFileList]);

    //닉네임 중복 확인 코드
    // 이미 사용자에게는 닉네임이 있는 상태이기 때문에, 이 input을 고치지 않는 한
    // 초기값으로 이미 중복체크를 통과했다고 true를 넣어줘야함
    const [isNickNameChecked, setIsNickNameChecked] = useState(true);
    const [nickNameMessage, setNickNameMessage] = useState("");

    const handleCheckNickName = async () => {
        const nickname = getValues("nickname");
        if (!nickname) {
            setError("nickname", { message: "닉네임을 입력해주세요." });
            return;
        }
        if (user?.nickname === nickname) {
            setIsNickNameChecked(true);
            setNickNameMessage("현재 사용 중인 닉네임입니다.");
            clearErrors("nickname");
            return;
        }
        try {
            const response = await api.post("/auth/check-nickname", { nickname });
            const { isAvailable, message } = response.data;

            if (isAvailable) {
                setIsNickNameChecked(true);
                setNickNameMessage(message);
                clearErrors("nickname");
            } else {
                setIsNickNameChecked(false);
                setError("nickname", { message: message });
            }
        } catch (e) {
            console.log(e);
            setError("nickname", {
                message: "중복 확인 중 오류가 발생되었습니다.",
            });
        }
    };
    const handleAddressSearch = () => {
        openModal("ADDRESS_SEARCH", {
            onComplete: (data: { zonecode: string; address: string }) => {
                setValue("zipCode", data.zonecode, { shouldValidate: true });
                setValue("address1", data.address, { shouldValidate: true });
                document.getElementById("address2")?.focus();
            },
        });
    };

    const onSubmit = async (data: ProfileEditFormData) => {
        if (!isNickNameChecked) {
            alert("닉네임 중복 확인을 해주세요.");
            return;
        }
        try {
            const formData = new FormData();
            formData.append("nickname",data.nickname);
            formData.append("phoneNumber",data.phoneNumber);
            formData.append("gender",data.gender);
            formData.append("birthDate",data.birthDate);
            formData.append("zipCode",data.zipCode);
            formData.append("address1", data.address1);
            if(data.address2){
                formData.append("address2", data.address2);
            }
            if(data.profileImage && data.profileImage.length > 0) {
                formData.append("profileImage",data.profileImage[0]);
            }

            const response = await api.patch("/auth/profile", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (user) {
                updateUser({
                    ...user,
                    ...response.data.user,
                });
            }
            alert("프로필이 수정되었습니다.");
            navigate("/");
        } catch (e) {
            const axiosError = e as AxiosError<{ message: string }>;
            const msg = axiosError.response?.data.message || "프로필 수정 실패";
            alert(msg);
        }
    };

    return (
        <div
            className={twMerge(
                ["min-h-[calc(100dvh-var(--height-header))]"],
                ["flex", "justify-center", "items-center"],
            )}>
            <div className={twMerge(["w-full", "max-w-[500px]", "space-y-8", "p-8"])}>
                <h1 className={twMerge(["text-2xl", "font-bold", "text-center"])}>프로필 수정</h1>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className={twMerge([
                        "border",
                        "border-divider",
                        "rounded-xl",
                        "shadow-lg",
                        "bg-background-paper",
                        "space-y-6",
                        "p-6",
                    ])}>
                    {/*프로필 이미지*/}
                    <div
                        className={twMerge(
                            ["flex", "flex-col", "items-center", "justify-center", "relative"],
                            ["w-32", "h-32", "m-auto"],
                        )}>
                        <Avatar
                            nickname={user?.nickname || ""}
                            src={
                                //지금 존재하는 프로필 이미지가 있다면 그걸 출력해줘야 하고
                                //추가적으로 변경하려는 이미지가 들어온다면 그걸로 변경해서 출력해줘야 함
                                previewUrl
                            }
                            size={"xl"}
                        />
                        <label
                            htmlFor={"profile-upload"}
                            className={twMerge(
                                ["absolute", "bottom-0", "right-0", "p-2"],
                                ["bg-primary-main", "text-white", "rounded-full"],
                                ["cursor-pointer", "hover:bg-primary-dark", "shadow-md"],
                            )}>
                            <MdCameraAlt className={twMerge("w-5", "h-5")} />
                        </label>
                        <input
                            type={"file"}
                            id={"profile-upload"}
                            className={"hidden"}
                            accept={"image/*"}
                            {...register("profileImage")}
                        />
                    </div>
                    <div className={"space-y-4"}>
                        <Input
                            type={"email"}
                            label={"이메일"}
                            disabled
                            value={user?.email}
                            className={"text-text-disabled cursor-not-allowed"}
                        />
                        <div className={twMerge(["flex", "gap-2"])}>
                            <Input
                                label={"닉네임"}
                                placeholder={"닉네임을 입력해주세요"}
                                registration={register("nickname", {
                                    required: "닉네임은 필수입니다.",
                                    onChange: () => {
                                        const currentValue = getValues("nickname");
                                        if (currentValue !== user?.nickname) {
                                            setIsNickNameChecked(false);
                                            setNickNameMessage("");
                                        } else {
                                            setIsNickNameChecked(true);
                                            setNickNameMessage("현재 사용 중인 닉네임입니다. ");
                                            clearErrors("nickname");
                                        }
                                    },
                                })}
                            />
                            <Button
                                onClick={handleCheckNickName}
                                type={"button"}
                                variant={"secondary"}
                                className={twMerge(["w-32", "mt-6", "text-sm"])}>
                                중복확인
                            </Button>
                        </div>
                        {isNickNameChecked && (
                            <p className={twMerge(["text-xs", "text-success-main", "mt-[-10px]"])}>
                                {nickNameMessage}
                            </p>
                        )}
                    </div>

                    {/*개인정보*/}
                    <div className={"space-y-4"}>
                        <div className={twMerge(["flex", "justify-between", "gap-4"])}>
                            <Input
                                type={"date"}
                                label={"생년월일"}
                                registration={register("birthDate", {
                                    required: "생년월일을 선택해 주세요.",
                                })}
                                error={errors.birthDate?.message}
                            />
                            <div className={twMerge(["flex", "flex-col", "gap-1", "w-full"])}>
                                <label className={twMerge(["font-medium", "text-sm"])}>성별</label>
                                <select
                                    className={twMerge(
                                        ["w-full", "px-3", "py-2"],
                                        [
                                            "text-sm",
                                            "text-text-default",
                                            "placeholder:text-text-disabled",
                                        ],
                                        [
                                            "border",
                                            "border-divider",
                                            "rounded-md",
                                            "bg-background-default",
                                        ],
                                        ["focus:outline-none", "focus:border-secondary-main"],
                                    )}
                                    {...register("gender", {
                                        required: true,
                                    })}>
                                    <option value={"MALE"}>남성</option>
                                    <option value={"FEMALE"}>여성</option>
                                </select>
                            </div>
                        </div>
                        <Input
                            label={"핸드폰 번호"}
                            placeholder={"000-0000-0000"}
                            registration={register("phoneNumber", {
                                required: "전화번호는 필수입니다.",
                            })}
                            error={errors.phoneNumber?.message}
                        />
                    </div>

                    {/*주소 정보*/}
                    <div className={"space-y-4"}>
                        <h3
                            className={twMerge(
                                ["pb-2"],
                                ["text-lg", "font-semibold"],
                                ["border-b", "border-divider"],
                            )}>
                            주소 정보
                        </h3>
                        <div className={twMerge(["flex", "gap-2"])}>
                            <Input
                                onClick={handleAddressSearch}
                                readOnly
                                placeholder={"우편번호"}
                                registration={register("zipCode", {
                                    required: "주소는 필수입니다.",
                                })}
                                error={errors.zipCode?.message}
                            />
                            <Button
                                onClick={handleAddressSearch}
                                type={"button"}
                                variant={"secondary"}
                                className={twMerge(["w-32", "text-sm"])}>
                                주소찾기
                            </Button>
                        </div>
                        <Input
                            onClick={handleAddressSearch}
                            readOnly
                            placeholder={"기본 주소"}
                            error={errors.address1?.message}
                            registration={register("address1", {
                                required: "필수",
                            })}
                        />
                        <Input
                            id={"address2"}
                            placeholder={"상세 주소(선택)"}
                            registration={register("address2")}
                        />
                    </div>
                    <div className={twMerge(["flex", "justify-center", "gap-3", "pt-4"])}>
                        <Button
                            className={"flex-1"}
                            type={"button"}
                            variant={"secondary"}
                            onClick={() => navigate(-1)}>
                            취소
                        </Button>
                        <Button className={"flex-1"} disabled={isSubmitting}>
                            {isSubmitting ? "저장 중..." : "저장하기"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
export default ProfileEdit;
