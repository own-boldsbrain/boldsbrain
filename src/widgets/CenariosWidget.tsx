import type { CenarioAnalise } from '@/types/solar';
import { formatarReal, formatarNumero } from '@/lib/solar-calculations';

interface CenariosWidgetProps {
  cenarios: CenarioAnalise[];
}

export default function CenariosWidget({ cenarios }: CenariosWidgetProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        🎯 Cenários de Dimensionamento
      </h2>
      <p className="text-gray-600 mb-6">
        Análise com 3 diferentes <strong>Performance Ratios (PR)</strong> - índice de eficiência do sistema
      </p>

      <div className="grid md:grid-cols-3 gap-6">
        {cenarios.map((cenario, index) => (
          <div
            key={index}
            className={`border-2 rounded-lg p-5 ${
              cenario.nome === 'Realista'
                ? 'border-yellow-500 bg-yellow-50'
                : 'border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">
                {cenario.nome}
              </h3>
              {cenario.nome === 'Realista' && (
                <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
                  Recomendado
                </span>
              )}
            </div>

            <div className="space-y-3">
              <div className="bg-white rounded p-3">
                <p className="text-xs text-gray-500 mb-1">Performance Ratio (PR)</p>
                <p className="text-xl font-bold text-gray-800">
                  {formatarNumero(cenario.performanceRatio, 2)}
                </p>
              </div>

              <div className="bg-white rounded p-3">
                <p className="text-xs text-gray-500 mb-1">Potência do Sistema</p>
                <p className="text-xl font-bold text-gray-800">
                  {formatarNumero(cenario.dimensionamento.potenciaKwp, 2)} kWp
                </p>
              </div>

              <div className="bg-white rounded p-3">
                <p className="text-xs text-gray-500 mb-1">Geração Mensal</p>
                <p className="text-xl font-bold text-gray-800">
                  {formatarNumero(cenario.dimensionamento.geracaoEstimadaKwhMes, 0)} kWh
                </p>
              </div>

              <div className="bg-white rounded p-3">
                <p className="text-xs text-gray-500 mb-1">Nº de Módulos</p>
                <p className="text-xl font-bold text-gray-800">
                  {cenario.dimensionamento.numeroModulos} painéis
                </p>
              </div>

              <div className="bg-white rounded p-3">
                <p className="text-xs text-gray-500 mb-1">Área Necessária</p>
                <p className="text-xl font-bold text-gray-800">
                  {formatarNumero(cenario.dimensionamento.areaOcupadaM2, 1)} m²
                </p>
              </div>

              <div className="border-t-2 border-gray-200 pt-3 mt-3">
                <p className="text-xs text-gray-500 mb-1">Investimento</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatarReal(cenario.analiseFinanceira.custoSistema)}
                </p>
              </div>

              <div className="bg-green-50 rounded p-3">
                <p className="text-xs text-gray-500 mb-1">Payback</p>
                <p className="text-xl font-bold text-green-700">
                  {formatarNumero(cenario.analiseFinanceira.paybackAnos, 1)} anos
                </p>
              </div>

              <div className="bg-green-50 rounded p-3">
                <p className="text-xs text-gray-500 mb-1">ROI em 25 anos</p>
                <p className="text-xl font-bold text-green-700">
                  {formatarNumero(cenario.analiseFinanceira.roiPorcentagem, 0)}%
                </p>
              </div>

              <div className="bg-blue-50 rounded p-3">
                <p className="text-xs text-gray-500 mb-1">Economia Anual</p>
                <p className="text-lg font-bold text-blue-700">
                  {formatarReal(cenario.analiseFinanceira.economiaAnual)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-bold text-blue-900 mb-2">💡 Entenda os cenários:</h4>
        <ul className="space-y-1 text-sm text-blue-800">
          <li>
            <strong>Conservador (PR 1.14):</strong> Considera mais perdas (temperatura, sujeira, cabos). Cenário seguro.
          </li>
          <li>
            <strong>Realista (PR 1.30):</strong> Baseado em sistemas bem instalados no Brasil. Mais provável.
          </li>
          <li>
            <strong>Otimista (PR 1.45):</strong> Sistema em condições ideais. Geração máxima possível.
          </li>
        </ul>
      </div>
    </div>
  );
}
