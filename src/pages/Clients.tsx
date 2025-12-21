import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { IOSNavBar } from "@/components/layout/IOSNavBar";
import { IOSListSection, IOSListItem } from "@/components/layout/IOSListSection";
import { IOSListSkeleton } from "@/components/ui/ios-loading";
import { IOSError, IOSEmptyState } from "@/components/ui/ios-error";
import { clientsApi, Client, ClientCreate } from "@/lib/api";
import { Users, Plus, Phone, Mail } from "lucide-react";
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
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Clients() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: clients, isLoading, error, refetch } = useQuery({
    queryKey: ["clients"],
    queryFn: clientsApi.list,
  });

  const createMutation = useMutation({
    mutationFn: (data: ClientCreate) => clientsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      setIsOpen(false);
      toast({ title: "Cliente adicionado!" });
    },
    onError: () => {
      toast({ variant: "destructive", title: "Erro ao adicionar cliente" });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: ClientCreate = {
      name: formData.get("name") as string,
      phone: (formData.get("phone") as string) || undefined,
      email: (formData.get("email") as string) || undefined,
    };
    createMutation.mutate(data);
  };

  const filteredClients = clients?.filter((client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.phone?.includes(searchQuery) ||
    client.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (error) {
    return (
      <>
        <IOSNavBar title="Clientes" largeTitle />
        <IOSError variant="network" onRetry={() => refetch()} />
      </>
    );
  }

  return (
    <div className="animate-ios-fade-in">
      <IOSNavBar
        title="Clientes"
        largeTitle
        rightAction={
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-primary">
                <Plus className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="ios-sheet h-[60vh]">
              <SheetHeader className="pb-4">
                <SheetTitle className="text-ios-title2">Novo Cliente</SheetTitle>
              </SheetHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-ios-subheadline">Nome</Label>
                  <Input
                    name="name"
                    placeholder="Nome do cliente"
                    className="ios-input"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-ios-subheadline">Telefone</Label>
                  <Input
                    name="phone"
                    type="tel"
                    placeholder="+55 11 99999-9999"
                    className="ios-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-ios-subheadline">Email</Label>
                  <Input
                    name="email"
                    type="email"
                    placeholder="email@exemplo.com"
                    className="ios-input"
                  />
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

      {/* Search */}
      <div className="px-4 mb-4">
        <Input
          placeholder="Buscar clientes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="ios-input"
        />
      </div>

      {isLoading ? (
        <div className="px-4">
          <IOSListSkeleton count={5} />
        </div>
      ) : filteredClients?.length === 0 && searchQuery ? (
        <IOSEmptyState
          icon={Users}
          title="Nenhum resultado"
          message={`Nenhum cliente encontrado para "${searchQuery}"`}
        />
      ) : clients?.length === 0 ? (
        <IOSEmptyState
          icon={Users}
          title="Nenhum cliente"
          message="Seus clientes aparecerão aqui."
          action={
            <Button onClick={() => setIsOpen(true)} className="ios-button-primary">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar cliente
            </Button>
          }
        />
      ) : (
        <IOSListSection>
          {filteredClients?.map((client) => (
            <ClientItem key={client.id} client={client} />
          ))}
        </IOSListSection>
      )}
    </div>
  );
}

function ClientItem({ client }: { client: Client }) {
  const subtitle = client.phone || client.email || `Desde ${format(new Date(client.created_at), "MMM yyyy", { locale: ptBR })}`;

  return (
    <IOSListItem
      icon={<Users className="w-4 h-4" />}
      title={client.name}
      subtitle={subtitle}
      rightContent={
        <div className="flex items-center gap-2">
          {client.phone && (
            <a
              href={`tel:${client.phone}`}
              className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Phone className="w-4 h-4 text-success" />
            </a>
          )}
          {client.email && (
            <a
              href={`mailto:${client.email}`}
              className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Mail className="w-4 h-4 text-primary" />
            </a>
          )}
        </div>
      }
      showArrow={false}
    />
  );
}
