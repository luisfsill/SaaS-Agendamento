'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/lib/theme-context';
import styles from './ThemeToggle.module.css';

export function ThemeToggle() {
    const { theme, setTheme, resolvedTheme, mounted } = useTheme();

    const cycleTheme = () => {
        const themes: Array<'light' | 'dark'> = ['light', 'dark'];
        const currentIndex = themes.indexOf(theme as 'light' | 'dark');
        const nextIndex = (currentIndex + 1) % themes.length;
        setTheme(themes[nextIndex]);
    };

    // Evitar problemas de hidratação
    if (!mounted) {
        return (
            <button
                className={styles.toggle}
                aria-label="Alternar tema"
                title="Tema"
            >
                <span className={styles.iconWrapper}>
                    <Sun size={18} />
                </span>
            </button>
        );
    }

    return (
        <button
            onClick={cycleTheme}
            className={styles.toggle}
            aria-label={`Tema atual: ${theme}. Clique para alternar.`}
            title={`Tema: ${theme === 'light' ? 'Claro' : 'Escuro'}`}
        >
            <span className={styles.iconWrapper}>
                {resolvedTheme === 'light' ? (
                    <Sun size={18} />
                ) : (
                    <Moon size={18} />
                )}
            </span>
        </button>
    );
}
