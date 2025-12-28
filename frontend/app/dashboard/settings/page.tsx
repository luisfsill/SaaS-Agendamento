'use client';

import { useState, useEffect } from 'react';
import { User, Building2, Bell, Palette, Link2, Shield, Save, Loader2, MessageCircle } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { WhatsAppModal } from '@/components/ui/WhatsAppModal';
import { useTheme } from '@/lib/theme-context';
import { useAuth } from '@/lib/auth-context';
import { api, ApiError } from '@/lib/api';
import { uazapi, WhatsAppStorage } from '@/lib/uazapi';
import styles from './settings.module.css';

type Tab = 'profile' | 'business' | 'notifications' | 'appearance' | 'integrations' | 'security';

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'business', label: 'Negócio', icon: Building2 },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'appearance', label: 'Aparência', icon: Palette },
    { id: 'integrations', label: 'Integrações', icon: Link2 },
    { id: 'security', label: 'Segurança', icon: Shield },
];

interface TenantProfile {
    id: string;
    slug: string;
    business_name: string;
    business_type: string | null;
    phone: string | null;
    address: { street?: string; city?: string } | null;
}

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<Tab>('profile');
    const { theme, setTheme } = useTheme();
    const { user } = useAuth();
    const [isSaving, setIsSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [whatsappModalOpen, setWhatsappModalOpen] = useState(false);
    const [whatsappStatus, setWhatsappStatus] = useState<'connected' | 'disconnected' | 'loading'>('loading');
    
    // Business state (from /tenants/profile)
    const [tenantProfile, setTenantProfile] = useState<TenantProfile | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const profileData = await api.get<TenantProfile>('/tenants/profile').catch(() => null);
                if (profileData) {
                    setTenantProfile(profileData);
                }
                
                // Verifica status do WhatsApp
                const whatsappToken = WhatsAppStorage.getToken();
                if (whatsappToken) {
                    try {
                        const status = await uazapi.getStatus(whatsappToken);
                        setWhatsappStatus(status.status.connected ? 'connected' : 'disconnected');
                    } catch {
                        setWhatsappStatus('disconnected');
                    }
                } else {
                    setWhatsappStatus('disconnected');
                }
            } catch (err) {
                console.error('Erro ao carregar configurações:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [whatsappModalOpen]); // Recarrega quando fechar o modal

    const handleSaveBusiness = async () => {
        if (!tenantProfile) return;
        
        setIsSaving(true);
        try {
            await api.patch('/tenants/profile', {
                business_name: tenantProfile.business_name,
                phone: tenantProfile.phone,
            });
            alert('Dados do negócio atualizados com sucesso!');
        } catch (err) {
            const apiError = err as ApiError;
            
            if (apiError.status === 0) {
                alert('O serviço está fora do ar no momento. Contate o administrador.');
            } else {
                alert(apiError.message || 'Erro ao salvar dados do negócio. Tente novamente.');
            }
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.page}>
                <div className={styles.loadingState}>
                    <Loader2 size={32} className={styles.spinner} />
                    <p>Carregando configurações...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.title}>Configurações</h1>
                <p className={styles.subtitle}>Gerencie suas preferências e configurações</p>
            </div>

            <div className={styles.content}>
                <nav className={styles.tabList}>
                    {tabs.map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                <Icon size={18} />
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </nav>

                <div className={styles.tabContent}>
                    {activeTab === 'profile' && (
                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>Informações Pessoais</h2>
                            <div className={styles.form}>
                                <Input 
                                    label="Nome" 
                                    value={user?.name || ''} 
                                    disabled
                                />
                                <Input 
                                    label="Email" 
                                    type="email" 
                                    value={user?.email || ''}
                                    disabled
                                />
                            </div>
                            <p className={styles.infoText}>
                                Para alterar dados do perfil, entre em contato com o suporte.
                            </p>
                        </div>
                    )}

                    {activeTab === 'business' && (
                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>Dados do Negócio</h2>
                            <div className={styles.form}>
                                <Input 
                                    label="Nome do negócio" 
                                    value={tenantProfile?.business_name || ''}
                                    onChange={(e) => setTenantProfile(prev => prev ? { ...prev, business_name: e.target.value } : null)}
                                />
                                <Input 
                                    label="Slug (URL)" 
                                    value={tenantProfile?.slug || ''}
                                    disabled
                                />
                                <Input 
                                    label="Telefone" 
                                    value={tenantProfile?.phone || ''}
                                    onChange={(e) => setTenantProfile(prev => prev ? { ...prev, phone: e.target.value } : null)}
                                />
                                <Input 
                                    label="Tipo de Negócio" 
                                    value={tenantProfile?.business_type || ''}
                                    disabled
                                />
                            </div>
                            <div className={styles.actions}>
                                <Button onClick={handleSaveBusiness} isLoading={isSaving}>
                                    <Save size={18} /> Salvar Alterações
                                </Button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>Preferências de Notificação</h2>
                            <div className={styles.toggleList}>
                                <label className={styles.toggleItem}>
                                    <input type="checkbox" defaultChecked />
                                    <div>
                                        <span className={styles.toggleLabel}>Novos agendamentos</span>
                                        <p className={styles.toggleDesc}>Receber notificação quando um cliente agendar</p>
                                    </div>
                                </label>
                                <label className={styles.toggleItem}>
                                    <input type="checkbox" defaultChecked />
                                    <div>
                                        <span className={styles.toggleLabel}>Cancelamentos</span>
                                        <p className={styles.toggleDesc}>Receber notificação quando um agendamento for cancelado</p>
                                    </div>
                                </label>
                                <label className={styles.toggleItem}>
                                    <input type="checkbox" defaultChecked />
                                    <div>
                                        <span className={styles.toggleLabel}>Lembretes diários</span>
                                        <p className={styles.toggleDesc}>Receber resumo da agenda do dia pela manhã</p>
                                    </div>
                                </label>
                                <label className={styles.toggleItem}>
                                    <input type="checkbox" />
                                    <div>
                                        <span className={styles.toggleLabel}>Relatórios semanais</span>
                                        <p className={styles.toggleDesc}>Receber relatório de desempenho semanal</p>
                                    </div>
                                </label>
                            </div>
                        </div>
                    )}

                    {activeTab === 'appearance' && (
                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>Tema</h2>
                            <div className={styles.themeOptions}>
                                <button
                                    className={`${styles.themeOption} ${theme === 'light' ? styles.active : ''}`}
                                    onClick={() => setTheme('light')}
                                >
                                    <div className={styles.themePreview} data-theme="light" />
                                    <span>Claro</span>
                                </button>
                                <button
                                    className={`${styles.themeOption} ${theme === 'dark' ? styles.active : ''}`}
                                    onClick={() => setTheme('dark')}
                                >
                                    <div className={`${styles.themePreview} ${styles.dark}`} />
                                    <span>Escuro</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'integrations' && (
                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>WhatsApp</h2>
                            <div className={styles.integrationCard}>
                                <div className={`${styles.integrationIcon} ${styles.whatsappIcon}`}>
                                    <MessageCircle size={24} />
                                </div>
                                <div className={styles.integrationInfo}>
                                    <span className={styles.integrationName}>WhatsApp Business</span>
                                    {whatsappStatus === 'loading' ? (
                                        <span className={styles.integrationStatusLoading}>Verificando...</span>
                                    ) : whatsappStatus === 'connected' ? (
                                        <span className={styles.integrationStatus}>Conectado</span>
                                    ) : (
                                        <span className={styles.integrationStatusDisconnected}>Não conectado</span>
                                    )}
                                </div>
                                <Button 
                                    variant={whatsappStatus === 'connected' ? 'secondary' : 'primary'} 
                                    size="sm"
                                    onClick={() => setWhatsappModalOpen(true)}
                                >
                                    Configurar
                                </Button>
                            </div>
                            <h2 className={styles.sectionTitle}>Calendário</h2>
                            <div className={styles.integrationCard}>
                                <div className={styles.integrationIcon}>📅</div>
                                <div className={styles.integrationInfo}>
                                    <span className={styles.integrationName}>Google Calendar</span>
                                    <span className={styles.integrationStatusDisconnected}>Não conectado</span>
                                </div>
                                <Button variant="primary" size="sm">Conectar</Button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>Alterar Senha</h2>
                            <div className={styles.form}>
                                <Input label="Senha atual" type="password" />
                                <Input label="Nova senha" type="password" />
                                <Input label="Confirmar nova senha" type="password" />
                            </div>
                            <div className={styles.actions}>
                                <Button isLoading={isSaving}>
                                    <Save size={18} /> Alterar Senha
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* WhatsApp Configuration Modal */}
            <WhatsAppModal 
                isOpen={whatsappModalOpen} 
                onClose={() => setWhatsappModalOpen(false)} 
            />
        </div>
    );
}
