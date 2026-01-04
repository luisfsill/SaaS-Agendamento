'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Key, AlertCircle, Loader2 } from 'lucide-react';
import { setAdminToken, validateAdminToken } from '@/lib/admin-api';
import styles from './login.module.css';

export default function AdminLoginPage() {
    const router = useRouter();
    const [token, setToken] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!token.trim()) {
            setError('Digite o token de administrador');
            setLoading(false);
            return;
        }

        try {
            const isValid = await validateAdminToken(token.trim());
            
            if (isValid) {
                setAdminToken(token.trim());
                router.push('/admin');
            } else {
                setError('Token inválido ou área admin desabilitada');
            }
        } catch (err) {
            setError('Erro ao validar token. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <div className={styles.iconWrapper}>
                        <Shield size={32} />
                    </div>
                    <h1 className={styles.title}>Admin Login</h1>
                    <p className={styles.subtitle}>
                        Acesso restrito à plataforma administrativa
                    </p>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="token" className={styles.label}>
                            Token de Administrador
                        </label>
                        <div className={styles.inputWrapper}>
                            <Key size={18} className={styles.inputIcon} />
                            <input
                                id="token"
                                type="password"
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                                placeholder="Digite o token secreto"
                                className={styles.input}
                                autoComplete="off"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className={styles.error}>
                            <AlertCircle size={16} />
                            <span>{error}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        className={styles.button}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 size={18} className={styles.spinner} />
                                Verificando...
                            </>
                        ) : (
                            <>
                                <Shield size={18} />
                                Acessar Painel Admin
                            </>
                        )}
                    </button>
                </form>

                <p className={styles.hint}>
                    O token é configurado na variável de ambiente<br />
                    <code>PLATFORM_ADMIN_TOKEN</code> do backend
                </p>
            </div>
        </div>
    );
}
