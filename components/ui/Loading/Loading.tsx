import { Loader2 } from 'lucide-react';
import styles from './Loading.module.css';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
    const sizeMap = { sm: 16, md: 24, lg: 32 };

    return (
        <Loader2
            className={`${styles.spinner} ${className}`}
            size={sizeMap[size]}
        />
    );
}

interface LoadingOverlayProps {
    message?: string;
}

export function LoadingOverlay({ message = 'Carregando...' }: LoadingOverlayProps) {
    return (
        <div className={styles.overlay}>
            <div className={styles.content}>
                <LoadingSpinner size="lg" />
                <span className={styles.message}>{message}</span>
            </div>
        </div>
    );
}

interface SkeletonProps {
    width?: string | number;
    height?: string | number;
    borderRadius?: string;
    className?: string;
}

export function Skeleton({
    width = '100%',
    height = 20,
    borderRadius = 'var(--radius-sm)',
    className = ''
}: SkeletonProps) {
    return (
        <div
            className={`${styles.skeleton} ${className}`}
            style={{
                width: typeof width === 'number' ? `${width}px` : width,
                height: typeof height === 'number' ? `${height}px` : height,
                borderRadius,
            }}
        />
    );
}
