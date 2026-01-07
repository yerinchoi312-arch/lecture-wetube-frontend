import { twMerge } from "tailwind-merge";

type SpinnerProps = {
    color?: "primary" | "secondary" | "success" | "info" | "warning" | "error"|"disabled";
};
function Spinner({ color="primary" }: SpinnerProps) {
    const colorClasses={
        primary :"border-primary-main",
        secondary:"border-secondary-main",
        success:"border-success-main",
        info:"border-info-main",
        warning:"border-warning-main",
        error:"border-error-main",
        disabled:"border-text-disabled",
    }
    return (
        <div
            className={twMerge(
                ["w-6", "h-6", "border-2"],
                colorClasses[color],
                ["border-t-transparent", "rounded-full", "animate-spin"],
            )}></div>
    );
}
export default Spinner;
