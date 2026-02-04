import { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import type { ButtonProps, ButtonVariant, ButtonSize } from "./Button.models";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 border-b-2 border-blue-700 hover:border-blue-600",
  secondary:
    "bg-slate-800/80 text-white backdrop-blur-sm border border-slate-700/50 hover:bg-slate-700/80 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 shadow-lg shadow-black/20",
  outline:
    "border-2 border-slate-700 bg-transparent text-slate-300 hover:border-blue-500/50 hover:bg-blue-500/10 hover:text-white hover:-translate-y-0.5 active:translate-y-0 active:scale-95",
  ghost:
    "text-slate-400 hover:bg-slate-800/50 hover:text-white transition-colors duration-200",
  danger:
    "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-500/30 hover:shadow-red-500/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 border-b-2 border-red-700 hover:border-red-600",
  success:
    "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 border-b-2 border-emerald-700 hover:border-emerald-600",
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: "px-3 py-1.5 text-xs font-medium rounded-lg",
  sm: "px-4 py-2 text-sm font-medium rounded-lg",
  md: "px-6 py-2.5 text-sm font-semibold rounded-xl",
  lg: "px-8 py-3 text-base font-semibold rounded-xl",
  xl: "px-10 py-4 text-lg font-bold rounded-2xl",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      children,
      fullWidth = false,
      disabled,
      className,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      "relative inline-flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:active:scale-100";
    const widthStyle = fullWidth ? "w-full" : "";

    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className || ""}`;

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${combinedClassName} gap-2`}
        {...props}
      >
        {isLoading && <Loader2 className="animate-spin h-5 w-5" />}
        {!isLoading && LeftIcon && <LeftIcon className="h-5 w-5" />}
        {children}
        {!isLoading && RightIcon && <RightIcon className="h-5 w-5" />}
      </button>
    );
  },
);

export default Button;
