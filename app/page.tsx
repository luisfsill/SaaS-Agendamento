'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  MessageCircle, 
  Users, 
  BarChart3, 
  Clock, 
  Bell, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Sparkles, 
  Sun, 
  Moon, 
  Menu, 
  X,
  Target,
  Shield,
  TrendingUp,
  Heart,
  Zap,
  Eye
} from 'lucide-react';
import { useTheme } from '@/lib/theme-context';
import styles from './page.module.css';

export default function LandingPage() {
  const { theme, setTheme, mounted } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentCard, setCurrentCard] = useState(0);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [isAnimating, setIsAnimating] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Cards da demonstração
  const demoCards = [
    {
      id: 0,
      title: 'Enquanto você atende...',
      subtitle: 'quem responde seus clientes?',
      icon: <Sparkles size={40} />,
      bgGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      content: (
        <div className={styles.demoIntroContent}>
          <p>Às 23h, alguém pergunta <strong>&quot;tem horário amanhã?&quot;</strong></p>
          <p>Você responde às 7h. Ela já marcou com o concorrente.</p>
          <div className={styles.demoHighlight}>
            <Zap size={20} />
            <span><strong>Com Ritmo:</strong> resposta em 3 segundos, cliente agendado.</span>
          </div>
        </div>
      ),
    },
    {
      id: 1,
      title: 'Reconhece esse filme?',
      subtitle: 'A rotina de quem vive de agenda',
      icon: <Target size={40} />,
      bgGradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      content: (
        <div className={styles.demoPainContent}>
          <div className={styles.demoPainItem}>
            <div className={styles.demoPainIcon}><Clock size={20} /></div>
            <p>Parar o serviço pra responder <strong>&quot;qual o valor?&quot;</strong></p>
          </div>
          <div className={styles.demoPainItem}>
            <div className={styles.demoPainIcon}><Calendar size={20} /></div>
            <p>Cliente confirma e... <strong>não aparece</strong></p>
          </div>
          <div className={styles.demoPainItem}>
            <div className={styles.demoPainIcon}><Users size={20} /></div>
            <p>Bom cliente sumiu há meses. <strong>Esqueceu de você.</strong></p>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      title: 'Nunca mais "tá ocupado"',
      subtitle: 'Atenda 50 clientes ao mesmo tempo',
      icon: <MessageCircle size={40} />,
      bgGradient: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
      content: (
        <div className={styles.demoSolutionContent}>
          <div className={styles.demoSolutionItem}>
            <div className={styles.demoSolutionIcon}><Zap size={20} /></div>
            <div><strong>Resposta Instantânea</strong><p>IA responde em segundos, 24/7</p></div>
          </div>
          <div className={styles.demoSolutionItem}>
            <div className={styles.demoSolutionIcon}><Calendar size={20} /></div>
            <div><strong>Agendamento Direto</strong><p>Cliente escolhe e confirma sozinho</p></div>
          </div>
          <div className={styles.demoSolutionItem}>
            <div className={styles.demoSolutionIcon}><Eye size={20} /></div>
            <div><strong>Preços e Horários</strong><p>Sempre corretos, sem chute</p></div>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      title: 'Chega de "esqueci"',
      subtitle: 'Reduza faltas em até 60%',
      icon: <Bell size={40} />,
      bgGradient: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)',
      content: (
        <div className={styles.demoSolutionContent}>
          <div className={styles.demoSolutionItem}>
            <div className={styles.demoSolutionIcon}><Bell size={20} /></div>
            <div><strong>Lembrete Automático</strong><p>24h e 1h antes do horário</p></div>
          </div>
          <div className={styles.demoSolutionItem}>
            <div className={styles.demoSolutionIcon}><CheckCircle size={20} /></div>
            <div><strong>Confirmação Fácil</strong><p>Confirmo ou Preciso remarcar</p></div>
          </div>
          <div className={styles.demoSolutionItem}>
            <div className={styles.demoSolutionIcon}><TrendingUp size={20} /></div>
            <div><strong>Reposição Rápida</strong><p>Cancelou? Próximo da fila é avisado</p></div>
          </div>
        </div>
      ),
    },
    {
      id: 4,
      title: 'Cliente sumiu?',
      subtitle: 'A gente traz de volta',
      icon: <Heart size={40} />,
      bgGradient: 'linear-gradient(135deg, #c31432 0%, #240b36 100%)',
      content: (
        <div className={styles.demoExperienceContent}>
          <div className={styles.demoExperienceItem}><MessageCircle size={22} /><span><strong>Reengajamento Automático</strong></span></div>
          <div className={styles.demoExperienceItem}><Clock size={22} /><span>30 dias sem vir? Mensagem personalizada</span></div>
          <div className={styles.demoExperienceItem}><Sparkles size={22} /><span>&quot;Sentimos sua falta! Que tal agendar?&quot;</span></div>
          <div className={styles.demoExperienceItem}><TrendingUp size={22} /><span><strong>+23% de retorno</strong> em média</span></div>
        </div>
      ),
    },
    {
      id: 5,
      title: 'IA que não inventa',
      subtitle: 'O segredo do Ritmo',
      icon: <Shield size={40} />,
      bgGradient: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
      content: (
        <div className={styles.demoDifferentialContent}>
          <p className={styles.demoDifferentialQuote}>Outras IAs <span className={styles.strike}>&quot;acham&quot;</span> que sabem. A nossa <strong>consulta seu catálogo</strong> antes de falar.</p>
          <div className={styles.demoCheckList}>
            <div className={styles.demoCheckItem}><CheckCircle size={18} /><span>Preço? Busca no seu cadastro</span></div>
            <div className={styles.demoCheckItem}><CheckCircle size={18} /><span>Horário? Verifica agenda real</span></div>
            <div className={styles.demoCheckItem}><CheckCircle size={18} /><span>Dúvida? Transfere pra você</span></div>
          </div>
        </div>
      ),
    },
    {
      id: 6,
      title: 'Vários profissionais?',
      subtitle: 'Cada um com sua agenda',
      icon: <Users size={40} />,
      bgGradient: 'linear-gradient(135deg, #834d9b 0%, #d04ed6 100%)',
      content: (
        <div className={styles.demoAnalogyContent}>
          <div className={styles.demoAnalogyGood}><span>👤</span><p>Cada profissional tem horários próprios</p></div>
          <div className={styles.demoAnalogyGood}><span>📱</span><p>WhatsApp individual ou compartilhado</p></div>
          <div className={styles.demoAnalogyGood}><span>💰</span><p>Comissões e relatórios separados</p></div>
          <p className={styles.demoAnalogyConclusion}>Perfeito para salões, clínicas e estúdios.</p>
        </div>
      ),
    },
    {
      id: 7,
      title: 'Comece em 3 minutos',
      subtitle: 'Sem cartão. Sem contrato.',
      icon: <Sparkles size={40} />,
      bgGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      content: (
        <div className={styles.demoClosingContent}>
          <div className={styles.demoClosingBenefits}>
            <div className={styles.demoClosingBenefit}><Clock size={28} /><span>3min setup</span></div>
            <span className={styles.demoClosingPlus}>+</span>
            <div className={styles.demoClosingBenefit}><MessageCircle size={28} /><span>WhatsApp</span></div>
            <span className={styles.demoClosingPlus}>+</span>
            <div className={styles.demoClosingBenefit}><Zap size={28} /><span>IA 24/7</span></div>
          </div>
          <p className={styles.demoClosingText}>Teste grátis por 14 dias. Cancele quando quiser.</p>
        </div>
      ),
    },
  ];

  const goToNextCard = useCallback(() => {
    if (isAnimating || currentCard >= demoCards.length - 1) return;
    setIsAnimating(true);
    setDirection('next');
    setTimeout(() => {
      setCurrentCard(prev => prev + 1);
      setIsAnimating(false);
    }, 300);
  }, [isAnimating, currentCard, demoCards.length]);

  const goToPrevCard = useCallback(() => {
    if (isAnimating || currentCard <= 0) return;
    setIsAnimating(true);
    setDirection('prev');
    setTimeout(() => {
      setCurrentCard(prev => prev - 1);
      setIsAnimating(false);
    }, 300);
  }, [isAnimating, currentCard]);

  const goToCard = (index: number) => {
    if (isAnimating || index === currentCard) return;
    setIsAnimating(true);
    setDirection(index > currentCard ? 'next' : 'prev');
    setTimeout(() => {
      setCurrentCard(index);
      setIsAnimating(false);
    }, 300);
  };

  // Fecha o menu ao redimensionar para desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Previne scroll do body quando menu está aberto
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Evitar problemas de hidratação - não renderizar até montar
  if (!mounted) {
    return null;
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>📅</span>
            <span className={styles.logoText}>Ritmo</span>
          </div>
          
          {/* Desktop Nav */}
          <nav className={styles.nav}>
            <a href="#demo" className={styles.navLink}>Demonstração</a>
            <a href="#features" className={styles.navLink}>Funcionalidades</a>
            <a href="#how-it-works" className={styles.navLink}>Como funciona</a>
            <a href="#benefits" className={styles.navLink}>Benefícios</a>
          </nav>
          
          <div className={styles.headerActions}>
            <button 
              onClick={toggleTheme} 
              className={styles.themeToggle}
              aria-label="Alternar tema"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <Link href="/login" className={styles.loginButton}>
              Entrar
            </Link>
            <Link href="/register" className={styles.ctaButton}>
              Começar Grátis
            </Link>
            
            {/* Mobile Menu Button */}
            <button 
              className={styles.mobileMenuButton}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={styles.mobileMenu}>
            <nav className={styles.mobileNav}>
              <a href="#demo" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>Demonstração</a>
              <a href="#features" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>Funcionalidades</a>
              <a href="#how-it-works" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>Como funciona</a>
              <a href="#benefits" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>Benefícios</a>
            </nav>
            <div className={styles.mobileActions}>
              <Link href="/login" className={styles.mobileLoginButton} onClick={() => setMobileMenuOpen(false)}>
                Entrar
              </Link>
              <Link href="/register" className={styles.mobileCtaButton} onClick={() => setMobileMenuOpen(false)}>
                Começar Grátis
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroTag}>
            <Sparkles size={16} />
            <span>Novo: Assistente AI conversacional</span>
          </div>
          <h1 className={styles.heroTitle}>
            Agendamento Inteligente<br />
            <span className={styles.heroHighlight}>que Funciona no WhatsApp</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Automatize seus agendamentos com IA. Seus clientes agendam 24/7 pelo WhatsApp,
            você ganha tempo e reduz no-shows em até 60%.
          </p>
          <div className={styles.heroCtas}>
            <Link href="/register" className={styles.primaryCta}>
              Começar Grátis
              <ArrowRight size={20} />
            </Link>
            <a href="#demo" className={styles.secondaryCta}>
              Ver Demonstração
            </a>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.stat}>
              <span className={styles.statValue}>60%</span>
              <span className={styles.statLabel}>Menos no-shows</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statValue}>24/7</span>
              <span className={styles.statLabel}>Agendamento automático</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statValue}>3min</span>
              <span className={styles.statLabel}>Para configurar</span>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className={styles.demoSection}>
        <div className={styles.sectionContent}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Veja como funciona</h2>
            <p className={styles.sectionSubtitle}>
              Navegue pelos cards para entender o poder do Ritmo
            </p>
          </div>
          
          <div className={styles.demoContainer}>
            {/* Seta Esquerda */}
            <button 
              onClick={goToPrevCard}
              disabled={currentCard === 0}
              className={styles.demoNavButton}
              aria-label="Card anterior"
            >
              <ArrowLeft size={24} />
            </button>

            {/* Card */}
            <div 
              className={`${styles.demoCard} ${isAnimating ? (direction === 'next' ? styles.demoCardExitLeft : styles.demoCardExitRight) : styles.demoCardEnter}`}
              style={{ background: demoCards[currentCard].bgGradient }}
            >
              <div className={styles.demoCardInner}>
                <div className={styles.demoCardIcon}>
                  {demoCards[currentCard].icon}
                </div>
                <h3 className={styles.demoCardTitle}>{demoCards[currentCard].title}</h3>
                {demoCards[currentCard].subtitle && (
                  <p className={styles.demoCardSubtitle}>{demoCards[currentCard].subtitle}</p>
                )}
                <div className={styles.demoCardContent}>
                  {demoCards[currentCard].content}
                </div>
              </div>
            </div>

            {/* Seta Direita */}
            <button 
              onClick={goToNextCard}
              disabled={currentCard === demoCards.length - 1}
              className={styles.demoNavButton}
              aria-label="Próximo card"
            >
              <ArrowRight size={24} />
            </button>
          </div>

          {/* Dots Navigation */}
          <div className={styles.demoDots}>
            {demoCards.map((_, index) => (
              <button
                key={index}
                onClick={() => goToCard(index)}
                className={`${styles.demoDot} ${index === currentCard ? styles.demoDotActive : ''}`}
                aria-label={`Ir para card ${index + 1}`}
              />
            ))}
          </div>

          {/* Progress */}
          <div className={styles.demoProgress}>
            <span>{currentCard + 1} de {demoCards.length}</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={styles.features}>
        <div className={styles.sectionContent}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Tudo que você precisa</h2>
            <p className={styles.sectionSubtitle}>
              Ferramentas poderosas para automatizar e crescer seu negócio
            </p>
          </div>
          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <MessageCircle size={24} />
              </div>
              <h3 className={styles.featureTitle}>Agendamento via WhatsApp</h3>
              <p className={styles.featureDescription}>
                Seus clientes agendam direto pelo WhatsApp, 24/7, sem precisar ligar ou baixar apps.
              </p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <Sparkles size={24} />
              </div>
              <h3 className={styles.featureTitle}>Assistente AI</h3>
              <p className={styles.featureDescription}>
                Inteligência artificial responde dúvidas e confirma agendamentos automaticamente.
              </p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <Calendar size={24} />
              </div>
              <h3 className={styles.featureTitle}>Gestão de Agenda</h3>
              <p className={styles.featureDescription}>
                Visualize, reagende e gerencie todos os compromissos em um painel intuitivo.
              </p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <Users size={24} />
              </div>
              <h3 className={styles.featureTitle}>Gestão de Equipe</h3>
              <p className={styles.featureDescription}>
                Gerencie horários e serviços de cada profissional da sua equipe.
              </p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <Bell size={24} />
              </div>
              <h3 className={styles.featureTitle}>Lembretes Automáticos</h3>
              <p className={styles.featureDescription}>
                Reduza faltas com lembretes automáticos via WhatsApp antes de cada agendamento.
              </p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <BarChart3 size={24} />
              </div>
              <h3 className={styles.featureTitle}>Analytics em Tempo Real</h3>
              <p className={styles.featureDescription}>
                Acompanhe receita, ocupação e performance da equipe em tempo real.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className={styles.howItWorks}>
        <div className={styles.sectionContent}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Como funciona</h2>
            <p className={styles.sectionSubtitle}>
              Comece em 3 passos simples
            </p>
          </div>
          <div className={styles.stepsGrid}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <h3 className={styles.stepTitle}>Configure seu negócio</h3>
              <p className={styles.stepDescription}>
                Cadastre seus serviços, profissionais e horários de funcionamento.
              </p>
            </div>
            <div className={styles.stepConnector} />
            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <h3 className={styles.stepTitle}>Conecte o WhatsApp</h3>
              <p className={styles.stepDescription}>
                Vincule seu número comercial em poucos cliques.
              </p>
            </div>
            <div className={styles.stepConnector} />
            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <h3 className={styles.stepTitle}>Pronto!</h3>
              <p className={styles.stepDescription}>
                Clientes agendam automaticamente e você recebe notificações.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className={styles.benefits}>
        <div className={styles.sectionContent}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Por que escolher o Ritmo?</h2>
          </div>
          <div className={styles.benefitsGrid}>
            <div className={styles.benefitItem}>
              <CheckCircle size={20} className={styles.benefitIcon} />
              <span>Reduza no-shows em até 60%</span>
            </div>
            <div className={styles.benefitItem}>
              <CheckCircle size={20} className={styles.benefitIcon} />
              <span>Economize 10+ horas por semana</span>
            </div>
            <div className={styles.benefitItem}>
              <CheckCircle size={20} className={styles.benefitIcon} />
              <span>Atendimento 24/7 automatizado</span>
            </div>
            <div className={styles.benefitItem}>
              <CheckCircle size={20} className={styles.benefitIcon} />
              <span>Sem taxa de setup</span>
            </div>
            <div className={styles.benefitItem}>
              <CheckCircle size={20} className={styles.benefitIcon} />
              <span>Trial gratuito de 14 dias</span>
            </div>
            <div className={styles.benefitItem}>
              <CheckCircle size={20} className={styles.benefitIcon} />
              <span>Suporte em português</span>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className={styles.finalCta}>
        <div className={styles.sectionContent}>
          <h2 className={styles.ctaTitle}>Pronto para automatizar seus agendamentos?</h2>
          <p className={styles.ctaSubtitle}>
            Comece grátis hoje. Não precisa de cartão de crédito.
          </p>
          <Link href="/register" className={styles.primaryCta}>
            Criar Conta Grátis
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerLogo}>
            <span className={styles.logoIcon}>📅</span>
            <span className={styles.logoText}>Ritmo</span>
          </div>
          <p className={styles.footerText}>
            © 2024 Ritmo. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
