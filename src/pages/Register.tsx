import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IOSLoading } from "@/components/ui/ios-loading";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "lucide-react";
import { ApiError } from "@/lib/api";

export default function Register() {
  const [businessName, setBusinessName] = useState("");
  const [slug, setSlug] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleBusinessNameChange = (value: string) => {
    setBusinessName(value);
    if (!slug || slug === generateSlug(businessName)) {
      setSlug(generateSlug(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await register({
        email,
        password,
        business_name: businessName,
        slug,
      });
      toast({
        title: "Conta criada!",
        description: "Bem-vindo ao Ritmo.",
      });
      navigate("/dashboard");
    } catch (error) {
      const apiError = error as ApiError;
      toast({
        variant: "destructive",
        title: "Erro ao criar conta",
        description: apiError.message || "Erro de conexão. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 py-12 bg-background">
      <div className="mx-auto w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mb-4 shadow-lg">
            <Calendar className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-ios-title1 text-foreground">Criar Conta</h1>
          <p className="text-ios-subheadline text-muted-foreground mt-1">
            Configure seu negócio no Ritmo
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="businessName" className="text-ios-subheadline">
              Nome do negócio
            </Label>
            <Input
              id="businessName"
              type="text"
              value={businessName}
              onChange={(e) => handleBusinessNameChange(e.target.value)}
              placeholder="Ex: Barbearia do João"
              className="ios-input"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug" className="text-ios-subheadline">
              Link de agendamento
            </Label>
            <div className="flex items-center gap-2">
              <span className="text-ios-footnote text-muted-foreground">
                ritmo.app/
              </span>
              <Input
                id="slug"
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                placeholder="meu-negocio"
                className="ios-input flex-1"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-ios-subheadline">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="ios-input"
              required
              autoComplete="email"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-ios-subheadline">
              Senha
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 8 caracteres"
              className="ios-input"
              required
              minLength={8}
              autoComplete="new-password"
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            className="w-full ios-button-primary h-12 text-ios-headline"
            disabled={isLoading}
          >
            {isLoading ? <IOSLoading size="sm" /> : "Criar conta"}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-ios-subheadline text-muted-foreground">
            Já tem uma conta?{" "}
            <Link to="/login" className="text-primary font-medium">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
