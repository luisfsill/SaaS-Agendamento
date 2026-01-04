'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button, Input, ThemeToggle } from '@/components/ui';
import styles from './forgot-password.module.css';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            // TODO: Implementar chamada à API de recuperação de senha
            // await api.post('/auth/forgot-password', { email });
            
            // Simula sucesso por enquanto
            await new Promise(resolve => setTimeout(resolve, 1000));
            setSubmitted(true);
        } catch (err) {
            setError('Erro ao enviar email de recuperação. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.themeToggleWrapper}>
                <ThemeToggle />
            </div>

            <div className={styles.card}>
                {!submitted ? (
                    <>
                        <div className={styles.header}>
                            <div className={styles.logo}>
                                <span className={styles.logoIcon}>📅</span>
                                <span className={styles.logoText}>Ritmo</span>
                            </div>
                            <h1 className={styles.title}>Esqueceu a senha?</h1>
                            <p className={styles.subtitle}>
                                Digite seu email e enviaremos um link para redefinir sua senha.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className={styles.form}>
                            {error && (
                                <div className={styles.errorBanner}>
                                    {error}
                                </div>
                            )}

                            <Input
                                label="Email"
                                type="email"
                                placeholder="seu@email.com"
                                leftIcon={<Mail size={18} />}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />

                            <Button
                                type="submit"
                                fullWidth
                                isLoading={isLoading}
                                rightIcon={<ArrowRight size={18} />}
                            >
                                Enviar link de recuperação
                            </Button>
                        </form>
                    </>
                ) : (
                    <div className={styles.successMessage}>
                        <div className={styles.successIcon}>✉️</div>
                        <h2 className={styles.successTitle}>Email enviado!</h2>
                        <p className={styles.successText}>
                            Se existe uma conta com o email <strong>{email}</strong>, 
                            você receberá um link para redefinir sua senha.
                        </p>
                        <p className={styles.successHint}>
                            Não recebeu? Verifique a pasta de spam.
                        </p>
                    </div>
                )}

                <div className={styles.footer}>
                    <Link href="/login" className={styles.backLink}>
                        <ArrowLeft size={16} />
                        Voltar para o login
                    </Link>
                </div>
            </div>
        </div>
    );
}
