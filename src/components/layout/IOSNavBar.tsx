import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface IOSNavBarProps {
  title: string;
  largeTitle?: boolean;
  showBack?: boolean;
  backHref?: string;
  rightAction?: React.ReactNode;
  className?: string;
}

export function IOSNavBar({
  title,
  largeTitle = false,
  showBack = false,
  backHref,
  rightAction,
  className,
}: IOSNavBarProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backHref) {
      navigate(backHref);
    } else {
      navigate(-1);
    }
  };

  return (
    <header className={cn("ios-nav-bar safe-top", className)}>
      <div className="flex items-center justify-between h-11 px-4">
        <div className="flex items-center min-w-[60px]">
          {showBack && (
            <button
              onClick={handleBack}
              className="flex items-center text-primary ios-press -ml-2 px-2 py-1"
            >
              <ChevronLeft className="w-6 h-6" />
              <span className="text-ios-body">Voltar</span>
            </button>
          )}
        </div>

        {!largeTitle && (
          <h1 className="text-ios-headline font-semibold text-foreground absolute left-1/2 -translate-x-1/2">
            {title}
          </h1>
        )}

        <div className="flex items-center min-w-[60px] justify-end">
          {rightAction}
        </div>
      </div>

      {largeTitle && (
        <div className="px-4 pb-2">
          <h1 className="ios-large-title text-foreground">{title}</h1>
        </div>
      )}
    </header>
  );
}
