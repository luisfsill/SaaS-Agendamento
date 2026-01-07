'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Mail, Lock, AlertCircle, Loader2, Key, ChevronDown, ChevronUp } from 'lucide-react';
import { 
    loginWithCredentials, 
    setAdminToken, 
    validateAdminToken,
    changePasswordForced,
    LoginResponse 
} from '@/lib/admin-api';
import styles from './login.module.css';

type LoginMode = 'credentials' | 'token';
type Step = 'login' | 'change-password';

export default function AdminLoginPage() {
    const router = useRouter();
    const [mode, setMode] = useState<LoginMode>('credentials');
    const [step, setStep] = useState<Step>('login');
    const [showTokenOption, setShowTokenOption] = useState(false);
    
    // Credentials mode
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    // Token mode (legacy)
    const [token, setToken] = useState('');
    
    // Change password step
    const [passwordChangeToken, setPasswordChangeToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCredentialsLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!email.trim() || !password.trim()) {
            setError('Preencha email e senha');
            setLoading(false);
            return;
        }

        try {
            const result: LoginResponse = await loginWithCredentials(email.trim(), password);
            
            if (result.must_change_password && result.password_change_token) {
                setPasswordChangeToken(result.password_change_token);
                setStep('change-password');
            } else {
                router.push('/admin');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao fazer login');
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!newPassword.trim() || !confirmPassword.trim()) {
            setError('Preencha a nova senha');
            setLoading(false);
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('As senhas não coincidem');
            setLoading(false);
            return;
        }

        if (newPassword.length < 8) {
            setError('A senha deve ter pelo menos 8 caracteres');
            setLoading(false);
            return;
        }

        try {
            await changePasswordForced(passwordChangeToken, newPassword);
            router.push('/admin');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao alterar senha');
        } finally {
            setLoading(false);
        }
    };

    const handleTokenLogin = async (e: React.FormEvent) => {
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

    if (step === 'change-password') {
        return (
            <div className={styles.container}>
                <div className={styles.card}>
                    <div className={styles.header}>
                        <div className={styles.iconWrapper}>
                            <Lock size={32} />
                        </div>
                        <h1 className={styles.title}>Alterar Senha</h1>
                        <p className={styles.subtitle}>
                            Você precisa criar uma nova senha para continuar
                        </p>
                    </div>

                    <form onSubmit={handleChangePassword} className={styles.form}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="newPassword" className={styles.label}>
                                Nova Senha
                            </label>
                            <div className={styles.inputWrapper}>
                                <Lock size={18} className={styles.inputIcon} />
                                <input
                                    id="newPassword"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Digite sua nova senha"
                                    className={styles.input}
                                    autoComplete="new-password"
                                />
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="confirmPassword" className={styles.label}>
                                Confirmar Senha
                            </label>
                            <div className={styles.inputWrapper}>
                                <Lock size={18} className={styles.inputIcon} />
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirme sua nova senha"
                                    className={styles.input}
                                    autoComplete="new-password"
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
                                    Alterando...
                                </>
                            ) : (
                                <>
                                    <Shield size={18} />
                                    Alterar e Continuar
                                </>
                            )}
                        </button>
                    </form>

                    <p className={styles.hint}>
                        A senha deve ter pelo menos 8 caracteres,<br />
                        incluindo letras e números.
                    </p>
                </div>
            </div>
        );
    }

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

                {mode === 'credentials' ? (
                    <form onSubmit={handleCredentialsLogin} className={styles.form}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="email" className={styles.label}>
                                Email
                            </label>
                            <div className={styles.inputWrapper}>
                                <Mail size={18} className={styles.inputIcon} />
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@empresa.com"
                                    className={styles.input}
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="password" className={styles.label}>
                                Senha
                            </label>
                            <div className={styles.inputWrapper}>
                                <Lock size={18} className={styles.inputIcon} />
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Digite sua senha"
                                    className={styles.input}
                                    autoComplete="current-password"
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
                                    Entrando...
                                </>
                            ) : (
                                <>
                                    <Shield size={18} />
                                    Acessar Painel Admin
                                </>
                            )}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleTokenLogin} className={styles.form}>
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
                                    Acessar com Token
                                </>
                            )}
                        </button>
                    </form>
                )}

                <div className={styles.toggleSection}>
                    <button
                        type="button"
                        onClick={() => setShowTokenOption(!showTokenOption)}
                        className={styles.toggleButton}
                    >
                        {showTokenOption ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        Outras opções de acesso
                    </button>
                    
                    {showTokenOption && (
                        <div className={styles.toggleOptions}>
                            {mode === 'credentials' ? (
                                <button
                                    type="button"
                                    onClick={() => { setMode('token'); setError(''); }}
                                    className={styles.switchButton}
                                >
                                    <Key size={16} />
                                    Usar Token (legado)
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => { setMode('credentials'); setError(''); }}
                                    className={styles.switchButton}
                                >
                                    <Mail size={16} />
                                    Usar Email/Senha
                                </button>
                            )}
                        </div>
                    )}
                </div>

                <p className={styles.hint}>
                    {mode === 'credentials' 
                        ? 'Use suas credenciais de administrador da plataforma.'
                        : 'Digite seu token de acesso'
                    }
                </p>
            </div>
        </div>
    );
}
