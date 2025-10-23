import { useState } from 'react';
import { Button, Input, Link, Modal, ConfirmDialog, useToast } from './components';
import { useUnsavedChanges, useFormSubmission, useFieldValidation } from './hooks/useForm';
import { useFocusOnError } from './hooks/useFocus';

function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [isDirty, setIsDirty] = useState(false);
  
  const { showToast } = useToast();
  const { isSubmitting, submit } = useFormSubmission();
  const { errors, setFieldError, clearFieldError, errorFields } = useFieldValidation();

  // MUST: Warn about unsaved changes
  useUnsavedChanges(isDirty);

  // MUST: Focus first error on submit
  useFocusOnError(errorFields);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
    clearFieldError(field);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation
    if (!formData.name) {
      setFieldError('name', 'Nome é obrigatório');
      return;
    }
    if (!formData.email) {
      setFieldError('email', 'E-mail é obrigatório');
      return;
    }
    if (!formData.email.includes('@')) {
      setFieldError('email', 'E-mail inválido');
      return;
    }

    try {
      await submit(async (key) => {
        // Simulate API call with idempotency key
        await new Promise(resolve => setTimeout(resolve, 1500));
        return { success: true, key };
      });

      showToast('Formulário enviado com sucesso!', 'success');
      setIsDirty(false);
      setFormData({ name: '', email: '' });
    } catch {
      showToast('Erro ao enviar formulário', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      {/* MUST: Skip to content link */}
      <a href="#main-content" className="skip-to-content">
        Pular para o conteúdo
      </a>

      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            boldsbrain
          </h1>
          <p className="text-lg text-gray-600">
            App React 19 para gestão solar no Brasil com acessibilidade completa
          </p>
        </header>

        <main id="main-content" className="space-y-8">
          {/* Demo section: Buttons */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-4">Botões Acessíveis</h2>
            <p className="text-gray-600 mb-4">
              Todos os botões têm tamanho mínimo de 24×24px (44×44px no mobile),
              touch-action: manipulation e foco visível.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button variant="primary" onClick={() => setModalOpen(true)}>
                Abrir Modal
              </Button>
              
              <Button 
                variant="secondary" 
                onClick={() => showToast('Ação realizada!', 'info')}
              >
                Mostrar Toast
              </Button>
              
              <Button
                variant="destructive"
                onClick={() => setConfirmOpen(true)}
              >
                Ação Destrutiva
              </Button>

              <Button
                variant="primary"
                isLoading={isSubmitting}
                aria-label="Botão com spinner"
              >
                {isSubmitting ? 'Carregando' : 'Simular Loading'}
              </Button>

              <Button iconOnly aria-label="Buscar" variant="ghost">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </Button>
            </div>
          </section>

          {/* Demo section: Form */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-4">Formulário Acessível</h2>
            <p className="text-gray-600 mb-4">
              Inputs com font-size ≥16px no mobile, autocomplete, validação inline,
              sem bloqueio de colar, foco no primeiro erro.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Nome Completo"
                name="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                autoComplete="name"
                placeholder="João Silva"
                required
                error={errors.name}
              />

              <Input
                label="E-mail"
                name="email"
                type="email"
                inputMode="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                autoComplete="email"
                placeholder="joao@example.com"
                required
                error={errors.email}
                helperText="Seu e-mail não será compartilhado"
              />

              <Button 
                type="submit" 
                variant="primary" 
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Enviando…' : 'Enviar Formulário'}
              </Button>

              {isDirty && (
                <p className="text-sm text-amber-600">
                  ⚠️ Você tem alterações não salvas
                </p>
              )}
            </form>
          </section>

          {/* Demo section: Links */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-4">Links Acessíveis</h2>
            <p className="text-gray-600 mb-4">
              Links usam &lt;a&gt; para navegação, suportam Cmd/Ctrl/meio-clique,
              e links externos abrem em nova aba com segurança.
            </p>

            <div className="flex flex-col gap-2">
              <Link href="#demo">Link interno</Link>
              <Link href="https://www.w3.org/WAI/ARIA/apg/" external>
                WAI-ARIA APG (externo)
              </Link>
              <Link href="https://github.com" external>
                GitHub (externo)
              </Link>
            </div>
          </section>

          {/* Demo section: Typography & Spacing */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-4">Tipografia e Espaçamento</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Números Tabulares</h3>
                <div className="tabular-nums space-y-1 font-mono text-sm">
                  <div>Consumo: 1.234,56<span className="nbsp">kWh</span></div>
                  <div>Consumo: 987,12<span className="nbsp">kWh</span></div>
                  <div>Consumo: 12,34<span className="nbsp">kWh</span></div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Espaços Não-Quebráveis</h3>
                <p>
                  Use atalhos como <span className="nbsp">⌘ + K</span>,{' '}
                  <span className="nbsp">10 MB</span>,{' '}
                  <span className="nbsp">Vercel SDK</span>
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Reticências Corretas</h3>
                <p>Use o caractere de reticências: "Carregando…" não "Carregando..."</p>
              </div>
            </div>
          </section>
        </main>

        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>
            Implementado seguindo{' '}
            <Link href="https://www.w3.org/WAI/ARIA/apg/" external>
              WAI-ARIA APG
            </Link>
            {' '}e WCAG 2.2
          </p>
        </footer>
      </div>

      {/* Modal Demo */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Modal Acessível"
        description="Este modal implementa focus trap, retorno ao gatilho, e Escape para fechar."
      >
        <div className="space-y-4">
          <p>
            Este modal segue as diretrizes do WAI-ARIA APG para componentes de diálogo:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
            <li>Focus trap - Tab circula entre elementos internos</li>
            <li>Escape fecha o modal</li>
            <li>Foco retorna ao botão que abriu ao fechar</li>
            <li>overscroll-behavior: contain impede scroll do fundo</li>
            <li>Animações respeitam prefers-reduced-motion</li>
          </ul>

          <Button variant="primary" onClick={() => setModalOpen(false)}>
            Fechar Modal
          </Button>
        </div>
      </Modal>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          showToast('Ação confirmada!', 'success');
        }}
        title="Confirmar Ação Destrutiva"
        description="Esta ação não pode ser desfeita. Tem certeza que deseja continuar?"
        confirmLabel="Sim, continuar"
        cancelLabel="Cancelar"
        destructive
      />
    </div>
  );
}

export default App;
