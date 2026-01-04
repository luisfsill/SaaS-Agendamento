'use client';

import { useEffect, useState } from 'react';
import { Calendar, Users, DollarSign, Clock, TrendingUp, TrendingDown, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';
import styles from './dashboard.module.css';

interface DashboardSummary {
    appointments_today: number;
    appointments_today_change: number;
    active_clients: number;
    active_clients_change: number;
    revenue_month: number;
    revenue_month_change: number;
    no_show_rate: number;
    no_show_rate_change: number;
}

interface Appointment {
    id: string;
    start_at: string;
    client: {
        id: string;
        name: string;
    };
    service: {
        id: string;
        name: string;
    };
    staff: {
        id: string;
        name: string;
    };
    status: string;
}

export default function DashboardPage() {
    const [summary, setSummary] = useState<DashboardSummary | null>(null);
    const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                setError(null);

                const today = new Date().toISOString().split('T')[0];
                
                const [summaryData, appointmentsData] = await Promise.all([
                    api.get<DashboardSummary>('/dashboard/summary').catch(() => null),
                    api.get<Appointment[]>(`/dashboard/day?date=${today}`).catch(() => [])
                ]);

                if (summaryData) {
                    setSummary(summaryData);
                }
                setTodayAppointments(appointmentsData || []);
            } catch (err) {
                const error = err as { message?: string; status?: number };
                
                if (error.status === 0) {
                    setError('O serviço está fora do ar no momento. Contate o administrador.');
                } else {
                    setError(error.message || 'Erro ao carregar dados. Tente novamente.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    };

    const formatChange = (value: number | undefined | null, isPercentage: boolean = false) => {
        if (value === undefined || value === null) return '+0';
        const formatted = isPercentage ? `${value.toFixed(1)}%` : value.toString();
        return value >= 0 ? `+${formatted}` : formatted;
    };

    const stats = summary ? [
        {
            label: 'Agendamentos Hoje',
            value: (summary.appointments_today ?? 0).toString(),
            change: formatChange(summary.appointments_today_change),
            changeType: (summary.appointments_today_change ?? 0) >= 0 ? 'positive' : 'negative',
            icon: Calendar,
        },
        {
            label: 'Clientes Ativos',
            value: (summary.active_clients ?? 0).toString(),
            change: formatChange(summary.active_clients_change),
            changeType: (summary.active_clients_change ?? 0) >= 0 ? 'positive' : 'negative',
            icon: Users,
        },
        {
            label: 'Receita do Mês',
            value: formatCurrency(summary.revenue_month ?? 0),
            change: formatChange(summary.revenue_month_change, true),
            changeType: (summary.revenue_month_change ?? 0) >= 0 ? 'positive' : 'negative',
            icon: DollarSign,
        },
        {
            label: 'Taxa de No-Show',
            value: `${(summary.no_show_rate ?? 0).toFixed(1)}%`,
            change: formatChange(summary.no_show_rate_change, true),
            changeType: (summary.no_show_rate_change ?? 0) <= 0 ? 'positive' : 'negative',
            icon: Clock,
        },
    ] : [];

    if (loading) {
        return (
            <div className={styles.dashboard}>
                <div className={styles.loadingState}>
                    <Loader2 size={32} className={styles.spinner} />
                    <p>Carregando dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.dashboard}>
                <div className={styles.errorState}>
                    <p>{error}</p>
                    <button onClick={() => window.location.reload()}>Tentar novamente</button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.dashboard}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Dashboard</h1>
                    <p className={styles.subtitle}>Visão geral do seu negócio</p>
                </div>
                <Link href="/dashboard/appointments/new" className={styles.newButton}>
                    <Calendar size={18} />
                    Novo Agendamento
                </Link>
            </div>

            {summary && (
                <div className={styles.statsGrid}>
                    {stats.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <div key={stat.label} className={styles.statCard}>
                                <div className={styles.statHeader}>
                                    <div className={styles.statIconWrapper}>
                                        <Icon size={20} />
                                    </div>
                                    <div className={`${styles.statChange} ${styles[stat.changeType]}`}>
                                        {stat.changeType === 'positive' ? (
                                            <TrendingUp size={14} />
                                        ) : (
                                            <TrendingDown size={14} />
                                        )}
                                        {stat.change}
                                    </div>
                                </div>
                                <div className={styles.statValue}>{stat.value}</div>
                                <div className={styles.statLabel}>{stat.label}</div>
                            </div>
                        );
                    })}
                </div>
            )}

            <div className={styles.contentGrid}>
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h2 className={styles.cardTitle}>Agenda de Hoje</h2>
                        <Link href="/dashboard/calendar" className={styles.cardLink}>
                            Ver tudo
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                    {todayAppointments.length === 0 ? (
                        <div className={styles.emptyState}>
                            <p>Nenhum agendamento para hoje</p>
                        </div>
                    ) : (
                        <div className={styles.appointmentsList}>
                            {todayAppointments.map((apt) => (
                                <div key={apt.id} className={styles.appointmentItem}>
                                    <div className={styles.appointmentTime}>{formatTime(apt.start_at)}</div>
                                    <div className={styles.appointmentDetails}>
                                        <div className={styles.appointmentClient}>{apt.client?.name || 'Cliente'}</div>
                                        <div className={styles.appointmentService}>
                                            {apt.service?.name || 'Serviço'} • {apt.staff?.name || 'Profissional'}
                                        </div>
                                    </div>
                                    <div className={styles.appointmentStatus}>
                                        <span className={`${styles.statusBadge} ${styles[apt.status]}`}>
                                            {apt.status === 'confirmed' ? 'Confirmado' : 
                                             apt.status === 'pending' ? 'Pendente' :
                                             apt.status === 'cancelled' ? 'Cancelado' : apt.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h2 className={styles.cardTitle}>Ações Rápidas</h2>
                    </div>
                    <div className={styles.quickActions}>
                        <Link href="/dashboard/services" className={styles.quickAction}>
                            <div className={styles.quickActionIcon}>✂️</div>
                            <span>Gerenciar Serviços</span>
                        </Link>
                        <Link href="/dashboard/staff" className={styles.quickAction}>
                            <div className={styles.quickActionIcon}>👥</div>
                            <span>Gerenciar Equipe</span>
                        </Link>
                        <Link href="/dashboard/clients" className={styles.quickAction}>
                            <div className={styles.quickActionIcon}>📋</div>
                            <span>Lista de Clientes</span>
                        </Link>
                        <Link href="/dashboard/settings" className={styles.quickAction}>
                            <div className={styles.quickActionIcon}>⚙️</div>
                            <span>Configurações</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
