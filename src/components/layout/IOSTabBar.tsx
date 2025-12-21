import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Scissors,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { icon: LayoutDashboard, label: "Início", href: "/dashboard" },
  { icon: Calendar, label: "Agenda", href: "/appointments" },
  { icon: Users, label: "Clientes", href: "/clients" },
  { icon: Scissors, label: "Serviços", href: "/services" },
  { icon: Settings, label: "Ajustes", href: "/settings" },
];

export function IOSTabBar() {
  const location = useLocation();

  return (
    <nav className="ios-tab-bar">
      <div className="flex items-center justify-around h-[50px] px-2">
        {tabs.map((tab) => {
          const isActive = location.pathname.startsWith(tab.href);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              to={tab.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 py-1 ios-press",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className="w-6 h-6" strokeWidth={isActive ? 2 : 1.5} />
              <span className="text-ios-caption2 mt-0.5">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
