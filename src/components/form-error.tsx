import { cn } from "@/lib/utils";

interface FormErrorProps extends React.HTMLAttributes<HTMLDivElement> {
  error?: string;
}

export function FormError({ error, className, ...props }: FormErrorProps) {
  if (!error) return null;

  return (
    <div
      className={cn(
        "text-sm text-destructive flex items-center gap-2 mt-1",
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
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
      <span>{error}</span>
    </div>
  );
}