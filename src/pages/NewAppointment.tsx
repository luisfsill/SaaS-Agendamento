import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { format, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { IOSNavBar } from "@/components/layout/IOSNavBar";
import { IOSListSection, IOSListItem } from "@/components/layout/IOSListSection";
import { IOSLoading } from "@/components/ui/ios-loading";
import {
  servicesApi,
  staffApi,
  clientsApi,
  availabilityApi,
  appointmentsApi,
  Service,
  Staff,
  Client,
  AvailabilitySlot,
} from "@/lib/api";
import { Calendar, User, Scissors, Clock, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type Step = "service" | "staff" | "client" | "datetime" | "confirm";

export default function NewAppointment() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState<Step>("service");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null);

  const { data: services, isLoading: loadingServices } = useQuery({
    queryKey: ["services"],
    queryFn: servicesApi.list,
  });

  const { data: staff, isLoading: loadingStaff } = useQuery({
    queryKey: ["staff"],
    queryFn: staffApi.list,
    enabled: step === "staff" || step === "datetime",
  });

  const { data: clients, isLoading: loadingClients } = useQuery({
    queryKey: ["clients"],
    queryFn: clientsApi.list,
    enabled: step === "client",
  });

  const dateStr = format(selectedDate, "yyyy-MM-dd");
  const { data: availability, isLoading: loadingAvailability } = useQuery({
    queryKey: ["availability", selectedService?.id, dateStr, selectedStaff?.id],
    queryFn: () =>
      availabilityApi.check(selectedService!.id, dateStr, selectedStaff?.id),
    enabled: step === "datetime" && !!selectedService,
  });

  const createMutation = useMutation({
    mutationFn: () =>
      appointmentsApi.create({
        service_id: selectedService!.id,
        staff_id: selectedSlot!.staff_id || selectedStaff!.id,
        client_id: selectedClient!.id,
        start_at: selectedSlot!.start,
      }),
    onSuccess: () => {
      toast({ title: "Agendamento criado com sucesso!" });
      navigate("/appointments");
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Erro ao criar agendamento",
        description: "O horário pode não estar mais disponível.",
      });
    },
  });

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(cents / 100);
  };

  const getStepTitle = () => {
    switch (step) {
      case "service":
        return "Escolha o serviço";
      case "staff":
        return "Escolha o profissional";
      case "client":
        return "Escolha o cliente";
      case "datetime":
        return "Escolha o horário";
      case "confirm":
        return "Confirmar";
    }
  };

  const goBack = () => {
    switch (step) {
      case "staff":
        setStep("service");
        break;
      case "client":
        setStep("staff");
        break;
      case "datetime":
        setStep("client");
        break;
      case "confirm":
        setStep("datetime");
        break;
    }
  };

  return (
    <div className="animate-ios-fade-in">
      <IOSNavBar
        title={getStepTitle()}
        showBack={step !== "service"}
        backHref="#"
        rightAction={
          step === "service" ? (
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="text-primary"
            >
              Cancelar
            </Button>
          ) : undefined
        }
      />

      {step === "service" && (
        <IOSListSection header="Serviços disponíveis">
          {loadingServices ? (
            <IOSLoading className="py-8" />
          ) : (
            services
              ?.filter((s) => s.is_active)
              .map((service) => (
                <IOSListItem
                  key={service.id}
                  icon={<Scissors className="w-4 h-4" />}
                  title={service.name}
                  subtitle={`${service.duration_minutes}min • ${formatCurrency(service.price_cents)}`}
                  onClick={() => {
                    setSelectedService(service);
                    setStep("staff");
                  }}
                />
              ))
          )}
        </IOSListSection>
      )}

      {step === "staff" && (
        <IOSListSection header="Profissionais">
          {loadingStaff ? (
            <IOSLoading className="py-8" />
          ) : (
            <>
              <IOSListItem
                icon={<User className="w-4 h-4" />}
                title="Qualquer profissional"
                subtitle="Selecionar o primeiro disponível"
                onClick={() => {
                  setSelectedStaff(null);
                  setStep("client");
                }}
              />
              {staff
                ?.filter((s) => s.is_active)
                .map((member) => (
                  <IOSListItem
                    key={member.id}
                    icon={<User className="w-4 h-4" />}
                    title={member.display_name}
                    onClick={() => {
                      setSelectedStaff(member);
                      setStep("client");
                    }}
                  />
                ))}
            </>
          )}
        </IOSListSection>
      )}

      {step === "client" && (
        <IOSListSection header="Clientes">
          {loadingClients ? (
            <IOSLoading className="py-8" />
          ) : (
            clients?.map((client) => (
              <IOSListItem
                key={client.id}
                icon={<User className="w-4 h-4" />}
                title={client.name}
                subtitle={client.phone || client.email}
                onClick={() => {
                  setSelectedClient(client);
                  setStep("datetime");
                }}
              />
            ))
          )}
        </IOSListSection>
      )}

      {step === "datetime" && (
        <>
          {/* Date Navigation */}
          <div className="px-4 mb-4">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedDate(addDays(selectedDate, -1))}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <span className="text-ios-headline text-foreground">
                {format(selectedDate, "EEEE, d 'de' MMMM", { locale: ptBR })}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedDate(addDays(selectedDate, 1))}
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Time Slots */}
          <div className="px-4">
            {loadingAvailability ? (
              <IOSLoading className="py-8" />
            ) : availability?.slots.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum horário disponível nesta data.
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {availability?.slots.map((slot, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedSlot(slot);
                      setStep("confirm");
                    }}
                    className={cn(
                      "py-3 rounded-xl text-ios-body ios-press",
                      "bg-card border border-border",
                      "hover:bg-primary hover:text-primary-foreground hover:border-primary"
                    )}
                  >
                    {format(new Date(slot.start), "HH:mm")}
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {step === "confirm" && (
        <div className="px-4 space-y-4">
          <div className="ios-card space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Scissors className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-ios-footnote text-muted-foreground">Serviço</p>
                <p className="text-ios-body text-foreground">{selectedService?.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                <User className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-ios-footnote text-muted-foreground">Cliente</p>
                <p className="text-ios-body text-foreground">{selectedClient?.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-info/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-info" />
              </div>
              <div>
                <p className="text-ios-footnote text-muted-foreground">Data e hora</p>
                <p className="text-ios-body text-foreground">
                  {format(new Date(selectedSlot!.start), "EEEE, d 'de' MMMM 'às' HH:mm", {
                    locale: ptBR,
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-ios-footnote text-muted-foreground">Duração</p>
                <p className="text-ios-body text-foreground">
                  {selectedService?.duration_minutes} minutos
                </p>
              </div>
            </div>
          </div>

          <div className="ios-card flex items-center justify-between">
            <span className="text-ios-headline text-foreground">Total</span>
            <span className="text-ios-title2 text-primary">
              {formatCurrency(selectedService?.price_cents || 0)}
            </span>
          </div>

          <Button
            onClick={() => createMutation.mutate()}
            disabled={createMutation.isPending}
            className="w-full ios-button-primary h-14 text-ios-headline gap-2"
          >
            {createMutation.isPending ? (
              <IOSLoading size="sm" />
            ) : (
              <>
                <Check className="w-5 h-5" />
                Confirmar agendamento
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
