'use client';

import { useState, useEffect } from 'react';
import { Save, Loader2, Webhook, Server, Key, AlertCircle, CheckCircle } from 'lucide-react';
import styles from './settings.module.css';

interface GlobalSettings {
  uazapi_url: string;
  uazapi_admin_token: string;
  default_webhook_url: string;
  webhook_events: string[];
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<GlobalSettings>({
    uazapi_url: '',
    uazapi_admin_token: '',
    default_webhook_url: '',
    webhook_events: ['messages', 'connection'],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showToken, setShowToken] = useState(false);

  useEffect(() => {
    // Carrega configurações atuais
    // Em produção, isso viria de uma API ou banco de dados
    setTimeout(() => {
      setSettings({
        uazapi_url: process.env.NEXT_PUBLIC_UAZAPI_URL || 'https://lfsystem.uazapi.com',
        uazapi_admin_token: '***************************', // Mascarado por segurança
        default_webhook_url: process.env.NEXT_PUBLIC_UAZAPI_WEBHOOK_URL || '',
        webhook_events: ['messages', 'connection'],
      });
      setLoading(false);
    }, 500);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      // Simula salvamento
      // Em produção, isso salvaria em um banco de dados ou arquivo de configuração
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setMessage({
        type: 'success',
        text: 'Configurações salvas com sucesso! Reinicie o servidor para aplicar as mudanças.',
      });
    } catch {
      setMessage({
        type: 'error',
        text: 'Erro ao salvar configurações. Tente novamente.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleEventToggle = (event: string) => {
    setSettings((prev) => ({
      ...prev,
      webhook_events: prev.webhook_events.includes(event)
        ? prev.webhook_events.filter((e) => e !== event)
        : [...prev.webhook_events, event],
    }));
  };

  const webhookEventOptions = [
    { id: 'messages', label: 'Mensagens', description: 'Mensagens enviadas e recebidas' },
    { id: 'connection', label: 'Conexão', description: 'Mudanças de status da conexão' },
    { id: 'messages_update', label: 'Atualização de Mensagens', description: 'Status de entrega e leitura' },
    { id: 'chats', label: 'Chats', description: 'Atualizações de conversas' },
    { id: 'contacts', label: 'Contatos', description: 'Atualizações de contatos' },
  ];

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader2 size={32} className={styles.spinner} />
        <p>Carregando configurações...</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Configurações Globais</h1>
        <p className={styles.subtitle}>Configure as integrações do sistema</p>
      </div>

      {message && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {message.text}
        </div>
      )}

      {/* UAZAPI Configuration */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <Server size={24} />
          <div>
            <h2 className={styles.sectionTitle}>Servidor UAZAPI</h2>
            <p className={styles.sectionDesc}>Configurações de conexão com o servidor WhatsApp</p>
          </div>
        </div>

        <div className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>URL do Servidor</label>
            <input
              type="url"
              className={styles.input}
              value={settings.uazapi_url}
              onChange={(e) => setSettings({ ...settings, uazapi_url: e.target.value })}
              placeholder="https://seu-servidor.uazapi.com"
            />
            <span className={styles.hint}>Exemplo: https://lfsystem.uazapi.com</span>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>
              <Key size={14} />
              Admin Token
            </label>
            <div className={styles.inputGroup}>
              <input
                type={showToken ? 'text' : 'password'}
                className={styles.input}
                value={settings.uazapi_admin_token}
                onChange={(e) => setSettings({ ...settings, uazapi_admin_token: e.target.value })}
                placeholder="Token de administrador"
              />
              <button
                type="button"
                className={styles.toggleButton}
                onClick={() => setShowToken(!showToken)}
              >
                {showToken ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
            <span className={styles.hint}>
              Token de administrador para criar e gerenciar instâncias
            </span>
          </div>
        </div>
      </section>

      {/* Webhook Configuration */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <Webhook size={24} />
          <div>
            <h2 className={styles.sectionTitle}>Webhook Padrão</h2>
            <p className={styles.sectionDesc}>
              URL padrão para receber eventos de todas as instâncias
            </p>
          </div>
        </div>

        <div className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>URL do Webhook</label>
            <input
              type="url"
              className={styles.input}
              value={settings.default_webhook_url}
              onChange={(e) => setSettings({ ...settings, default_webhook_url: e.target.value })}
              placeholder="https://seu-backend.com/webhook/whatsapp"
            />
            <span className={styles.hint}>
              Esta URL será configurada automaticamente para novas instâncias
            </span>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Eventos do Webhook</label>
            <div className={styles.checkboxGroup}>
              {webhookEventOptions.map((option) => (
                <label key={option.id} className={styles.checkboxItem}>
                  <input
                    type="checkbox"
                    checked={settings.webhook_events.includes(option.id)}
                    onChange={() => handleEventToggle(option.id)}
                  />
                  <div>
                    <span className={styles.checkboxLabel}>{option.label}</span>
                    <span className={styles.checkboxDesc}>{option.description}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Info Box */}
      <div className={styles.infoBox}>
        <AlertCircle size={20} />
        <div>
          <strong>Importante:</strong> Alterações nestas configurações afetam todo o sistema.
          Após salvar, você precisará reiniciar o servidor para aplicar as mudanças nas variáveis de ambiente.
        </div>
      </div>

      {/* Save Button */}
      <div className={styles.actions}>
        <button className={styles.saveButton} onClick={handleSave} disabled={saving}>
          {saving ? (
            <Loader2 size={18} className={styles.spinner} />
          ) : (
            <Save size={18} />
          )}
          {saving ? 'Salvando...' : 'Salvar Configurações'}
        </button>
      </div>
    </div>
  );
}
