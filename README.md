# ☀️ Yello Solar Hub - Gestão Solar Acessível

**Sistema de gestão solar fotovoltaica** para o mercado brasileiro com foco em **acessibilidade completa** e **inteligência artificial**.

App React 19 para dimensionamento de sistemas solares, cálculo de kits, análise de consumo e financiamento, com integração OpenAI (ChatGPT, Whisper) e seguindo WAI-ARIA APG e WCAG 2.2. Interface 100% em português brasileiro com suporte completo para leitores de tela, navegação por teclado e dispositivos móveis.

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

- **React 19** - Framework UI
- **TypeScript** - Type safety
- **Vite 7** - Build tool e dev server
- **Tailwind CSS v4** - Styling
- **Radix UI** - Componentes acessíveis primitivos
- **Framer Motion** - Animações
- **OpenAI API** - ChatGPT, Whisper, Assistants
- **ESLint + jsx-a11y** - Linting com regras de acessibilidade

## ♿ Acessibilidade

Este projeto implementa **diretrizes completas de acessibilidade** seguindo:
- [WAI-ARIA Authoring Practices Guide (APG)](https://www.w3.org/WAI/ARIA/apg/)
- WCAG 2.2 (Web Content Accessibility Guidelines)
- Mega prompts de UI (Interações, Animação, Layout, Conteúdo, Performance e Design)

### Principais Features de Acessibilidade

✅ **Navegação por Teclado**: Cobertura completa, focus trap em modais, atalhos  
✅ **Alvos de Toque**: 24×24px mínimo (44×44px no mobile)  
✅ **Formulários**: Validação inline, sem bloqueio de colar, foco em erros  
✅ **Animações**: Respeita `prefers-reduced-motion`, apenas transform/opacity  
✅ **Screen Readers**: aria-live, labels corretos, hierarquia semântica  
✅ **Mobile**: Inputs ≥16px, zoom nunca desabilitado, touch-action  
✅ **Foco Visível**: :focus-visible em todos os elementos interativos  

📖 [Documentação Completa de Acessibilidade](./ACCESSIBILITY.md)

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

# Lint
npm run lint

# Preview do build
npm run preview
```

Abra [http://localhost:5173](http://localhost:5173) para ver a aplicação.

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

## 📁 Estrutura do Projeto

```
boldsbrain/
├── src/
│   ├── components/          # Componentes acessíveis reutilizáveis
│   │   ├── Button.tsx      # Botão com touch targets corretos
│   │   ├── Input.tsx       # Input com validação inline
│   │   ├── Link.tsx        # Link semântico
│   │   ├── Modal.tsx       # Modal com focus trap
│   │   └── Toast.tsx       # Notificações com aria-live
│   ├── widgets/             # Widgets principais da aplicação
│   │   ├── FormularioConsumo.tsx
│   │   ├── CenariosWidget.tsx
│   │   ├── FinanciamentoWidget.tsx
│   │   ├── NotaRegulatoria14300.tsx
│   │   └── ChatWidget.tsx
│   ├── lib/                # Utilitários e lógica
│   │   ├── solar-calculations.ts
│   │   └── openai-integration.ts
│   ├── types/              # Tipos TypeScript
│   │   └── solar.ts
│   ├── hooks/              # React hooks
│   │   ├── useFocus.ts     # Gerenciamento de foco
│   │   ├── useForm.ts      # Estado e validação de formulários
│   │   └── useToast.ts     # Notificações
│   ├── utils/              # Utilitários
│   │   ├── accessibility.ts # Funções de acessibilidade
│   │   └── animation.ts    # Animações acessíveis
│   ├── App.tsx             # Componente principal
│   ├── main.tsx            # Entry point
│   └── index.css           # Estilos globais com regras a11y
├── ACCESSIBILITY.md        # Documentação de acessibilidade
├── GUIA_DE_USO.md         # Guia de uso completo
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## 🧪 Testes de Acessibilidade

```bash
# Executar linter com regras jsx-a11y
npm run lint
```

### Testes Manuais Recomendados

- ⌨️ Navegação por teclado (Tab, Escape, Enter, Setas)
- 🖱️ Tamanhos de alvo (24×24px desktop, 44×44px mobile)
- 📱 Mobile (zoom, font-size de inputs, touch-action)
- 🎭 Screen reader (VoiceOver, NVDA, JAWS)
- 🎨 Contraste (4.5:1 mínimo)
- 🎬 Animações (testar com prefers-reduced-motion)

## 🎯 Próximos Passos

- [ ] Integração com API de CEP para dados de irradiação regional
- [ ] Sistema de orçamentos e propostas PDF
- [ ] Backend para gerenciar API keys de forma segura
- [ ] Integração com CRMs
- [ ] Sistema de agendamento de visitas técnicas
- [ ] Catálogo de kits solares reais
- [ ] Calculadora de financiamento personalizada
- [ ] Modo escuro

## 📚 Recursos

- [Documentação de Acessibilidade](./ACCESSIBILITY.md)
- [Guia de Uso](./GUIA_DE_USO.md)
- [WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/)
- [WCAG 2.2](https://www.w3.org/WAI/WCAG22/quickref/)
- [React 19 Docs](https://react.dev/)
- [Tailwind CSS v4 Docs](https://tailwindcss.com/)

## 🤝 Contribuindo

1. Siga as [diretrizes de acessibilidade](./ACCESSIBILITY.md)
2. Use os componentes e hooks existentes
3. Teste com teclado e screen reader
4. Execute `npm run lint` antes de commit

## 📄 Licença

ISC

---

Desenvolvido com ⚡ e ☀️ para democratizar a energia solar no Brasil, seguindo as melhores práticas de acessibilidade web com GitHub Copilot como pair programmer.
