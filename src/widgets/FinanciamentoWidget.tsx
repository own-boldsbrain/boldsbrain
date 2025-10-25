import { useState } from 'react';
import type { FinanciamentoOpcao } from '@/types/solar';
import { formatarReal } from '@/lib/solar-calculations';

interface FinanciamentoWidgetProps {
  valorSistema: number;
  economiaAnual: number;
}

export default function FinanciamentoWidget({ valorSistema, economiaAnual }: FinanciamentoWidgetProps) {
  const [modalidade, setModalidade] = useState<FinanciamentoOpcao['tipo']>('vista');
  const [entrada, setEntrada] = useState(valorSistema * 0.2); // 20% entrada padrão
  const [parcelas, setParcelas] = useState(60);
  const taxaJurosAnual = 0.12; // 12% a.a.

  const calcularFinanciamento = (): FinanciamentoOpcao => {
    if (modalidade === 'vista') {
      return {
        tipo: 'vista',
        valorTotal: valorSistema,
      };
    }

    if (modalidade === 'assinatura') {
      // Modelo de assinatura: paga uma mensalidade menor que a conta de luz
      const economiaMedia = economiaAnual / 12;
      return {
        tipo: 'assinatura',
        valorMensalAssinatura: economiaMedia * 0.85, // 15% desconto na conta
      };
    }

    if (modalidade === 'geracao-compartilhada') {
      const economiaMedia = economiaAnual / 12;
      return {
        tipo: 'geracao-compartilhada',
        valorMensalAssinatura: economiaMedia * 0.80, // 20% desconto na conta
      };
    }

    // Financiamento
    const valorFinanciado = valorSistema - entrada;
    const taxaMensal = Math.pow(1 + taxaJurosAnual, 1/12) - 1;
    const valorParcela = valorFinanciado * (taxaMensal * Math.pow(1 + taxaMensal, parcelas)) / 
                        (Math.pow(1 + taxaMensal, parcelas) - 1);

    return {
      tipo: 'financiado',
      valorTotal: entrada + (valorParcela * parcelas),
      entrada,
      parcelas,
      valorParcela,
      taxaJurosAnual,
    };
  };

  const opcao = calcularFinanciamento();
  const economiaMensal = economiaAnual / 12;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        💰 Opções de Financiamento
      </h2>
      <p className="text-gray-600 mb-6">
        Compare o valor da parcela com sua conta de energia atual
      </p>

      <div className="mb-6" role="group" aria-labelledby="modalidade-label">
        <p id="modalidade-label" className="block text-sm font-medium text-gray-700 mb-2">
          Modalidade de Pagamento
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => setModalidade('vista')}
            className={`p-3 rounded-lg border-2 transition-colors ${
              modalidade === 'vista'
                ? 'border-yellow-500 bg-yellow-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <p className="font-bold text-sm">À Vista</p>
          </button>
          <button
            onClick={() => setModalidade('financiado')}
            className={`p-3 rounded-lg border-2 transition-colors ${
              modalidade === 'financiado'
                ? 'border-yellow-500 bg-yellow-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <p className="font-bold text-sm">Financiado</p>
          </button>
          <button
            onClick={() => setModalidade('assinatura')}
            className={`p-3 rounded-lg border-2 transition-colors ${
              modalidade === 'assinatura'
                ? 'border-yellow-500 bg-yellow-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <p className="font-bold text-sm">Assinatura</p>
          </button>
          <button
            onClick={() => setModalidade('geracao-compartilhada')}
            className={`p-3 rounded-lg border-2 transition-colors ${
              modalidade === 'geracao-compartilhada'
                ? 'border-yellow-500 bg-yellow-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <p className="font-bold text-sm">GC</p>
          </button>
        </div>
      </div>

      {modalidade === 'financiado' && (
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Entrada: {formatarReal(entrada)}
            </label>
            <input
              type="range"
              min={0}
              max={valorSistema}
              step={1000}
              value={entrada}
              onChange={(e) => setEntrada(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Parcelas: {parcelas}x
            </label>
            <input
              type="range"
              min={12}
              max={120}
              step={6}
              value={parcelas}
              onChange={(e) => setParcelas(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      )}

      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-6 mb-4">
        {modalidade === 'vista' && (
          <>
            <h3 className="text-lg font-bold text-gray-800 mb-4">💳 Pagamento à Vista</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Investimento Total:</span>
                <span className="text-2xl font-bold text-green-600">
                  {formatarReal(opcao.valorTotal!)}
                </span>
              </div>
              <div className="pt-3 border-t border-gray-300">
                <p className="text-sm text-gray-600">
                  ✅ Melhor custo-benefício - sem juros!
                </p>
              </div>
            </div>
          </>
        )}

        {modalidade === 'financiado' && (
          <>
            <h3 className="text-lg font-bold text-gray-800 mb-4">📊 Financiamento</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-700">Entrada:</span>
                <span className="font-bold">{formatarReal(opcao.entrada!)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Parcelas:</span>
                <span className="font-bold">{opcao.parcelas}x</span>
              </div>
              <div className="flex justify-between items-center bg-white rounded p-3">
                <span className="text-gray-700">Valor da Parcela:</span>
                <span className="text-2xl font-bold text-orange-600">
                  {formatarReal(opcao.valorParcela!)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Total com juros:</span>
                <span className="font-bold">{formatarReal(opcao.valorTotal!)}</span>
              </div>
            </div>
          </>
        )}

        {(modalidade === 'assinatura' || modalidade === 'geracao-compartilhada') && (
          <>
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              {modalidade === 'assinatura' ? '⚡ Assinatura Solar' : '🏘️ Geração Compartilhada'}
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center bg-white rounded p-3">
                <span className="text-gray-700">Mensalidade:</span>
                <span className="text-2xl font-bold text-green-600">
                  {formatarReal(opcao.valorMensalAssinatura!)}
                </span>
              </div>
              <div className="pt-3 border-t border-gray-300">
                <p className="text-sm text-gray-600">
                  {modalidade === 'assinatura' 
                    ? '✅ Sem investimento inicial • Sem manutenção'
                    : '✅ Ideal para quem não tem telhado adequado'}
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="font-bold text-blue-900 mb-3">🔄 Comparação com a Conta Atual</h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded p-3">
            <p className="text-xs text-gray-500 mb-1">Sua conta atual (mensal)</p>
            <p className="text-xl font-bold text-red-600">
              {formatarReal(economiaMensal)}
            </p>
          </div>
          <div className="bg-white rounded p-3">
            <p className="text-xs text-gray-500 mb-1">
              {modalidade === 'vista' ? 'Conta com solar' : 
               modalidade === 'financiado' ? 'Parcela + conta mínima' : 
               'Nova mensalidade'}
            </p>
            <p className="text-xl font-bold text-green-600">
              {modalidade === 'vista' ? formatarReal(economiaMensal * 0.1) :
               modalidade === 'financiado' ? formatarReal((opcao.valorParcela || 0) + (economiaMensal * 0.1)) :
               formatarReal(opcao.valorMensalAssinatura || 0)}
            </p>
          </div>
        </div>
        <div className="mt-3 text-center">
          <p className="text-sm font-bold text-green-700">
            {modalidade === 'vista' && `💚 Economia de até ${formatarReal(economiaMensal * 0.9)}/mês`}
            {modalidade === 'financiado' && economiaMensal * 0.9 > (opcao.valorParcela || 0) && 
              `💚 Parcela menor que a economia!`}
            {(modalidade === 'assinatura' || modalidade === 'geracao-compartilhada') && 
              `💚 Economia de ${formatarReal(economiaMensal - (opcao.valorMensalAssinatura || 0))}/mês`}
          </p>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-bold text-gray-800 mb-2">ℹ️ Entenda as opções:</h4>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>
            <strong>À Vista:</strong> Melhor retorno financeiro, sem juros. Payback mais rápido.
          </li>
          <li>
            <strong>Financiado:</strong> Parcela o sistema. Ideal quando a parcela é menor que sua conta atual.
          </li>
          <li>
            <strong>Assinatura:</strong> Sem investimento inicial. Você paga uma mensalidade menor que a conta de luz.
          </li>
          <li>
            <strong>GC (Geração Compartilhada):</strong> Para quem não tem telhado. Você aluga uma parte de uma usina solar.
          </li>
        </ul>
      </div>
    </div>
  );
}
