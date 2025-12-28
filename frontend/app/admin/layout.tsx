'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Settings, Users, Building2, LayoutDashboard, LogOut, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './admin.module.css';

const adminMenuItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/tenants', icon: Building2, label: 'Empresas' },
  { href: '/admin/users', icon: Users, label: 'Usuários' },
  { href: '/admin/settings', icon: Settings, label: 'Configurações' },
];

// Lista de emails de administradores do sistema
// Em produção, isso viria do backend
const SYSTEM_ADMINS = ['admin@admin.com', 'admin@ritmo.com'];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isLoggedIn, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Aguardar o carregamento terminar
    if (isLoading) return;

    // Em desenvolvimento, permite qualquer usuário logado
    // Verifica pela porta 3000 (dev) ou variável de ambiente
    const isDev = process.env.NODE_ENV === 'development' || 
                  window.location.port === '3000';

    // Se não está logado
    if (!isLoggedIn && !user) {
      // Em dev, não redireciona imediatamente - pode estar carregando
      if (!isDev) {
        router.push('/login');
      }
      setChecking(false);
      return;
    }

    // Se tem usuário, verificar permissões
    if (user) {
      const isSystemAdmin = isDev || SYSTEM_ADMINS.includes(user.email || '');
      
      if (!isSystemAdmin) {
        router.push('/dashboard');
        return;
      }

      setAuthorized(true);
    }
    
    setChecking(false);
  }, [user, isLoading, isLoggedIn, router]);

  // Em desenvolvimento, se não está carregando e não tem user, mostrar mesmo assim
  useEffect(() => {
    const isDev = process.env.NODE_ENV === 'development' || 
                  (typeof window !== 'undefined' && window.location.port === '3000');
    
    if (isDev && !isLoading && !checking && !authorized) {
      // Em dev, autorizar mesmo sem user para debug
      setAuthorized(true);
    }
  }, [isLoading, checking, authorized]);

  if (isLoading || checking) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <p>Verificando permissões...</p>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <p>Redirecionando...</p>
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h1 className={styles.logo}>🔧 Admin</h1>
          <span className={styles.badge}>Sistema</span>
        </div>

        <nav className={styles.nav}>
          {adminMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${isActive ? styles.active : ''}`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <Link href="/dashboard" className={styles.backLink}>
            <ChevronLeft size={18} />
            Voltar ao SaaS
          </Link>
          <button onClick={logout} className={styles.logoutButton}>
            <LogOut size={18} />
            Sair
          </button>
        </div>
      </aside>

      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.headerInfo}>
            <span className={styles.welcomeText}>Painel Administrativo</span>
            <span className={styles.userEmail}>{user?.email}</span>
          </div>
        </header>
        <div className={styles.content}>
          {children}
        </div>
      </main>
    </div>
  );
}
