# 📖 Guia de Uso - Yello Solar Hub

## 🚀 Início Rápido

### 1. Instalação e Execução

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Aplicação estará disponível em http://localhost:5173
```

### 2. Uso Básico (sem OpenAI)

Você pode usar todas as funcionalidades de cálculo sem configurar a API da OpenAI:

1. Clique em "Pular" na tela de configuração da API
2. Preencha o formulário com:
   - **CEP**: Código postal da instalação (ex: 01310-100)
   - **Consumo médio mensal**: Valor em kWh da sua conta de luz (ex: 350)
   - **Tipo de instalação**: Monofásico, Bifásico ou Trifásico
   - **Tarifa** (opcional): Valor R$/kWh (padrão: R$ 0,89)
3. Clique em "Calcular Dimensionamento ⚡"

### 3. Uso Avançado (com OpenAI)

Para usar o chat inteligente e reconhecimento de voz:

1. Obtenha uma API Key em: https://platform.openai.com/api-keys
2. Configure no campo "🔑 Configuração OpenAI"
3. Clique em "Configurar"
4. Use o chat para fazer perguntas sobre energia solar
5. Use o botão 🎤 para enviar mensagens por voz

## 📊 Entendendo os Resultados

### Cenários de Dimensionamento

O sistema apresenta 3 cenários baseados em diferentes Performance Ratios (PR):

#### 🟡 Conservador (PR 1.14)
- **Perdas**: 12% do total teórico
- **Quando usar**: Cenário mais seguro, considera mais perdas
- **Ideal para**: Regiões com muita poeira, sombreamento ou temperatura elevada

#### 🟢 Realista (PR 1.30) - **Recomendado**
- **Perdas**: 23% do total teórico
- **Quando usar**: Baseado em sistemas reais no Brasil
- **Ideal para**: Maioria dos casos, instalações bem executadas

#### 🔵 Otimista (PR 1.45)
- **Perdas**: 31% do total teórico
- **Quando usar**: Condições ideais (limpeza frequente, sem sombreamento)
- **Ideal para**: Estimativa de melhor caso possível

### Análise Financeira

Para cada cenário, o sistema calcula:

- **Investimento Total**: Custo do sistema (R$ 4.500/kWp)
- **Payback**: Tempo para recuperar o investimento
- **ROI**: Retorno percentual em 25 anos
- **Economia Anual**: Quanto você economiza por ano
- **Economia Total**: Economia em 25 anos (considerando degradação)

### Opções de Financiamento

#### 💳 À Vista
- Melhor custo-benefício
- Sem juros
- Payback mais rápido

#### 📊 Financiado
- Entrada configurável (use o slider)
- Parcelas configuráveis (12 a 120 meses)
- Taxa de juros: 12% a.a.
- Compare: parcela + conta mínima vs conta atual

#### ⚡ Assinatura
- Sem investimento inicial
- Mensalidade 15% menor que a conta atual
- Ideal para quem não quer investir

#### 🏘️ Geração Compartilhada (GC)
- Para quem não tem telhado adequado
- Mensalidade 20% menor que a conta atual
- Você "aluga" parte de uma usina solar

## ⚖️ Lei 14.300/2022

### O que você precisa saber:

#### Classificação do Sistema
- **Microgeração**: até 75 kWp (maioria residencial)
- **Minigeração**: 75 kWp até 5 MW (comercial/industrial)

#### Créditos Energéticos
- Validade: **60 meses**
- Use em até 5 anos após a geração
- Podem ser compartilhados entre unidades (mesmo CPF/CNPJ)

#### Tarifação (sistemas novos após 12/01/2023)
- **2023-2024**: 15% TUSD Fio B
- **2024-2029**: Cobrança gradual até 90%
- **Sistemas antigos**: Mantêm isenção

#### Modalidades Disponíveis
1. **Consumo Local**: Geração e consumo no mesmo local
2. **Autoconsumo Remoto**: Gera em um local, usa em outro (mesmo titular)
3. **Geração Compartilhada**: Múltiplos consumidores, uma usina
4. **Múltiplas Unidades**: Condomínios e empreendimentos

## 🧮 Como são feitos os Cálculos

### Dimensionamento

```
Consumo Diário = Consumo Mensal / 30
Potência (kWp) = Consumo Diário / (Irradiação Solar / PR)
Nº Módulos = Potência / Potência por Módulo (550W)
Área = Nº Módulos × 2.6 m²
```

### Geração Estimada

```
Geração Mensal = Potência × Irradiação × (1/PR) × 30 dias
```

### Análise Financeira

```
Custo Sistema = Potência × R$ 4.500/kWp
Economia Mensal = Geração × Tarifa
Payback = Custo / (Economia × 12)
ROI = ((Economia 25 anos) - Custo) / Custo × 100
```

### Degradação

O sistema considera degradação anual de 0.5%:
- Ano 1: 100% da capacidade
- Ano 10: 95.1% da capacidade
- Ano 25: 88.2% da capacidade

## 🌍 Impacto Ambiental

### Cálculos Apresentados

- **CO₂ Evitado**: 0.0817 kg CO₂/kWh (fator SIN Brasil)
- **Árvores Equivalentes**: 1 árvore absorve ~12kg CO₂/ano

Exemplo para 350 kWh/mês:
```
CO₂/ano = 350 × 12 × 0.0817 = 343 kg
Árvores = 343 / 12 × 7 = 2.402 árvores
```

## 💬 Usando o Chat Inteligente

O copiloto pode ajudar com:

1. **Dúvidas sobre dimensionamento**
   - "Quantos painéis preciso para 500 kWh/mês?"
   - "Qual a diferença entre os cenários?"

2. **Explicações técnicas**
   - "O que é kWp?"
   - "Como funciona o Performance Ratio?"

3. **Regulamentação**
   - "Explica a Lei 14.300"
   - "Quanto tempo valem os créditos?"

4. **Financiamento**
   - "Vale a pena financiar?"
   - "Qual a melhor opção para mim?"

5. **Modalidades**
   - "O que é geração compartilhada?"
   - "Posso usar em outra casa?"

## 🔧 Personalização dos Cálculos

Você pode ajustar os seguintes parâmetros no código:

### Em `src/lib/solar-calculations.ts`:

```typescript
// Irradiação solar (varia por região)
const IRRADIACAO_MEDIA_BRASIL = 5.0; // kWh/m²/dia

// Custo por kWp instalado
const CUSTO_KWP_PADRAO = 4500; // R$/kWp

// Tarifa de energia
const TARIFA_MEDIA_BRASIL = 0.89; // R$/kWh

// Vida útil do sistema
const VIDA_UTIL_SISTEMA = 25; // anos

// Degradação anual dos painéis
const DEGRADACAO_ANUAL = 0.005; // 0.5%
```

## 🛠️ Troubleshooting

### Problema: Chat não funciona
- ✅ Verifique se configurou a API Key da OpenAI
- ✅ Confirme que a key começa com "sk-"
- ✅ Verifique o console do navegador para erros

### Problema: Cálculos parecem errados
- ✅ Confirme que inseriu kWh (não R$) no consumo
- ✅ Verifique se a tarifa está correta (R$/kWh)
- ✅ Lembre-se: conta mínima sempre permanece (~R$ 31)

### Problema: Números muito altos/baixos
- ✅ CEP afeta apenas referência (não muda cálculo ainda)
- ✅ Performance Ratio é um divisor (1.30 = 77% eficiência)
- ✅ Valores baseados em médias nacionais

## 📚 Glossário Completo

### Termos Técnicos

- **kWp**: Quilowatt-pico, potência máxima em condições ideais
- **kWh**: Quilowatt-hora, energia consumida/gerada
- **PR**: Performance Ratio, fator de perdas do sistema
- **Irradiação**: Quantidade de luz solar recebida (kWh/m²/dia)
- **Inversor**: Converte corrente contínua (CC) em alternada (CA)
- **Módulo/Painel**: Componente que gera energia solar

### Termos Financeiros

- **Payback**: Tempo para recuperar investimento
- **ROI**: Return on Investment, retorno percentual
- **CAPEX**: Investimento inicial (Capital Expenditure)
- **OPEX**: Custos operacionais (manutenção, limpeza)

### Termos Regulatórios

- **ANEEL**: Agência Nacional de Energia Elétrica
- **TUSD**: Taxa de Uso do Sistema de Distribuição
- **GD**: Geração Distribuída
- **Créditos**: Energia excedente que vira "crédito" na conta

## 🎯 Dicas para Melhor Resultado

### Para Dimensionamento Preciso

1. Use consumo médio dos últimos 12 meses
2. Considere aumento futuro (carro elétrico, expansão)
3. Verifique fase correta (olhe na conta de luz)
4. Confirme tarifa exata na sua conta

### Para Melhor Retorno Financeiro

1. Priorize pagamento à vista (sem juros)
2. Compare várias propostas de fornecedores
3. Verifique qualidade dos equipamentos
4. Considere expansão futura
5. Mantenha sistema limpo (melhora geração)

### Para Conformidade Legal

1. Registre sistema na distribuidora
2. Guarde documentação por 5 anos
3. Acompanhe validade dos créditos
4. Entenda regras da sua distribuidora
5. Considere contratar engenheiro especializado

## 📞 Próximos Passos Recomendados

1. **Use os resultados como referência**: Os cálculos são estimativas
2. **Solicite visita técnica**: Avaliação in-loco é essencial
3. **Compare propostas**: Peça orçamentos de 3+ fornecedores
4. **Verifique equipamentos**: Qualidade dos painéis e inversor
5. **Confirme documentação**: Empresa qualificada, garantias, registro

## 🤝 Suporte

Para dúvidas sobre:
- **Uso do sistema**: Consulte este guia
- **Cálculos técnicos**: Veja seção de fórmulas
- **Regulamentação**: Consulte site da ANEEL
- **OpenAI**: https://platform.openai.com/docs

---

Desenvolvido com ⚡ e ☀️ para democratizar a energia solar no Brasil
