import { useState } from 'react';
import type { ConsumoEnergia, CenarioAnalise } from '@/types/solar';
import { gerarCenarios, verificarLei14300 } from '@/lib/solar-calculations';
import { initOpenAI } from '@/lib/openai-integration';
import FormularioConsumo from '@/widgets/FormularioConsumo';
import CenariosWidget from '@/widgets/CenariosWidget';
import FinanciamentoWidget from '@/widgets/FinanciamentoWidget';
import NotaRegulatoria14300 from '@/widgets/NotaRegulatoria14300';
import ChatWidget from '@/widgets/ChatWidget';

function App() {
  const [cenarios, setCenarios] = useState<CenarioAnalise[] | null>(null);
  const [apiKey, setApiKey] = useState<string>('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(true);

  const handleConsumoSubmit = (dados: ConsumoEnergia) => {
    const cenariosGerados = gerarCenarios(dados);
    setCenarios(cenariosGerados);
  };

  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      initOpenAI(apiKey);
      setShowApiKeyInput(false);
    }
  };

  const cenarioRealista = cenarios?.find(c => c.nome === 'Realista');
  const lei = cenarioRealista ? verificarLei14300(cenarioRealista.dimensionamento.potenciaKwp) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-100">
      <header className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            ☀️ Yello Solar Hub
          </h1>
          <p className="text-lg opacity-90">
            Copiloto Inteligente para Energia Solar Fotovoltaica no Brasil
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {showApiKeyInput && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              🔑 Configuração OpenAI (Opcional)
            </h2>
            <p className="text-gray-600 mb-4">
              Para usar o chat inteligente e reconhecimento de voz, configure sua API Key da OpenAI:
            </p>
            <form onSubmit={handleApiKeySubmit} className="flex gap-2">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-lg transition-colors"
              >
                Configurar
              </button>
              <button
                type="button"
                onClick={() => setShowApiKeyInput(false)}
                className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold rounded-lg transition-colors"
              >
                Pular
              </button>
            </form>
            <p className="text-xs text-gray-500 mt-2">
              Sua chave não é armazenada e só é usada nesta sessão. Obtenha em:{' '}
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-600 hover:underline"
              >
                OpenAI Platform
              </a>
            </p>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
              <h3 className="font-bold text-blue-900 mb-2">📌 Lei 14.300/2022</h3>
              <p className="text-sm text-blue-800">
                Marco legal da micro e minigeração distribuída de energia no Brasil. 
                Garante regras claras para geração própria de energia solar, 
                com sistema de compensação de créditos válidos por 60 meses.
              </p>
            </div>

            <FormularioConsumo onSubmit={handleConsumoSubmit} />

            {cenarios && (
              <>
                <CenariosWidget cenarios={cenarios} />
                
                {cenarioRealista && (
                  <FinanciamentoWidget
                    valorSistema={cenarioRealista.analiseFinanceira.custoSistema}
                    economiaAnual={cenarioRealista.analiseFinanceira.economiaAnual}
                  />
                )}

                {lei && <NotaRegulatoria14300 lei={lei} />}

                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    🎯 Próximos Passos
                  </h3>
                  <div className="space-y-3">
                    <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                      📞 Falar com Especialista
                    </button>
                    <button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                      📄 Baixar Proposta PDF
                    </button>
                    <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                      🏠 Agendar Visita Técnica
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="lg:col-span-1">
            <ChatWidget apiKey={apiKey || undefined} />
            
            <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                💡 Glossário Solar
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <strong className="text-yellow-600">kWp:</strong>
                  <p className="text-gray-700">Quilowatt-pico - potência máxima do painel em condições ideais</p>
                </div>
                <div>
                  <strong className="text-yellow-600">PR (Performance Ratio):</strong>
                  <p className="text-gray-700">Índice de eficiência real do sistema (75-85%)</p>
                </div>
                <div>
                  <strong className="text-yellow-600">kWh:</strong>
                  <p className="text-gray-700">Quilowatt-hora - energia consumida/gerada</p>
                </div>
                <div>
                  <strong className="text-yellow-600">Payback:</strong>
                  <p className="text-gray-700">Tempo para recuperar o investimento</p>
                </div>
                <div>
                  <strong className="text-yellow-600">ROI:</strong>
                  <p className="text-gray-700">Retorno do investimento em %</p>
                </div>
                <div>
                  <strong className="text-yellow-600">GC:</strong>
                  <p className="text-gray-700">Geração Compartilhada - usina coletiva</p>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6">
              <h3 className="text-lg font-bold text-purple-900 mb-3">
                🌍 Impacto Ambiental
              </h3>
              {cenarioRealista && (
                <div className="space-y-2 text-sm">
                  <div className="bg-white rounded p-3">
                    <p className="text-gray-600">CO₂ evitado/ano:</p>
                    <p className="text-xl font-bold text-green-600">
                      {(cenarioRealista.dimensionamento.geracaoEstimadaKwhMes * 12 * 0.0817).toFixed(2)} toneladas
                    </p>
                  </div>
                  <div className="bg-white rounded p-3">
                    <p className="text-gray-600">Equivalente a plantar:</p>
                    <p className="text-xl font-bold text-green-600">
                      {Math.round(cenarioRealista.dimensionamento.geracaoEstimadaKwhMes * 12 * 0.0817 * 7)} árvores
                    </p>
                  </div>
                </div>
              )}
              <p className="text-xs text-gray-600 mt-3">
                * Cálculos baseados em fatores de emissão do setor elétrico brasileiro (SIN)
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-bold mb-3">Yello Solar Hub</h4>
              <p className="text-sm text-gray-400">
                Plataforma inteligente para dimensionamento e análise de sistemas solares fotovoltaicos no Brasil.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-3">Recursos</h4>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Cálculo de dimensionamento</li>
                <li>• Análise financeira (ROI/Payback)</li>
                <li>• Conformidade Lei 14.300/2022</li>
                <li>• Chat com IA (OpenAI)</li>
                <li>• Reconhecimento de voz (Whisper)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3">Tecnologias</h4>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• React 19</li>
                <li>• TypeScript</li>
                <li>• Tailwind CSS v4</li>
                <li>• Radix UI</li>
                <li>• OpenAI API</li>
                <li>• Vite</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
            <p>© 2024 Yello Solar Hub • Desenvolvido com ⚡ e ☀️ para o Brasil</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
