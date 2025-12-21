import { Link } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MessageCircle,
  Clock,
  Users,
  BarChart3,
  Zap,
  CheckCircle2,
  ArrowRight,
  Star,
  Shield,
  Smartphone,
  Moon,
  Sun,
} from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Calendar,
    title: "Agenda Inteligente",
    description:
      "Gerencie todos os seus agendamentos em um só lugar. Visualização por dia, semana ou mês com interface intuitiva.",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp Integrado",
    description:
      "Confirme, lembre e comunique-se com clientes automaticamente pelo WhatsApp. Reduza faltas em até 70%.",
  },
  {
    icon: Clock,
    title: "Disponibilidade em Tempo Real",
    description:
      "Seus clientes veem horários disponíveis instantaneamente e agendam 24/7, mesmo fora do horário comercial.",
  },
  {
    icon: Users,
    title: "Gestão de Clientes",
    description:
      "Histórico completo, preferências e dados de contato organizados. Conheça melhor quem você atende.",
  },
  {
    icon: BarChart3,
    title: "Relatórios e Insights",
    description:
      "Acompanhe receita, ocupação e desempenho. Tome decisões baseadas em dados reais do seu negócio.",
  },
  {
    icon: Zap,
    title: "Reencaixe Automático",
    description:
      "Cancelamentos viram oportunidades. O sistema oferece horários vagos automaticamente para sua lista de espera.",
  },
];

const benefits = [
  "Reduza faltas e cancelamentos",
  "Economize tempo com automação",
  "Aumente sua receita mensal",
  "Melhore a experiência do cliente",
  "Acesse de qualquer dispositivo",
  "Suporte em português",
];

const testimonials = [
  {
    name: "Carla Mendes",
    role: "Proprietária, Studio CM",
    content:
      "O Ritmo transformou minha barbearia. Reduzi as faltas em 60% e meus clientes adoram agendar pelo WhatsApp.",
    rating: 5,
  },
  {
    name: "Roberto Silva",
    role: "Dentista",
    content:
      "Finalmente uma solução simples e profissional. Minha recepcionista agora foca no atendimento, não em ligações.",
    rating: 5,
  },
  {
    name: "Ana Paula",
    role: "Esteticista",
    content:
      "Interface linda e fácil de usar. Meus clientes comentam como é prático agendar. Recomendo muito!",
    rating: 5,
  },
];

export default function Landing() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 ios-blur border-b border-border safe-top">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Calendar className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-ios-headline font-semibold text-foreground">
              Ritmo
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg bg-secondary text-secondary-foreground ios-press"
              aria-label="Alternar tema"
            >
              {resolvedTheme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>
            <Link to="/login">
              <Button variant="outline" size="sm" className="ios-button">
                Entrar
              </Button>
            </Link>
            <Link to="/register" className="hidden sm:block">
              <Button size="sm" className="ios-button-primary">
                Começar grátis
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="pt-28 pb-16 px-4 md:pt-36 md:pb-24">
          <div className="container mx-auto text-center max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-ios-footnote font-medium mb-6">
              <Zap className="w-4 h-4" />
              Agendamento inteligente para seu negócio
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Simplifique sua agenda.{" "}
              <span className="text-primary">Conquiste mais clientes.</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              O Ritmo é a plataforma completa de agendamento online para
              profissionais e pequenos negócios. Automatize confirmações,
              reduza faltas e cresça sem complicação.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link to="/register">
                <Button
                  size="lg"
                  className="ios-button-primary h-14 px-8 text-ios-headline gap-2 w-full sm:w-auto"
                >
                  Experimente grátis
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <a href="#funcionalidades">
                <Button
                  variant="outline"
                  size="lg"
                  className="ios-button h-14 px-8 text-ios-headline w-full sm:w-auto"
                >
                  Saiba mais
                </Button>
              </a>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-muted-foreground text-ios-footnote">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-success" />
                Teste grátis por 14 dias
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                Dados seguros e protegidos
              </div>
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-info" />
                Funciona em qualquer dispositivo
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="funcionalidades" className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Tudo que você precisa para crescer
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Funcionalidades pensadas para simplificar sua rotina e
                proporcionar a melhor experiência para seus clientes.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <article
                    key={index}
                    className="ios-card p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-ios-title3 text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-ios-subheadline text-muted-foreground">
                      {feature.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Por que escolher o Ritmo?
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Desenvolvido para profissionais que valorizam seu tempo e
                  querem oferecer uma experiência excepcional aos clientes.
                </p>

                <ul className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-success" />
                      </div>
                      <span className="text-ios-body text-foreground">
                        {benefit}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <Link to="/register">
                    <Button className="ios-button-primary h-12 px-6 text-ios-headline gap-2">
                      Começar agora
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="relative">
                <div className="ios-card p-6 bg-gradient-to-br from-primary/5 to-primary/10">
                  <div className="aspect-[4/3] rounded-xl bg-card flex items-center justify-center">
                    <div className="text-center p-8">
                      <Calendar className="w-16 h-16 text-primary mx-auto mb-4" />
                      <p className="text-ios-title2 text-foreground mb-2">
                        Interface intuitiva
                      </p>
                      <p className="text-ios-subheadline text-muted-foreground">
                        Design inspirado no iOS para uma experiência familiar e
                        agradável.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Quem usa, recomenda
              </h2>
              <p className="text-lg text-muted-foreground">
                Veja o que nossos clientes dizem sobre o Ritmo.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <article key={index} className="ios-card p-6">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-warning fill-warning"
                      />
                    ))}
                  </div>
                  <blockquote className="text-ios-body text-foreground mb-4">
                    "{testimonial.content}"
                  </blockquote>
                  <footer>
                    <p className="text-ios-headline text-foreground">
                      {testimonial.name}
                    </p>
                    <p className="text-ios-footnote text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </footer>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-3xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Pronto para transformar seu negócio?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Junte-se a milhares de profissionais que já simplificaram sua
              agenda com o Ritmo. Comece gratuitamente, sem cartão de crédito.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <Button
                  size="lg"
                  className="ios-button-primary h-14 px-8 text-ios-headline gap-2 w-full sm:w-auto"
                >
                  Criar conta grátis
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  variant="outline"
                  size="lg"
                  className="ios-button h-14 px-8 text-ios-headline w-full sm:w-auto"
                >
                  Já tenho conta
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Calendar className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-ios-body font-medium text-foreground">
                Ritmo
              </span>
            </div>

            <nav className="flex items-center gap-6 text-ios-footnote text-muted-foreground">
              <a href="#funcionalidades" className="hover:text-foreground">
                Funcionalidades
              </a>
              <Link to="/login" className="hover:text-foreground">
                Entrar
              </Link>
              <Link to="/register" className="hover:text-foreground">
                Criar conta
              </Link>
            </nav>

            <p className="text-ios-caption1 text-muted-foreground">
              © {new Date().getFullYear()} Ritmo. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
