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

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login({ email, password });
      navigate("/dashboard");
    } catch (error) {
      const apiError = error as ApiError;
      toast({
        variant: "destructive",
        title: "Erro ao entrar",
        description:
          apiError.status === 401
            ? "Email ou senha incorretos"
            : apiError.message || "Erro de conexão. Tente novamente.",
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
          <h1 className="text-ios-title1 text-foreground">Ritmo</h1>
          <p className="text-ios-subheadline text-muted-foreground mt-1">
            Agendamento inteligente
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
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
              placeholder="••••••••"
              className="ios-input"
              required
              autoComplete="current-password"
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            className="w-full ios-button-primary h-12 text-ios-headline"
            disabled={isLoading}
          >
            {isLoading ? <IOSLoading size="sm" /> : "Entrar"}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-ios-subheadline text-muted-foreground">
            Não tem uma conta?{" "}
            <Link to="/register" className="text-primary font-medium">
              Criar conta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
