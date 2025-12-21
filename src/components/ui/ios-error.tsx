import { AlertCircle, RefreshCw, WifiOff } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface IOSErrorProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
  variant?: "default" | "network" | "auth" | "notfound";
}

const errorConfig = {
  default: {
    icon: AlertCircle,
    title: "Algo deu errado",
    message: "Ocorreu um erro inesperado. Por favor, tente novamente.",
  },
  network: {
    icon: WifiOff,
    title: "Sem conexão",
    message: "Verifique sua conexão com a internet e tente novamente.",
  },
  auth: {
    icon: AlertCircle,
    title: "Não autorizado",
    message: "Sua sessão expirou. Por favor, faça login novamente.",
  },
  notfound: {
    icon: AlertCircle,
    title: "Não encontrado",
    message: "O recurso que você está procurando não foi encontrado.",
  },
};

export function IOSError({
  title,
  message,
  onRetry,
  className,
  variant = "default",
}: IOSErrorProps) {
  const config = errorConfig[variant];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center",
        className
      )}
    >
      <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-destructive" />
      </div>
      <h3 className="text-ios-headline text-foreground mb-2">
        {title || config.title}
      </h3>
      <p className="text-ios-subheadline text-muted-foreground max-w-sm mb-6">
        {message || config.message}
      </p>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          className="ios-button gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Tentar novamente
        </Button>
      )}
    </div>
  );
}

export function IOSEmptyState({
  icon: Icon,
  title,
  message,
  action,
}: {
  icon: React.ElementType;
  title: string;
  message: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-ios-headline text-foreground mb-2">{title}</h3>
      <p className="text-ios-subheadline text-muted-foreground max-w-sm mb-6">
        {message}
      </p>
      {action}
    </div>
  );
}
