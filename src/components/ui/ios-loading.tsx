import { cn } from "@/lib/utils";

interface IOSLoadingProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function IOSLoading({ className, size = "md" }: IOSLoadingProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-10 h-10",
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <svg
        className={cn("animate-spin text-primary", sizeClasses[size])}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
}

export function IOSLoadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="ios-card p-6">
        <IOSLoading size="lg" />
      </div>
    </div>
  );
}

export function IOSLoadingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <IOSLoading size="lg" />
    </div>
  );
}

interface IOSSkeletonProps {
  className?: string;
}

export function IOSSkeleton({ className }: IOSSkeletonProps) {
  return (
    <div className={cn("relative overflow-hidden rounded-lg bg-muted", className)}>
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-foreground/5 to-transparent" />
    </div>
  );
}

export function IOSListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="ios-grouped-list">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="ios-list-item">
          <div className="flex items-center gap-3 flex-1">
            <IOSSkeleton className="w-10 h-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <IOSSkeleton className="h-4 w-3/4" />
              <IOSSkeleton className="h-3 w-1/2" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
