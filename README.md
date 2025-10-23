# ☀️ Yello Solar Hub - Copiloto Inteligente para Energia Solar

App React 19 para gestão e dimensionamento de sistemas solares fotovoltaicos no Brasil. Desenvolvido com TypeScript, Tailwind CSS v4, e integração com OpenAI (ChatGPT, Whisper, Assistants API) para assistência inteligente.

## 🚀 Funcionalidades

### Widgets Principais

1. **📊 Análise de Conta de Energia**
   - Formulário simplificado (CEP, consumo médio kWh, fase elétrica)
   - Validação de dados de entrada
   - Cálculo automático de tarifa

2. **🎯 Dimensionamento de Sistema Solar**
   - 3 cenários com diferentes Performance Ratios (PR):
     - **Conservador (PR 1.14)**: Mais perdas, cenário seguro
     - **Realista (PR 1.30)**: Baseado em instalações reais no Brasil
     - **Otimista (PR 1.45)**: Condições ideais de geração
   - Cálculo de:
     - Potência necessária (kWp)
     - Número de módulos
     - Área ocupada (m²)
     - Geração mensal estimada (kWh)

3. **💰 Opções de Financiamento**
   - **À Vista**: Melhor ROI, sem juros
   - **Financiado**: Simulação com entrada e parcelas
   - **Assinatura Solar**: Sem investimento inicial
   - **Geração Compartilhada (GC)**: Para quem não tem telhado
   - Comparação: Parcela vs Conta de Luz

4. **📈 Análise Financeira**
   - Cálculo de ROI (Return on Investment)
   - Payback (tempo de retorno)
   - Economia anual e total em 25 anos
   - Considera degradação de 0,5% ao ano

5. **💬 Chat Inteligente com IA**
   - Integração com OpenAI GPT-4
   - Assistente especializado em energia solar
   - Explica jargões técnicos
   - Orientação sobre Lei 14.300/2022

6. **🎤 Reconhecimento de Voz**
   - Integração com OpenAI Whisper
   - Transcrição em português brasileiro
   - Interface de gravação intuitiva

7. **📋 Nota Regulatória - Lei 14.300/2022**
   - Classificação: Micro/Minigeração
   - Modalidades de geração
   - Validade de créditos (60 meses)
   - Orientações sobre TUSD Fio B

### 🌍 Impacto Ambiental
- Cálculo de CO₂ evitado
- Equivalência em árvores plantadas

## 🛠️ Tecnologias

- **React 19** (RC) - Framework UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS v4** - Styling
- **Radix UI** - Componentes acessíveis
- **Framer Motion** - Animações (disponível)
- **OpenAI API** - ChatGPT, Whisper, Assistants

## 📦 Instalação

```bash
# Clone o repositório
git clone https://github.com/own-boldsbrain/boldsbrain.git
cd boldsbrain

# Instale as dependências
npm install

# Execute em modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## 🔑 Configuração OpenAI (Opcional)

Para usar o chat inteligente e reconhecimento de voz:

1. Obtenha sua API Key em: https://platform.openai.com/api-keys
2. Configure na interface do aplicativo
3. A chave é usada apenas na sessão atual (não é armazenada)

**Nota**: Em produção, recomenda-se usar um backend para gerenciar as chamadas à API OpenAI.

## 📊 Cálculos e Fórmulas

### Dimensionamento
```
Potência (kWp) = Consumo Diário (kWh) / (Irradiação Solar × PR)
Geração Mensal = Potência × Irradiação × PR × 30 dias
```

### Constantes
- Irradiação média Brasil: **5.0 kWh/m²/dia**
- Potência módulo padrão: **550W**
- Área por módulo: **2.6 m²**
- Vida útil sistema: **25 anos**
- Degradação anual: **0.5%**
- Tarifa média Brasil: **R$ 0,89/kWh**

### Performance Ratio (PR)
Índice que mede a eficiência real do sistema, considerando perdas:
- Temperatura dos módulos
- Sujeira e sombreamento
- Perdas em cabos e conexões
- Eficiência do inversor
- Descasamento entre módulos

## 📖 Lei 14.300/2022

Marco legal da micro e minigeração distribuída:

- **Microgeração**: Até 75 kWp
- **Minigeração**: 75 kWp até 5 MW
- **Créditos**: Validade de 60 meses
- **Modalidades**:
  - Consumo Local (autoconsumo)
  - Autoconsumo Remoto
  - Geração Compartilhada
  - Múltiplas Unidades Consumidoras

### Impacto da Lei
- Sistemas até 12/01/2023: isenção de tarifas mantida
- Novos sistemas: cobrança gradual de TUSD Fio B (até 90% em 2029)
- Sistema de compensação regulamentado pela ANEEL

## 🎨 Interface

- **100% em Português Brasileiro (pt-BR)**
- Design responsivo (mobile-first)
- Cores: Gradiente amarelo/laranja (solar)
- CTAs curtos e objetivos
- Explicação de jargões técnicos inline
- Acessibilidade com Radix UI

## 🗂️ Estrutura do Projeto

```
boldsbrain/
├── src/
│   ├── components/      # Componentes reutilizáveis
│   ├── widgets/         # Widgets principais
│   │   ├── FormularioConsumo.tsx
│   │   ├── CenariosWidget.tsx
│   │   ├── FinanciamentoWidget.tsx
│   │   ├── NotaRegulatoria14300.tsx
│   │   └── ChatWidget.tsx
│   ├── lib/            # Utilitários e lógica
│   │   ├── solar-calculations.ts
│   │   └── openai-integration.ts
│   ├── types/          # Tipos TypeScript
│   │   └── solar.ts
│   ├── hooks/          # Custom hooks
│   ├── App.tsx         # Componente principal
│   ├── main.tsx        # Entry point
│   └── index.css       # Estilos globais
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## 🎯 Próximos Passos

- [ ] Integração com API de CEP para dados de irradiação regional
- [ ] Sistema de orçamentos e propostas PDF
- [ ] Backend para gerenciar API keys de forma segura
- [ ] Integração com CRMs
- [ ] Sistema de agendamento de visitas técnicas
- [ ] Catálogo de kits solares reais
- [ ] Calculadora de financiamento personalizada
- [ ] Modo escuro

## 📄 Licença

ISC

## 🤝 Contribuindo

Contribuições são bem-vindas! Este projeto foi desenvolvido com GitHub Copilot como pair programmer.

---

Desenvolvido com ⚡ e ☀️ para democratizar a energia solar no Brasil
