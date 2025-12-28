'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Calendar, Clock, User, MoreVertical, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui';
import { api, ApiError } from '@/lib/api';
import styles from './appointments.module.css';

interface Appointment {
    id: string;
    client_name: string;
    client_phone: string;
    service_name: string;
    staff_name: string;
    start_at: string;
    end_at: string;
    status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
}

const statusConfig = {
    scheduled: { label: 'Agendado', icon: Clock, color: 'warning' },
    confirmed: { label: 'Confirmado', icon: CheckCircle, color: 'success' },
    completed: { label: 'Concluído', icon: CheckCircle, color: 'success' },
    cancelled: { label: 'Cancelado', icon: XCircle, color: 'error' },
    no_show: { label: 'Não compareceu', icon: AlertCircle, color: 'error' },
};

export default function AppointmentsPage() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        loadAppointments();
    }, [selectedDate]);

    const loadAppointments = async () => {
        setIsLoading(true);
        try {
            const data = await api.get<Appointment[]>(`/dashboard/day?date=${selectedDate}`);
            setAppointments(data);
            setError(null);
        } catch (err) {
            const apiError = err as ApiError;
            
            if (apiError.status === 0) {
                setError('O serviço está fora do ar no momento. Contate o administrador.');
            } else {
                setError(apiError.message || 'Erro ao carregar agendamentos. Tente novamente.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = async (id: string) => {
        if (!confirm('Tem certeza que deseja cancelar este agendamento?')) return;
        try {
            await api.post(`/appointments/${id}/cancel`);
            setAppointments(appointments.map(a => a.id === id ? { ...a, status: 'cancelled' as const } : a));
        } catch (err) {
            const apiError = err as ApiError;
            
            if (apiError.status === 0) {
                alert('O serviço está fora do ar no momento. Contate o administrador.');
            } else {
                alert(apiError.message || 'Erro ao cancelar agendamento. Tente novamente.');
            }
        }
    };

    const formatDateTime = (dateStr: string) => {
        const date = new Date(dateStr);
        return {
            date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
            time: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        };
    };

    const filteredAppointments = appointments.filter(apt => {
        const matchesSearch = apt.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            apt.service_name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Agendamentos</h1>
                    <p className={styles.subtitle}>Gerencie todos os agendamentos</p>
                </div>
            </div>

            <div className={styles.toolbar}>
                <div className={styles.searchWrapper}>
                    <Search size={18} className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Buscar cliente ou serviço..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>
                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className={styles.dateInput}
                />
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className={styles.filterSelect}
                >
                    <option value="all">Todos os status</option>
                    <option value="scheduled">Agendado</option>
                    <option value="confirmed">Confirmado</option>
                    <option value="completed">Concluído</option>
                    <option value="cancelled">Cancelado</option>
                    <option value="no_show">Não compareceu</option>
                </select>
            </div>

            {isLoading ? (
                <div className={styles.loadingState}>
                    <Loader2 size={32} className={styles.spinner} />
                    <span>Carregando agendamentos...</span>
                </div>
            ) : error ? (
                <div className={styles.errorState}>
                    <p>{error}</p>
                    <Button variant="secondary" onClick={loadAppointments}>Tentar novamente</Button>
                </div>
            ) : filteredAppointments.length === 0 ? (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>📅</div>
                    <h3>Nenhum agendamento encontrado</h3>
                    <p>{searchQuery || statusFilter !== 'all' ? 'Tente filtros diferentes' : 'Os agendamentos aparecerão aqui'}</p>
                </div>
            ) : (
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Data/Hora</th>
                                <th>Cliente</th>
                                <th>Serviço</th>
                                <th>Profissional</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAppointments.map((apt) => {
                                const { date, time } = formatDateTime(apt.start_at);
                                const status = statusConfig[apt.status];
                                const StatusIcon = status.icon;

                                return (
                                    <tr key={apt.id}>
                                        <td>
                                            <div className={styles.dateTime}>
                                                <span className={styles.date}>{date}</span>
                                                <span className={styles.time}>{time}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className={styles.client}>
                                                <span className={styles.clientName}>{apt.client_name}</span>
                                                <span className={styles.clientPhone}>{apt.client_phone}</span>
                                            </div>
                                        </td>
                                        <td>{apt.service_name}</td>
                                        <td>{apt.staff_name}</td>
                                        <td>
                                            <span className={`${styles.statusBadge} ${styles[status.color]}`}>
                                                <StatusIcon size={14} />
                                                {status.label}
                                            </span>
                                        </td>
                                        <td>
                                            {apt.status === 'scheduled' || apt.status === 'confirmed' ? (
                                                <button className={styles.actionButton} onClick={() => handleCancel(apt.id)}>
                                                    <XCircle size={16} />
                                                </button>
                                            ) : null}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
