'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Calendar,
    Scissors,
    Users,
    UserCircle,
    Clock,
    Settings,
    BarChart3,
    LogOut,
    Shield,
    X,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import styles from './Sidebar.module.css';

const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/calendar', label: 'Agenda', icon: Calendar },
    { href: '/dashboard/appointments', label: 'Agendamentos', icon: Clock },
    { href: '/dashboard/services', label: 'Serviços', icon: Scissors },
    { href: '/dashboard/staff', label: 'Equipe', icon: Users },
    { href: '/dashboard/clients', label: 'Clientes', icon: UserCircle },
    { href: '/dashboard/analytics', label: 'Relatórios', icon: BarChart3 },
];

const bottomMenuItems = [
    { href: '/dashboard/settings', label: 'Configurações', icon: Settings },
];

// Lista de emails de administradores do sistema
const SYSTEM_ADMINS = ['admin@admin.com', 'admin@ritmo.com'];

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth();

    // Em desenvolvimento, sempre mostra o link admin
    // Verifica pela porta 3000 (dev) ou variável de ambiente
    const isDev = typeof window !== 'undefined' && (
        process.env.NODE_ENV === 'development' ||
        window.location.port === '3000'
    );
    
    const isSystemAdmin = isDev || SYSTEM_ADMINS.includes(user?.email || '');

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    return (
        <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
            <div className={styles.sidebarHeader}>
                <Link href="/dashboard" className={styles.logo}>
                    <span className={styles.logoIcon}>📅</span>
                    <span className={styles.logoText}>Ritmo</span>
                </Link>
                {onClose && (
                    <button className={styles.closeButton} onClick={onClose} aria-label="Fechar menu">
                        <X size={24} />
                    </button>
                )}
            </div>

            <nav className={styles.nav}>
                <ul className={styles.navList}>
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href ||
                            (item.href !== '/dashboard' && pathname.startsWith(item.href));

                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                                    onClick={onClose}
                                >
                                    <Icon size={20} className={styles.navIcon} />
                                    <span className={styles.navLabel}>{item.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className={styles.sidebarFooter}>
                <ul className={styles.navList}>
                    {isSystemAdmin && (
                        <li>
                            <Link
                                href="/admin"
                                className={`${styles.navItem} ${styles.adminLink}`}
                                onClick={onClose}
                            >
                                <Shield size={20} className={styles.navIcon} />
                                <span className={styles.navLabel}>Admin</span>
                            </Link>
                        </li>
                    )}
                    {bottomMenuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname.startsWith(item.href);

                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                                    onClick={onClose}
                                >
                                    <Icon size={20} className={styles.navIcon} />
                                    <span className={styles.navLabel}>{item.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                    <li>
                        <button onClick={handleLogout} className={styles.navItem}>
                            <LogOut size={20} className={styles.navIcon} />
                            <span className={styles.navLabel}>Sair</span>
                        </button>
                    </li>
                </ul>
            </div>
        </aside>
    );
}
