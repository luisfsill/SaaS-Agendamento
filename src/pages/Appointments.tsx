import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, addDays, startOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";
import { IOSNavBar } from "@/components/layout/IOSNavBar";
import { IOSListSkeleton } from "@/components/ui/ios-loading";
import { IOSError, IOSEmptyState } from "@/components/ui/ios-error";
import { dashboardApi, staffApi, Appointment } from "@/lib/api";
import { Calendar, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function Appointments() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedStaff, setSelectedStaff] = useState<string | undefined>();

  const dateStr = format(selectedDate, "yyyy-MM-dd");

  const { data: appointments, isLoading, error, refetch } = useQuery({
    queryKey: ["appointments", dateStr, selectedStaff],
    queryFn: () => dashboardApi.day(dateStr, selectedStaff),
  });

  const { data: staff } = useQuery({
    queryKey: ["staff"],
    queryFn: staffApi.list,
  });

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const goToNextWeek = () => setSelectedDate(addDays(selectedDate, 7));
  const goToPrevWeek = () => setSelectedDate(addDays(selectedDate, -7));

  if (error) {
    return (
      <>
        <IOSNavBar title="Agenda" largeTitle />
        <IOSError variant="network" onRetry={() => refetch()} />
      </>
    );
  }

  return (
    <div className="animate-ios-fade-in">
      <IOSNavBar
        title="Agenda"
        largeTitle
        rightAction={
          <Link to="/appointments/new">
            <Button variant="ghost" size="icon" className="text-primary">
              <Plus className="w-6 h-6" />
            </Button>
          </Link>
        }
      />

      {/* Week Navigation */}
      <div className="px-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="icon" onClick={goToPrevWeek}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <span className="text-ios-headline text-foreground">
            {format(weekStart, "MMMM yyyy", { locale: ptBR })}
          </span>
          <Button variant="ghost" size="icon" onClick={goToNextWeek}>
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Week Days */}
        <div className="flex justify-between gap-1">
          {weekDays.map((day) => {
            const isSelected = format(day, "yyyy-MM-dd") === dateStr;
            const isToday = format(day, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");

            return (
              <button
                key={day.toISOString()}
                onClick={() => setSelectedDate(day)}
                className={cn(
                  "flex-1 py-2 rounded-xl text-center transition-all ios-press",
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : isToday
                    ? "bg-primary/10"
                    : "bg-card"
                )}
              >
                <p
                  className={cn(
                    "text-ios-caption2 uppercase",
                    isSelected ? "text-primary-foreground" : "text-muted-foreground"
                  )}
                >
                  {format(day, "EEE", { locale: ptBR })}
                </p>
                <p
                  className={cn(
                    "text-ios-headline",
                    isSelected ? "text-primary-foreground" : "text-foreground"
                  )}
                >
                  {format(day, "d")}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Staff Filter */}
      {staff && staff.length > 1 && (
        <div className="px-4 mb-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedStaff(undefined)}
              className={cn(
                "px-4 py-2 rounded-full text-ios-subheadline whitespace-nowrap ios-press",
                !selectedStaff
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              )}
            >
              Todos
            </button>
            {staff.map((member) => (
              <button
                key={member.id}
                onClick={() => setSelectedStaff(member.id)}
                className={cn(
                  "px-4 py-2 rounded-full text-ios-subheadline whitespace-nowrap ios-press",
                  selectedStaff === member.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                )}
              >
                {member.display_name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Appointments List */}
      <div className="px-4">
        {isLoading ? (
          <IOSListSkeleton count={4} />
        ) : (appointments as Appointment[])?.length === 0 ? (
          <IOSEmptyState
            icon={Calendar}
            title="Nenhum agendamento"
            message={`Não há agendamentos para ${format(selectedDate, "d 'de' MMMM", { locale: ptBR })}.`}
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
          <div className="space-y-3">
            {(appointments as Appointment[])?.map((apt) => (
              <Link
                key={apt.id}
                to={`/appointments/${apt.id}`}
                className="ios-card flex items-center gap-4 ios-press"
              >
                <div className="text-center">
                  <p className="text-ios-title2 text-primary">
                    {format(new Date(apt.start_at), "HH:mm")}
                  </p>
                  <p className="text-ios-caption2 text-muted-foreground">
                    {format(new Date(apt.end_at), "HH:mm")}
                  </p>
                </div>
                <div className="flex-1 min-w-0 border-l border-border pl-4">
                  <p className="text-ios-body text-foreground truncate">
                    {apt.service?.name || "Serviço"}
                  </p>
                  <p className="text-ios-footnote text-muted-foreground truncate">
                    {apt.client?.name || "Cliente"} • {apt.staff?.display_name || "Profissional"}
                  </p>
                </div>
                <span
                  className={cn(
                    "ios-badge",
                    apt.status === "confirmed"
                      ? "ios-badge-success"
                      : apt.status === "cancelled"
                      ? "ios-badge-destructive"
                      : "ios-badge-primary"
                  )}
                >
                  {apt.status === "scheduled"
                    ? "Agendado"
                    : apt.status === "confirmed"
                    ? "Confirmado"
                    : apt.status === "completed"
                    ? "Concluído"
                    : apt.status === "cancelled"
                    ? "Cancelado"
                    : apt.status}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
