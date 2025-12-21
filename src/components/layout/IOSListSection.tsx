import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

interface IOSListSectionProps {
  header?: string;
  footer?: string;
  children: React.ReactNode;
  className?: string;
}

export function IOSListSection({
  header,
  footer,
  children,
  className,
}: IOSListSectionProps) {
  return (
    <div className={cn("mb-6", className)}>
      {header && <div className="ios-section-header">{header}</div>}
      <div className="ios-grouped-list mx-4">{children}</div>
      {footer && (
        <p className="text-ios-footnote text-muted-foreground px-4 mt-2">
          {footer}
        </p>
      )}
    </div>
  );
}

interface IOSListItemProps {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  value?: string;
  showArrow?: boolean;
  onClick?: () => void;
  destructive?: boolean;
  className?: string;
  rightContent?: React.ReactNode;
}

export function IOSListItem({
  icon,
  title,
  subtitle,
  value,
  showArrow = true,
  onClick,
  destructive = false,
  className,
  rightContent,
}: IOSListItemProps) {
  const Component = onClick ? "button" : "div";

  return (
    <Component
      onClick={onClick}
      className={cn(
        "ios-list-item w-full text-left",
        onClick && "cursor-pointer",
        className
      )}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {icon && (
          <div
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center",
              destructive ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
            )}
          >
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p
            className={cn(
              "text-ios-body truncate",
              destructive ? "text-destructive" : "text-foreground"
            )}
          >
            {title}
          </p>
          {subtitle && (
            <p className="text-ios-footnote text-muted-foreground truncate">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {value && (
          <span className="text-ios-body text-muted-foreground">{value}</span>
        )}
        {rightContent}
        {onClick && showArrow && (
          <ChevronRight className="w-5 h-5 text-muted-foreground/50" />
        )}
      </div>
    </Component>
  );
}
