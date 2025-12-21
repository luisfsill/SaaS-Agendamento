import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { IOSNavBar } from "@/components/layout/IOSNavBar";
import { IOSListSection, IOSListItem } from "@/components/layout/IOSListSection";
import { IOSListSkeleton } from "@/components/ui/ios-loading";
import { IOSError, IOSEmptyState } from "@/components/ui/ios-error";
import { servicesApi, Service, ServiceCreate } from "@/lib/api";
import { Scissors, Plus, Clock, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function Services() {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: services, isLoading, error, refetch } = useQuery({
    queryKey: ["services"],
    queryFn: servicesApi.list,
  });

  const createMutation = useMutation({
    mutationFn: (data: ServiceCreate) => servicesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      setIsOpen(false);
      toast({ title: "Serviço criado com sucesso!" });
    },
    onError: () => {
      toast({ variant: "destructive", title: "Erro ao criar serviço" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => servicesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast({ title: "Serviço removido" });
    },
    onError: () => {
      toast({ variant: "destructive", title: "Erro ao remover serviço" });
    },
  });

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(cents / 100);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: ServiceCreate = {
      name: formData.get("name") as string,
      description: formData.get("description") as string || undefined,
      duration_minutes: parseInt(formData.get("duration") as string),
      price_cents: Math.round(parseFloat(formData.get("price") as string) * 100),
    };
    createMutation.mutate(data);
  };

  if (error) {
    return (
      <>
        <IOSNavBar title="Serviços" largeTitle />
        <IOSError variant="network" onRetry={() => refetch()} />
      </>
    );
  }

  const activeServices = services?.filter((s) => s.is_active) || [];
  const inactiveServices = services?.filter((s) => !s.is_active) || [];

  return (
    <div className="animate-ios-fade-in">
      <IOSNavBar
        title="Serviços"
        largeTitle
        rightAction={
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-primary">
                <Plus className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="ios-sheet h-[70vh]">
              <SheetHeader className="pb-4">
                <SheetTitle className="text-ios-title2">Novo Serviço</SheetTitle>
              </SheetHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-ios-subheadline">Nome</Label>
                  <Input
                    name="name"
                    placeholder="Ex: Corte masculino"
                    className="ios-input"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-ios-subheadline">Descrição</Label>
                  <Input
                    name="description"
                    placeholder="Descrição opcional"
                    className="ios-input"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-ios-subheadline">Duração (min)</Label>
                    <Input
                      name="duration"
                      type="number"
                      min="5"
                      max="480"
                      placeholder="30"
                      className="ios-input"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-ios-subheadline">Preço (R$)</Label>
                    <Input
                      name="price"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="50,00"
                      className="ios-input"
                      required
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full ios-button-primary h-12"
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? "Salvando..." : "Salvar"}
                </Button>
              </form>
            </SheetContent>
          </Sheet>
        }
      />

      {isLoading ? (
        <div className="px-4">
          <IOSListSkeleton count={4} />
        </div>
      ) : services?.length === 0 ? (
        <IOSEmptyState
          icon={Scissors}
          title="Nenhum serviço"
          message="Adicione seus serviços para começar a receber agendamentos."
          action={
            <Button onClick={() => setIsOpen(true)} className="ios-button-primary">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar serviço
            </Button>
          }
        />
      ) : (
        <>
          {activeServices.length > 0 && (
            <IOSListSection header="Ativos">
              {activeServices.map((service) => (
                <ServiceItem
                  key={service.id}
                  service={service}
                  onDelete={() => deleteMutation.mutate(service.id)}
                  formatCurrency={formatCurrency}
                />
              ))}
            </IOSListSection>
          )}

          {inactiveServices.length > 0 && (
            <IOSListSection header="Inativos">
              {inactiveServices.map((service) => (
                <ServiceItem
                  key={service.id}
                  service={service}
                  onDelete={() => deleteMutation.mutate(service.id)}
                  formatCurrency={formatCurrency}
                />
              ))}
            </IOSListSection>
          )}
        </>
      )}
    </div>
  );
}

function ServiceItem({
  service,
  formatCurrency,
}: {
  service: Service;
  onDelete: () => void;
  formatCurrency: (cents: number) => string;
}) {
  return (
    <IOSListItem
      icon={<Scissors className="w-4 h-4" />}
      title={service.name}
      subtitle={`${service.duration_minutes}min • ${formatCurrency(service.price_cents)}`}
      showArrow={false}
    />
  );
}