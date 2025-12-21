import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { IOSNavBar } from "@/components/layout/IOSNavBar";
import { IOSLoading, IOSListSkeleton } from "@/components/ui/ios-loading";
import { IOSError, IOSEmptyState } from "@/components/ui/ios-error";
import { dashboardApi, servicesApi, staffApi, clientsApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import {
  Calendar,
  Users,
  Scissors,
  Clock,
  TrendingUp,
  Plus,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { tenant } = useAuth();
  const today = format(new Date(), "yyyy-MM-dd");

  const { data: todayAppointments, isLoading: loadingToday, error: errorToday } = useQuery({
    queryKey: ["dashboard", "day", today],
    queryFn: () => dashboardApi.day(today),
  });

  const { data: summary, isLoading: loadingSummary } = useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: () => dashboardApi.summary(7),
  });

  const { data: services } = useQuery({
    queryKey: ["services"],
    queryFn: servicesApi.list,
  });

  const { data: staff } = useQuery({
    queryKey: ["staff"],
    queryFn: staffApi.list,
  });

  const { data: clients } = useQuery({
    queryKey: ["clients"],
    queryFn: clientsApi.list,
  });

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(cents / 100);
  };

  const isLoading = loadingToday || loadingSummary;

  if (errorToday) {
    return (
      <>
        <IOSNavBar title="Início" largeTitle />
        <IOSError variant="network" onRetry={() => window.location.reload()} />
      </>
    );
  }

  return (
    <div className="animate-ios-fade-in">
      <IOSNavBar
        title={tenant?.business_name || "Ritmo"}
        largeTitle
        rightAction={
          <Link to="/appointments/new">
            <Button variant="ghost" size="icon" className="text-primary">
              <Plus className="w-6 h-6" />
            </Button>
          </Link>
        }
      />

      <div className="px-4 space-y-6">
        {/* Today's greeting */}
        <div className="text-center py-4">
          <p className="text-ios-subheadline text-muted-foreground">
            {format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Link to="/appointments" className="ios-card ios-press">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-ios-title2 text-foreground">
                  {isLoading ? (
                    <IOSLoading size="sm" />
                  ) : (
                    (todayAppointments as unknown[])?.length || 0
                  )}
                </p>
                <p className="text-ios-caption1 text-muted-foreground">
                  Hoje
                </p>
              </div>
            </div>
          </Link>

          <Link to="/clients" className="ios-card ios-press">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-ios-title2 text-foreground">
                  {clients?.length || 0}
                </p>
                <p className="text-ios-caption1 text-muted-foreground">
                  Clientes
                </p>
              </div>
            </div>
          </Link>

          <Link to="/services" className="ios-card ios-press">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                <Scissors className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-ios-title2 text-foreground">
                  {services?.length || 0}
                </p>
                <p className="text-ios-caption1 text-muted-foreground">
                  Serviços
                </p>
              </div>
            </div>
          </Link>

          <Link to="/staff" className="ios-card ios-press">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-info/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-info" />
              </div>
              <div>
                <p className="text-ios-title2 text-foreground">
                  {staff?.length || 0}
                </p>
                <p className="text-ios-caption1 text-muted-foreground">
                  Profissionais
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Weekly Summary */}
        {summary && (
          <div className="ios-card">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="text-ios-headline text-foreground">
                Últimos 7 dias
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-ios-caption1 text-muted-foreground">
                  Agendamentos
                </p>
                <p className="text-ios-title3 text-foreground">
                  {(summary as { total_appointments?: number })?.total_appointments || 0}
                </p>
              </div>
              <div>
                <p className="text-ios-caption1 text-muted-foreground">
                  Receita
                </p>
                <p className="text-ios-title3 text-foreground">
                  {formatCurrency((summary as { total_revenue_cents?: number })?.total_revenue_cents || 0)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Today's Appointments */}
        <div>
          <h2 className="text-ios-headline text-foreground mb-3 px-1">
            Agenda de hoje
          </h2>
          {isLoading ? (
            <IOSListSkeleton count={3} />
          ) : (todayAppointments as unknown[])?.length === 0 ? (
            <IOSEmptyState
              icon={Calendar}
              title="Nenhum agendamento"
              message="Você não tem agendamentos para hoje."
              action={
                <Link to="/appointments/new">
                  <Button className="ios-button-primary">
                    <Plus className="w-4 h-4 mr-2" />
                    Novo agendamento
                  </Button>
                </Link>
              }
            />
          ) : (
            <div className="ios-grouped-list">
              {(todayAppointments as { id: string; start_at: string; service?: { name: string }; client?: { name: string }; status: string }[])?.slice(0, 5).map((apt) => (
                <Link
                  key={apt.id}
                  to={`/appointments/${apt.id}`}
                  className="ios-list-item ios-press"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-12 text-center">
                      <p className="text-ios-headline text-primary">
                        {format(new Date(apt.start_at), "HH:mm")}
                      </p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-ios-body text-foreground truncate">
                        {apt.service?.name || "Serviço"}
                      </p>
                      <p className="text-ios-footnote text-muted-foreground truncate">
                        {apt.client?.name || "Cliente"}
                      </p>
                    </div>
                    <div className="ios-badge-primary">
                      {apt.status === "scheduled"
                        ? "Agendado"
                        : apt.status === "confirmed"
                        ? "Confirmado"
                        : apt.status}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
