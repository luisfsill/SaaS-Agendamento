import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { IOSNavBar } from "@/components/layout/IOSNavBar";
import { IOSListSection, IOSListItem } from "@/components/layout/IOSListSection";
import { IOSListSkeleton } from "@/components/ui/ios-loading";
import { IOSError, IOSEmptyState } from "@/components/ui/ios-error";
import { staffApi, Staff, StaffCreate } from "@/lib/api";
import { User, Plus } from "lucide-react";
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

export default function StaffPage() {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: staff, isLoading, error, refetch } = useQuery({
    queryKey: ["staff"],
    queryFn: staffApi.list,
  });

  const createMutation = useMutation({
    mutationFn: (data: StaffCreate) => staffApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      setIsOpen(false);
      toast({ title: "Profissional adicionado!" });
    },
    onError: () => {
      toast({ variant: "destructive", title: "Erro ao adicionar profissional" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => staffApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      toast({ title: "Profissional removido" });
    },
    onError: () => {
      toast({ variant: "destructive", title: "Erro ao remover profissional" });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: StaffCreate = {
      display_name: formData.get("name") as string,
    };
    createMutation.mutate(data);
  };

  if (error) {
    return (
      <>
        <IOSNavBar title="Profissionais" largeTitle />
        <IOSError variant="network" onRetry={() => refetch()} />
      </>
    );
  }

  const activeStaff = staff?.filter((s) => s.is_active) || [];
  const inactiveStaff = staff?.filter((s) => !s.is_active) || [];

  return (
    <div className="animate-ios-fade-in">
      <IOSNavBar
        title="Profissionais"
        largeTitle
        rightAction={
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-primary">
                <Plus className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="ios-sheet h-[40vh]">
              <SheetHeader className="pb-4">
                <SheetTitle className="text-ios-title2">
                  Novo Profissional
                </SheetTitle>
              </SheetHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-ios-subheadline">Nome</Label>
                  <Input
                    name="name"
                    placeholder="Ex: João Silva"
                    className="ios-input"
                    required
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

      {isLoading ? (
        <div className="px-4">
          <IOSListSkeleton count={3} />
        </div>
      ) : staff?.length === 0 ? (
        <IOSEmptyState
          icon={User}
          title="Nenhum profissional"
          message="Adicione os profissionais que realizam os serviços."
          action={
            <Button onClick={() => setIsOpen(true)} className="ios-button-primary">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar profissional
            </Button>
          }
        />
      ) : (
        <>
          {activeStaff.length > 0 && (
            <IOSListSection header="Ativos">
              {activeStaff.map((member) => (
                <StaffItem key={member.id} staff={member} />
              ))}
            </IOSListSection>
          )}

          {inactiveStaff.length > 0 && (
            <IOSListSection header="Inativos">
              {inactiveStaff.map((member) => (
                <StaffItem key={member.id} staff={member} />
              ))}
            </IOSListSection>
          )}
        </>
      )}
    </div>
  );
}

function StaffItem({ staff }: { staff: Staff }) {
  return (
    <IOSListItem
      icon={<User className="w-4 h-4" />}
      title={staff.display_name}
      subtitle={staff.is_active ? "Ativo" : "Inativo"}
      showArrow
    />
  );
}
