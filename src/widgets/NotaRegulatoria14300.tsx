import type { Lei14300 } from '@/types/solar';

interface NotaRegulatoria14300Props {
  lei: Lei14300;
}

export default function NotaRegulatoria14300({ lei }: NotaRegulatoria14300Props) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        📋 Nota Regulatória - Lei 14.300/2022
      </h2>

      <div className="space-y-4">
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
          <h3 className="font-bold text-blue-900 mb-2">Classificação do seu sistema:</h3>
          <p className="text-blue-800">
            <strong>{lei.tipoSistema === 'microgeracao' ? 'Microgeração' : 'Minigeração'} Distribuída</strong>
            {' '}({lei.tipoSistema === 'microgeracao' ? 'até 75 kWp' : 'de 75 kWp até 5 MW'})
          </p>
        </div>

        <div className="bg-green-50 border-l-4 border-green-500 p-4">
          <h3 className="font-bold text-green-900 mb-2">Modalidade:</h3>
          <p className="text-green-800">
            {lei.modalidade === 'consumo-local' && 'Consumo Local (Autoconsumo)'}
            {lei.modalidade === 'autoconsumo-remoto' && 'Autoconsumo Remoto'}
            {lei.modalidade === 'geracao-compartilhada' && 'Geração Compartilhada'}
            {lei.modalidade === 'multiplas-unidades' && 'Múltiplas Unidades Consumidoras'}
          </p>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
          <h3 className="font-bold text-yellow-900 mb-2">Créditos Energéticos:</h3>
          <p className="text-yellow-800">
            Validade de <strong>{lei.creditosValidade}</strong> para uso dos créditos gerados
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-bold text-gray-800 mb-3">⚖️ Principais pontos da Lei 14.300/2022:</h3>
          <ul className="space-y-2">
            {lei.observacoes.map((obs, index) => (
              <li key={index} className="flex items-start">
                <span className="text-yellow-500 mr-2">•</span>
                <span className="text-gray-700 text-sm">{obs}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <h3 className="font-bold text-purple-900 mb-2">🔍 Glossário Regulatório:</h3>
          <div className="space-y-2 text-sm">
            <div>
              <strong className="text-purple-800">TUSD Fio B:</strong>
              <span className="text-gray-700"> Taxa de Uso do Sistema de Distribuição - parte da tarifa relacionada aos custos de distribuição da energia.</span>
            </div>
            <div>
              <strong className="text-purple-800">ANEEL:</strong>
              <span className="text-gray-700"> Agência Nacional de Energia Elétrica - órgão regulador do setor elétrico brasileiro.</span>
            </div>
            <div>
              <strong className="text-purple-800">Sistema de Compensação:</strong>
              <span className="text-gray-700"> Modelo onde a energia excedente injetada na rede gera créditos que compensam o consumo.</span>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 border-2 border-orange-300 rounded-lg p-4">
          <h3 className="font-bold text-orange-900 mb-2">⚠️ Importante:</h3>
          <p className="text-orange-800 text-sm">
            Esta é uma orientação geral. Para informações específicas sobre tarifas, incentivos e processos de conexão, 
            consulte sua distribuidora de energia local e a <strong>Resolução Normativa nº 1.000/2021</strong> da ANEEL.
          </p>
        </div>
      </div>
    </div>
  );
}
