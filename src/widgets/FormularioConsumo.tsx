import { useState } from 'react';
import type { ConsumoEnergia } from '@/types/solar';

interface FormularioConsumoProps {
  onSubmit: (dados: ConsumoEnergia) => void;
}

export default function FormularioConsumo({ onSubmit }: FormularioConsumoProps) {
  const [cep, setCep] = useState('');
  const [consumo, setConsumo] = useState('');
  const [fase, setFase] = useState<ConsumoEnergia['fase']>('monofasico');
  const [tarifa, setTarifa] = useState('0.89');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const dados: ConsumoEnergia = {
      cep,
      consumoMedioKwh: parseFloat(consumo),
      fase,
      tarifaKwh: parseFloat(tarifa),
    };
    
    onSubmit(dados);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        📊 Análise de Conta de Energia
      </h2>
      <p className="text-gray-600 mb-6">
        Preencha os dados básicos para começar seu dimensionamento solar
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="cep" className="block text-sm font-medium text-gray-700 mb-1">
            CEP da instalação
          </label>
          <input
            type="text"
            id="cep"
            value={cep}
            onChange={(e) => setCep(e.target.value)}
            placeholder="00000-000"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Usado para calcular irradiação solar da sua região
          </p>
        </div>

        <div>
          <label htmlFor="consumo" className="block text-sm font-medium text-gray-700 mb-1">
            Consumo médio mensal (kWh)
          </label>
          <input
            type="number"
            id="consumo"
            value={consumo}
            onChange={(e) => setConsumo(e.target.value)}
            placeholder="Ex: 350"
            min="1"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            <strong>kWh</strong> = Quilowatt-hora, a energia que você consome e paga na conta
          </p>
        </div>

        <div>
          <label htmlFor="fase" className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de instalação elétrica
          </label>
          <select
            id="fase"
            value={fase}
            onChange={(e) => setFase(e.target.value as ConsumoEnergia['fase'])}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          >
            <option value="monofasico">Monofásico (127V ou 220V - 1 fase)</option>
            <option value="bifasico">Bifásico (220V - 2 fases)</option>
            <option value="trifasico">Trifásico (220V/380V - 3 fases)</option>
          </select>
        </div>

        <div>
          <label htmlFor="tarifa" className="block text-sm font-medium text-gray-700 mb-1">
            Tarifa de energia (R$/kWh) - Opcional
          </label>
          <input
            type="number"
            id="tarifa"
            value={tarifa}
            onChange={(e) => setTarifa(e.target.value)}
            placeholder="0.89"
            step="0.01"
            min="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Valor da tarifa na sua conta de luz (padrão: R$ 0,89/kWh - média Brasil)
          </p>
        </div>

        <button
          type="submit"
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          Calcular Dimensionamento ⚡
        </button>
      </form>
    </div>
  );
}
