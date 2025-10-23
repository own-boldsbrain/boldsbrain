// Tipos e interfaces para o sistema solar

export interface ConsumoEnergia {
  cep: string;
  consumoMedioKwh: number; // Consumo médio mensal em kWh
  fase: 'monofasico' | 'bifasico' | 'trifasico';
  tarifaKwh?: number; // Tarifa por kWh em R$
}

export interface DimensionamentoSistema {
  potenciaKwp: number; // Potência do sistema em kWp
  performanceRatio: number; // PR - Performance Ratio (1.14, 1.30, 1.45)
  geracaoEstimadaKwhMes: number; // Geração mensal estimada
  numeroModulos: number;
  areaOcupadaM2: number;
}

export interface KitSolar {
  id: string;
  nome: string;
  potenciaKwp: number;
  preco: number;
  modulos: {
    quantidade: number;
    potenciaW: number;
    marca: string;
  };
  inversor: {
    potenciaKw: number;
    marca: string;
  };
  descricao: string;
}

export interface FinanciamentoOpcao {
  tipo: 'vista' | 'financiado' | 'assinatura' | 'geracao-compartilhada';
  valorTotal?: number;
  entrada?: number;
  parcelas?: number;
  valorParcela?: number;
  taxaJurosAnual?: number;
  valorMensalAssinatura?: number;
}

export interface AnaliseFinanceira {
  custoSistema: number;
  economiaAnual: number;
  paybackAnos: number;
  roiPorcentagem: number;
  economiaTotalVidaUtil: number; // Considerando 25 anos
}

export interface CenarioAnalise {
  nome: string;
  performanceRatio: number;
  dimensionamento: DimensionamentoSistema;
  analiseFinanceira: AnaliseFinanceira;
}

export interface Lei14300 {
  tipoSistema: 'microgeracao' | 'minigeracao'; // Até 75kW = micro, até 5MW = mini
  modalidade: 'autoconsumo-remoto' | 'geracao-compartilhada' | 'multiplas-unidades' | 'consumo-local';
  creditosValidade: string; // 60 meses pela Lei 14.300
  observacoes: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface VoiceInput {
  isRecording: boolean;
  transcript: string;
  audioUrl?: string;
}
