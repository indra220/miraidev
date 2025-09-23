import { cn } from "@/lib/utils";

interface FormSuccessProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: string;
}

export function FormSuccess({ message, className, ...props }: FormSuccessProps) {
  if (!message) return null;

  return (
    <div
      className={cn(
        "text-sm text-green-500 flex items-center gap-2 mt-1",
        className
      )}
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
      <span>{message}</span>
    </div>
  );
}