'use client';

import Link from 'next/link';
import { Bell, Search, Menu, Home } from 'lucide-react';
import { ThemeToggle } from '@/components/ui';
import { useAuth } from '@/lib/auth-context';
import styles from './Header.module.css';

interface HeaderProps {
    onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
    const { user } = useAuth();

    return (
        <header className={styles.header}>
            <div className={styles.headerLeft}>
                {onMenuClick && (
                    <button 
                        className={styles.menuButton} 
                        onClick={onMenuClick}
                        aria-label="Abrir menu"
                    >
                        <Menu size={24} />
                    </button>
                )}
                <Link href="/" className={styles.homeButton} title="Home" aria-label="Ir para Home">
                    <Home size={20} />
                </Link>
                <div className={styles.searchWrapper}>
                    <Search size={18} className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Buscar..."
                        className={styles.searchInput}
                    />
                    <span className={styles.searchShortcut}>⌘K</span>
                </div>
            </div>

            <div className={styles.actions}>
                <button className={styles.iconButton} title="Notificações">
                    <Bell size={20} />
                    <span className={styles.notificationBadge} />
                </button>

                <ThemeToggle />

                <div className={styles.userMenu}>
                    <div className={styles.avatar}>
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                </div>
            </div>
        </header>
    );
}
