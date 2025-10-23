import type {
  ConsumoEnergia,
  DimensionamentoSistema,
  AnaliseFinanceira,
  CenarioAnalise,
  Lei14300,
} from '@/types/solar';

// Constantes do setor solar no Brasil
const IRRADIACAO_MEDIA_BRASIL = 5.0; // kWh/m²/dia (média Brasil)
const POTENCIA_MODULO_PADRAO = 550; // Watts
const AREA_MODULO_M2 = 2.6; // m² por módulo
const VIDA_UTIL_SISTEMA = 25; // anos
const DEGRADACAO_ANUAL = 0.005; // 0.5% ao ano
const TARIFA_MEDIA_BRASIL = 0.89; // R$/kWh (média Brasil 2024)

/**
 * Calcula o dimensionamento do sistema solar baseado no consumo
 * @param consumo Dados de consumo do cliente
 * @param performanceRatio Performance Ratio (PR) - fator de eficiência do sistema
 * @returns Dimensionamento do sistema
 */
export function calcularDimensionamento(
  consumo: ConsumoEnergia,
  performanceRatio: number = 1.30
): DimensionamentoSistema {
  // Consumo diário médio
  const consumoDiarioKwh = consumo.consumoMedioKwh / 30;
  
  // Potência necessária em kWp
  // Fórmula: Potência = (Consumo diário) / (Irradiação × PR)
  const potenciaKwp = consumoDiarioKwh / (IRRADIACAO_MEDIA_BRASIL * performanceRatio);
  
  // Geração mensal estimada (kWh/mês)
  const geracaoEstimadaKwhMes = potenciaKwp * IRRADIACAO_MEDIA_BRASIL * performanceRatio * 30;
  
  // Número de módulos necessários
  const numeroModulos = Math.ceil((potenciaKwp * 1000) / POTENCIA_MODULO_PADRAO);
  
  // Área ocupada
  const areaOcupadaM2 = numeroModulos * AREA_MODULO_M2;
  
  return {
    potenciaKwp: parseFloat(potenciaKwp.toFixed(2)),
    performanceRatio,
    geracaoEstimadaKwhMes: parseFloat(geracaoEstimadaKwhMes.toFixed(2)),
    numeroModulos,
    areaOcupadaM2: parseFloat(areaOcupadaM2.toFixed(2)),
  };
}

/**
 * Calcula análise financeira do investimento
 * @param dimensionamento Dados do dimensionamento
 * @param custoKwp Custo por kWp instalado (padrão R$ 4.500/kWp)
 * @param tarifaKwh Tarifa de energia em R$/kWh
 * @returns Análise financeira completa
 */
export function calcularAnaliseFinanceira(
  dimensionamento: DimensionamentoSistema,
  custoKwp: number = 4500,
  tarifaKwh: number = TARIFA_MEDIA_BRASIL
): AnaliseFinanceira {
  // Custo total do sistema
  const custoSistema = dimensionamento.potenciaKwp * custoKwp;
  
  // Economia mensal
  const economiaMensal = dimensionamento.geracaoEstimadaKwhMes * tarifaKwh;
  
  // Economia anual
  const economiaAnual = economiaMensal * 12;
  
  // Payback simples (anos)
  const paybackAnos = custoSistema / economiaAnual;
  
  // ROI (%)
  const roiPorcentagem = ((economiaAnual * VIDA_UTIL_SISTEMA) - custoSistema) / custoSistema * 100;
  
  // Economia total considerando degradação
  let economiaTotalVidaUtil = 0;
  for (let ano = 1; ano <= VIDA_UTIL_SISTEMA; ano++) {
    const fatorDegradacao = Math.pow(1 - DEGRADACAO_ANUAL, ano - 1);
    economiaTotalVidaUtil += economiaAnual * fatorDegradacao;
  }
  
  return {
    custoSistema: parseFloat(custoSistema.toFixed(2)),
    economiaAnual: parseFloat(economiaAnual.toFixed(2)),
    paybackAnos: parseFloat(paybackAnos.toFixed(2)),
    roiPorcentagem: parseFloat(roiPorcentagem.toFixed(2)),
    economiaTotalVidaUtil: parseFloat(economiaTotalVidaUtil.toFixed(2)),
  };
}

/**
 * Gera 3 cenários de análise com diferentes Performance Ratios
 * @param consumo Dados de consumo
 * @param custoKwp Custo por kWp
 * @returns Array com 3 cenários
 */
export function gerarCenarios(
  consumo: ConsumoEnergia,
  custoKwp: number = 4500
): CenarioAnalise[] {
  const prs = [
    { nome: 'Conservador', pr: 1.14 },
    { nome: 'Realista', pr: 1.30 },
    { nome: 'Otimista', pr: 1.45 },
  ];
  
  const tarifaKwh = consumo.tarifaKwh || TARIFA_MEDIA_BRASIL;
  
  return prs.map(({ nome, pr }) => {
    const dimensionamento = calcularDimensionamento(consumo, pr);
    const analiseFinanceira = calcularAnaliseFinanceira(dimensionamento, custoKwp, tarifaKwh);
    
    return {
      nome,
      performanceRatio: pr,
      dimensionamento,
      analiseFinanceira,
    };
  });
}

/**
 * Verifica conformidade com Lei 14.300/2022
 * @param potenciaKwp Potência do sistema
 * @param modalidade Modalidade escolhida
 * @returns Informações sobre a lei
 */
export function verificarLei14300(
  potenciaKwp: number,
  modalidade: Lei14300['modalidade'] = 'consumo-local'
): Lei14300 {
  const tipoSistema = potenciaKwp <= 75 ? 'microgeracao' : 'minigeracao';
  
  const observacoes: string[] = [
    'Sistemas conectados à rede até 12/01/2023 mantêm isenção de tarifas.',
    'Novos sistemas têm cobrança gradual de TUSD Fio B (até 90% em 2029).',
    'Créditos energéticos têm validade de 60 meses.',
    'Sistema de compensação de energia elétrica regulamentado pela ANEEL.',
  ];
  
  if (modalidade === 'geracao-compartilhada') {
    observacoes.push(
      'Geração compartilhada permite compartilhar créditos entre múltiplas unidades consumidoras.',
      'Unidades devem estar na mesma área de concessão.'
    );
  }
  
  if (modalidade === 'autoconsumo-remoto') {
    observacoes.push(
      'Autoconsumo remoto permite usar créditos em local diferente da geração.',
      'Unidades devem pertencer ao mesmo CPF/CNPJ.'
    );
  }
  
  return {
    tipoSistema,
    modalidade,
    creditosValidade: '60 meses',
    observacoes,
  };
}

/**
 * Explica jargões técnicos do setor solar
 */
export const glossario = {
  kWp: 'Quilowatt-pico: potência máxima que um painel solar pode gerar em condições ideais de teste (1000 W/m², 25°C).',
  PR: 'Performance Ratio: índice que mede a eficiência real do sistema. Considera perdas por temperatura, sujeira, cabos, inversor, etc. Típico: 75-85% (PR 1.14-1.30).',
  kWh: 'Quilowatt-hora: unidade de medida de energia. É o que você consome e paga na conta de luz.',
  'TUSD Fio B': 'Taxa de distribuição de energia. Pela Lei 14.300, novos sistemas pagam parte desta taxa.',
  'Microgeração': 'Sistema de até 75 kWp de potência instalada.',
  'Minigeração': 'Sistema de 75 kWp até 5 MW de potência.',
  'Payback': 'Tempo necessário para recuperar o investimento através da economia gerada.',
  ROI: 'Return on Investment: retorno percentual do investimento ao longo da vida útil.',
  'Geração Compartilhada': 'Modalidade onde múltiplos consumidores compartilham uma mesma usina solar.',
  'Autoconsumo Remoto': 'Geração em um local e consumo em outro, desde que mesmo titular.',
};

/**
 * Formata valores em Real brasileiro
 */
export function formatarReal(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor);
}

/**
 * Formata números com casas decimais
 */
export function formatarNumero(valor: number, casasDecimais: number = 2): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: casasDecimais,
    maximumFractionDigits: casasDecimais,
  }).format(valor);
}
