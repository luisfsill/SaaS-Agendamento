'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, MessageCircle, Users, BarChart3, Clock, Bell, CheckCircle, ArrowRight, Sparkles, Sun, Moon, Menu, X } from 'lucide-react';
import { useTheme } from '@/lib/theme-context';
import styles from './page.module.css';

export default function LandingPage() {
  const { theme, setTheme, mounted } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
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
            <Link href="/demo" className={styles.secondaryCta}>
              Ver Demonstração
            </Link>
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
