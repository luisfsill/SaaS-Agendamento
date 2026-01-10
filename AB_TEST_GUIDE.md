# 🧪 Guia de A/B Teste - Demo Cards

## Objetivo
Validar se a nova narrativa converte melhor que a anterior, com dados reais.

---

## 📊 Hipótese de Teste

**H0 (Nula):** Não há diferença na conversão entre layout antigo e novo  
**H1 (Alternativa):** Layout novo converte +15% mais visitantes em trials

---

## 🎯 Métricas Primárias

| Métrica | Descrição | Como medir |
|---------|-----------|-----------|
| **CTR do botão** | % de visitantes que clicam no CTA | GA4: `demoClosingCta clicks` / sessões |
| **Taxa de conversão** | % de visitantes que chegam em `/register` | GA4: `/register` entrances |
| **Tempo na página** | Quanto tempo fica vendo os cards | GA4: Session Duration |
| **Bounceout no card** | Qual card faz sair sem converter | GA4: demo_card_viewed → not-converted |

---

## 🛠️ Setup GA4

### 1. Validar Eventos Customizados

**Ir para:** Google Analytics 4 → Configuração → Eventos Personalizados

Verificar se existem:
- ✅ `demo_card_viewed`
- ✅ `demo_card_next`
- ✅ `demo_card_prev`

Se não existirem, fazer isso:
1. Google Analytics 4 → Eventos
2. Criar evento customizado
3. Nome: `demo_card_viewed`
4. Parâmetros: `card_index`, `card_title`

### 2. Criar Segmento "Demo Card Users"

**Ir para:** Google Analytics 4 → Admin → Segmentos Customizados

```
Nome: "Demo Card Viewers"
Condição: 
  - Evento contém "demo_card"
  - OU página contém "/demo"
```

---

## 📈 Método de Teste (Split 50/50)

### **Opção 1: Feature Flag (Recomendado)**

```typescript
// frontend/lib/feature-flags.ts
export const useNewDemoCards = () => {
  const [flags, setFlags] = useState({ newCards: true });
  
  useEffect(() => {
    // Random 50/50
    setFlags(prev => ({
      ...prev,
      newCards: Math.random() > 0.5
    }));
  }, []);
  
  return flags.newCards;
};

// Em page.tsx:
const showNewCards = useNewDemoCards();
const demoCards = showNewCards ? NEW_CARDS : OLD_CARDS;
```

### **Opção 2: URL Parameter**

```
/?demo=new  → mostra nova narrativa
/?demo=old  → mostra narrativa antiga
```

Depois compartilhar:
- 50% dos links com `?demo=new`
- 50% dos links com `?demo=old`

---

## 📋 Checklist de Execução

- [ ] Deploy nova versão para staging
- [ ] Validar GA está rastreando eventos
- [ ] Ativar split 50/50 em produção
- [ ] Duração: **mínimo 2 semanas**
- [ ] Mínimo 100+ conversões em cada grupo
- [ ] Coletar dados

---

## 📊 Análise dos Resultados

### Dia 3 (check-in inicial)
```
Visitantes: 500
Demo card viewers: 300 (60%)
- Novo: 150
- Antigo: 150

Taxa de clique CTA:
- Novo: 24 cliques (16%)
- Antigo: 18 cliques (12%)
→ Novo está 33% melhor! Continue monitorando...
```

### Dia 14 (final do teste)
```
Visitantes: 4,000
Conversão em trial:
- Novo: 320 pessoas (8%)
- Antigo: 280 pessoas (7%)

Chi-square test: p=0.08 (não significativo ainda)
→ Precisa mais dados ou mudar narrativa
```

---

## 🔍 Análise Qualitativa (Complementar)

### Fazer Pesquisa com Usuários
```
1. Recrutar 5-10 usuários
2. Mostrar novo fluxo de cards
3. Perguntar:
   - "Qual card convenceu mais?"
   - "Em qual card parou para pensar?"
   - "Qual problema identificou melhor?"
4. Documentar feedback
```

---

## ⚠️ Armadilhas Comuns

❌ **Não fazer:**
- Mudar narrativa toda semana (não há dados suficientes)
- Rodar teste por apenas 3 dias (variação muito alta)
- Testar mais de 2 variantes ao mesmo tempo (confunde)
- Não fechar o teste (continuar com "o que ganha")

✅ **Fazer:**
- Rodar 2+ semanas no mínimo
- Ter 100+ conversões em cada braço
- Testar somente 2 versões por vez
- Documentar decisão final

---

## 📝 Template de Relatório Final

```markdown
# Resultado do A/B Teste - Demo Cards

**Duração:** 14 dias (10-24 Jan, 2026)
**Variantes:** Narrativa Antiga vs Narrativa Nova

## Resultados

| Métrica | Antigo | Novo | Delta | P-value |
|---------|--------|------|-------|---------|
| Taxa de conversão | 7.2% | 8.8% | +22% | 0.04 ✅ |
| Tempo médio | 45s | 52s | +16% | 0.001 ✅ |
| Bounce rate | 35% | 31% | -11% | 0.08 ⚠️ |

## Conclusão
A narrativa nova converte **22% melhor** (p<0.05). 
**Decisão:** Remover narrativa antiga, manter nova.

## Recomendações
1. Manter novo fluxo em produção
2. Testar novo color scheme (gradientes diferentes por card)
3. Adicionar vídeo no Card 0 (próxima iteração)
```

---

## 🚀 Depois do Teste

### Se Novo Ganha (>15% melhoria, p<0.05):
1. ✅ Deploy em 100% produção
2. ✅ Documentar aprendizados
3. ✅ Proxima iteração: color hierarchy, vídeos

### Se Antigo Ganha (ou empate):
1. ❌ Reverter para narrativa antiga
2. 🔄 Analisar por quê novo não funcionou
3. 🎯 Testar hipótese alternativa (ex: botão maior, copy diferente)

### Se Ambos Iguais:
1. ❓ Rodar mais 2 semanas com mais tráfego
2. 🔍 Analisar segmentos (mobile vs desktop, novo vs returning)
3. 💭 Considerar que diferença é mínima (manter novo = mais rápido)

---

## 📞 Contato para Dúvidas

Qualquer pergunta, abrir issue no repositório ou chamar no Slack.

---

**Última atualização:** 10 de janeiro de 2026  
**Autor:** GitHub Copilot  
**Status:** Pronto para rodar
