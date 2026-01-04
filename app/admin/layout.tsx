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

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isLoggedIn, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Apenas verifica se está logado, a autorização é feita pelo backend
  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push('/login');
    }
  }, [isLoading, isLoggedIn, router]);

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <p>Carregando...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
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
