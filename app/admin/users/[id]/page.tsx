'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  Loader2,
  Save,
  Trash2,
  Building2,
  Shield,
  Lock,
  Key,
  Eye,
  EyeOff,
} from 'lucide-react';
import Link from 'next/link';
import styles from './edit.module.css';

interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'manager' | 'staff';
  status: 'active' | 'inactive' | 'suspended';
  tenant_id: string;
  tenant_name: string;
  created_at: string;
  last_login: string | null;
  avatar_url: string | null;
}

export default function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Simula carregamento do usuário
    setTimeout(() => {
      setUserData({
        id: id,
        name: 'Maria Silva',
        email: 'maria@bellavista.com',
        phone: '(11) 99999-9999',
        role: 'admin',
        status: 'active',
        tenant_id: 'tenant-1',
        tenant_name: 'Salão Bella Vista',
        created_at: '2024-01-15T10:30:00',
        last_login: '2024-12-19T14:25:00',
        avatar_url: null,
      });
      setLoading(false);
    }, 500);
  }, [id]);

  const handleSave = async () => {
    if (!userData) return;

    if (showPasswordFields) {
      if (newPassword !== confirmPassword) {
        setMessage({ type: 'error', text: 'As senhas não conferem.' });
        return;
      }
      if (newPassword.length < 6) {
        setMessage({ type: 'error', text: 'A senha deve ter pelo menos 6 caracteres.' });
        return;
      }
    }

    setSaving(true);
    setMessage(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setMessage({ type: 'success', text: 'Alterações salvas com sucesso!' });
      setShowPasswordFields(false);
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      setMessage({ type: 'error', text: 'Erro ao salvar alterações.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      router.push('/admin/users');
    } catch {
      setMessage({ type: 'error', text: 'Erro ao excluir usuário.' });
    }
  };

  const updateField = (field: keyof UserData, value: string) => {
    if (userData) {
      setUserData({ ...userData, [field]: value });
    }
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'admin':
        return styles.roleAdmin;
      case 'manager':
        return styles.roleManager;
      default:
        return styles.roleStaff;
    }
  };

  if (loading || !userData) {
    return (
      <div className={styles.loadingContainer}>
        <Loader2 size={32} className={styles.spinner} />
        <p>Carregando dados do usuário...</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Link href="/admin/users" className={styles.backButton}>
          <ArrowLeft size={20} />
          Voltar
        </Link>
        <div className={styles.headerInfo}>
          <h1 className={styles.title}>Editar Usuário</h1>
          <p className={styles.subtitle}>ID: {userData.id}</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.deleteButton} onClick={handleDelete}>
            <Trash2 size={18} />
            Excluir
          </button>
          <button className={styles.saveButton} onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 size={18} className={styles.spinner} /> : <Save size={18} />}
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>

      {message && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          {message.text}
        </div>
      )}

      <div className={styles.content}>
        {/* Info Cards */}
        <div className={styles.infoCards}>
          <div className={styles.infoCard}>
            <Building2 size={24} />
            <div>
              <span className={styles.infoValue}>{userData.tenant_name}</span>
              <span className={styles.infoLabel}>Empresa</span>
            </div>
          </div>
          <div className={styles.infoCard}>
            <Calendar size={24} />
            <div>
              <span className={styles.infoValue}>
                {new Date(userData.created_at).toLocaleDateString('pt-BR')}
              </span>
              <span className={styles.infoLabel}>Criado em</span>
            </div>
          </div>
          <div className={styles.infoCard}>
            <User size={24} />
            <div>
              <span className={styles.infoValue}>
                {userData.last_login
                  ? new Date(userData.last_login).toLocaleDateString('pt-BR')
                  : 'Nunca'}
              </span>
              <span className={styles.infoLabel}>Último Acesso</span>
            </div>
          </div>
        </div>

        <div className={styles.formGrid}>
          {/* User Info */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <User size={20} />
              Informações Pessoais
            </h2>
            <div className={styles.form}>
              <div className={styles.field}>
                <label className={styles.label}>Nome Completo</label>
                <input
                  type="text"
                  className={styles.input}
                  value={userData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>
                  <Mail size={14} />
                  Email
                </label>
                <input
                  type="email"
                  className={styles.input}
                  value={userData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>
                  <Phone size={14} />
                  Telefone
                </label>
                <input
                  type="tel"
                  className={styles.input}
                  value={userData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* Role & Status */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Shield size={20} />
              Permissões e Status
            </h2>
            <div className={styles.form}>
              <div className={styles.field}>
                <label className={styles.label}>Cargo</label>
                <select
                  className={`${styles.select} ${getRoleBadgeClass(userData.role)}`}
                  value={userData.role}
                  onChange={(e) => updateField('role', e.target.value)}
                >
                  <option value="admin">Administrador</option>
                  <option value="manager">Gerente</option>
                  <option value="staff">Funcionário</option>
                </select>
                <span className={styles.hint}>
                  {userData.role === 'admin' && 'Acesso total ao sistema'}
                  {userData.role === 'manager' && 'Pode gerenciar agendamentos e equipe'}
                  {userData.role === 'staff' && 'Acesso básico para realizar atendimentos'}
                </span>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Status</label>
                <select
                  className={styles.select}
                  value={userData.status}
                  onChange={(e) => updateField('status', e.target.value)}
                >
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                  <option value="suspended">Suspenso</option>
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>
                  <Building2 size={14} />
                  Empresa
                </label>
                <input
                  type="text"
                  className={styles.input}
                  value={userData.tenant_name}
                  disabled
                />
                <span className={styles.hint}>
                  Para mudar a empresa, use a transferência de usuário
                </span>
              </div>
            </div>
          </section>

          {/* Password */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Lock size={20} />
              Segurança
            </h2>
            <div className={styles.form}>
              {!showPasswordFields ? (
                <button
                  type="button"
                  className={styles.changePasswordButton}
                  onClick={() => setShowPasswordFields(true)}
                >
                  <Key size={18} />
                  Alterar Senha
                </button>
              ) : (
                <>
                  <div className={styles.field}>
                    <label className={styles.label}>Nova Senha</label>
                    <div className={styles.inputGroup}>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className={styles.input}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Mínimo 6 caracteres"
                      />
                      <button
                        type="button"
                        className={styles.toggleButton}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Confirmar Senha</label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className={styles.input}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Digite a senha novamente"
                    />
                  </div>
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={() => {
                      setShowPasswordFields(false);
                      setNewPassword('');
                      setConfirmPassword('');
                    }}
                  >
                    Cancelar alteração de senha
                  </button>
                </>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
