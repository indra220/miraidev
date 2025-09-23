import { cn } from "@/lib/utils";

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "white";
}

export function LoadingSpinner({
  size = "md",
  variant = "primary",
  className,
  ...props
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  const variantClasses = {
    primary: "border-blue-500 border-t-blue-500/20",
    secondary: "border-gray-500 border-t-gray-500/20",
    white: "border-white border-t-white/20",
  };

  return (
    <div
      className={cn(
        "inline-block animate-spin rounded-full border-2 border-solid border-current border-t-transparent",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      {...props}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}