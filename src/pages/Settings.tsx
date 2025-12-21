import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { IOSNavBar } from "@/components/layout/IOSNavBar";
import { IOSListSection, IOSListItem } from "@/components/layout/IOSListSection";
import {
  Building2,
  User,
  Clock,
  Bell,
  Moon,
  Sun,
  Monitor,
  LogOut,
  ChevronRight,
  Palette,
  MessageCircle,
  Shield,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";

export default function Settings() {
  const { tenant, logout } = useAuth();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="animate-ios-fade-in">
      <IOSNavBar title="Ajustes" largeTitle />

      {/* Business Profile */}
      <IOSListSection header="Negócio">
        <IOSListItem
          icon={<Building2 className="w-4 h-4" />}
          title={tenant?.business_name || "Meu Negócio"}
          subtitle={tenant?.slug ? `ritmo.app/${tenant.slug}` : undefined}
          onClick={() => navigate("/settings/profile")}
        />
      </IOSListSection>

      {/* Configuration */}
      <IOSListSection header="Configurações">
        <IOSListItem
          icon={<User className="w-4 h-4" />}
          title="Profissionais"
          onClick={() => navigate("/staff")}
        />
        <IOSListItem
          icon={<Clock className="w-4 h-4" />}
          title="Horários de funcionamento"
          onClick={() => navigate("/settings/working-hours")}
        />
        <IOSListItem
          icon={<Shield className="w-4 h-4" />}
          title="Políticas de agendamento"
          onClick={() => navigate("/settings/policies")}
        />
        <IOSListItem
          icon={<Bell className="w-4 h-4" />}
          title="Notificações"
          onClick={() => navigate("/settings/notifications")}
        />
      </IOSListSection>

      {/* Appearance */}
      <IOSListSection header="Aparência">
        <IOSListItem
          icon={resolvedTheme === "dark" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          title="Tema"
          showArrow={false}
          rightContent={
            <div className="flex gap-1">
              <button
                onClick={() => setTheme("light")}
                className={`p-2 rounded-lg ${theme === "light" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}
              >
                <Sun className="w-4 h-4" />
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`p-2 rounded-lg ${theme === "dark" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}
              >
                <Moon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setTheme("system")}
                className={`p-2 rounded-lg ${theme === "system" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}
              >
                <Monitor className="w-4 h-4" />
              </button>
            </div>
          }
        />
      </IOSListSection>

      {/* Integrations */}
      <IOSListSection header="Integrações">
        <IOSListItem
          icon={<MessageCircle className="w-4 h-4" />}
          title="WhatsApp"
          onClick={() => navigate("/settings/whatsapp")}
        />
      </IOSListSection>

      {/* Account */}
      <IOSListSection>
        <IOSListItem
          icon={<LogOut className="w-4 h-4" />}
          title="Sair"
          destructive
          showArrow={false}
          onClick={handleLogout}
        />
      </IOSListSection>

      <div className="px-4 py-6 text-center">
        <p className="text-ios-footnote text-muted-foreground">Ritmo v1.0.0</p>
      </div>
    </div>
  );
}
