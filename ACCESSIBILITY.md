# UI Accessibility Guidelines - Developer Documentation

## Guia de Acessibilidade para Desenvolvedores

Este documento descreve as diretrizes de acessibilidade implementadas no projeto boldsbrain, seguindo padrões internacionais de acessibilidade web incluindo WAI-ARIA APG (Authoring Practices Guide), WCAG 2.2 e as melhores práticas de UI para Interações, Animação, Layout, Conteúdo, Desempenho e Design.

## 📋 Índice

1. [Navegação por Teclado](#navegação-por-teclado)
2. [Alvos de Toque e Entrada](#alvos-de-toque-e-entrada)
3. [Formulários](#formulários)
4. [Animações](#animações)
5. [Componentes Acessíveis](#componentes-acessíveis)
6. [Utilitários](#utilitários)
7. [Testes de Acessibilidade](#testes-de-acessibilidade)

---

## Navegação por Teclado

### MUST: Cobertura Completa de Teclado

Todos os componentes seguem os padrões [WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/) para navegação por teclado.

#### Focus Trap em Modais

```tsx
import { Modal } from './components';

function MyComponent() {
  const [open, setOpen] = useState(false);
  
  return (
    <Modal open={open} onClose={() => setOpen(false)} title="Meu Modal">
      {/* O foco fica preso dentro do modal */}
      {/* Tab circula entre elementos */}
      {/* Escape fecha o modal */}
      {/* Foco retorna ao gatilho ao fechar */}
    </Modal>
  );
}
```

#### Hook useFocusTrap

Para componentes customizados que precisam de focus trap:

```tsx
import { useFocusTrap } from './hooks/useFocus';

function CustomDialog({ isOpen }) {
  const containerRef = useFocusTrap(isOpen);
  
  return (
    <div ref={containerRef}>
      {/* Conteúdo do diálogo */}
    </div>
  );
}
```

#### Navegação por Setas

```tsx
import { useArrowNavigation } from './hooks/useFocus';

function Menu({ items }) {
  const itemRefs = useRef<HTMLElement[]>([]);
  const { handleKeyDown } = useArrowNavigation(itemRefs.current, {
    orientation: 'vertical',
    loop: true
  });
  
  return (
    <div onKeyDown={handleKeyDown}>
      {items.map((item, i) => (
        <button 
          ref={el => itemRefs.current[i] = el}
          key={item.id}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
```

### MUST: Anéis de Foco Visíveis

O CSS global já implementa `:focus-visible` com contraste adequado:

```css
*:focus-visible {
  outline: 2px solid hsl(240 100% 50%);
  outline-offset: 2px;
}
```

Para containers que devem indicar quando um filho tem foco:

```css
*:focus-within:has(:focus-visible) {
  --focus-within-active: 1;
}
```

---

## Alvos de Toque e Entrada

### MUST: Tamanho Mínimo 24×24 CSS px

Todos os componentes de botão e link já implementam tamanhos mínimos:

- Desktop: 24×24px mínimo
- Mobile: 44×44px recomendado

```tsx
import { Button } from './components';

// Botões já têm tamanhos mínimos corretos
<Button>Clique aqui</Button>

// Para botões apenas com ícone, MUST fornecer aria-label
<Button iconOnly aria-label="Buscar">
  <SearchIcon />
</Button>
```

### MUST: Inputs Mobile com font-size ≥ 16px

O CSS global garante isso automaticamente:

```css
@media (max-width: 768px) {
  input, textarea, select {
    font-size: max(16px, 1rem);
  }
}
```

### NEVER: Desabilitar Zoom

O meta viewport está configurado corretamente para permitir zoom do usuário:

```html
<!-- Permite zoom até 5x (user-scalable é default, mas explícito aqui) -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
```

**Importante**: Nunca use `user-scalable=no` ou `maximum-scale=1.0` pois isso viola WCAG 2.2 e impede que usuários com baixa visão aumentem o zoom.

### MUST: touch-action: manipulation

Já aplicado globalmente a elementos interativos para reduzir double-tap zoom:

```css
button, a, [role="button"], [role="link"] {
  touch-action: manipulation;
}
```

---

## Formulários

### MUST: Componente Input Acessível

```tsx
import { Input } from './components';

function MyForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  
  return (
    <Input
      label="E-mail"
      name="email"
      type="email"
      inputMode="email"
      autoComplete="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      error={error}
      required
      helperText="Seu e-mail não será compartilhado"
    />
  );
}
```

### MUST: Validação e Foco em Erros

```tsx
import { useFieldValidation, useFocusOnError } from './hooks/useForm';

function MyForm() {
  const { errors, setFieldError, errorFields } = useFieldValidation();
  
  // MUST: Foca no primeiro campo com erro ao submeter
  useFocusOnError(errorFields);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.email) {
      setFieldError('email', 'E-mail é obrigatório');
      return;
    }
    
    // ... enviar
  };
}
```

### MUST: Avisar sobre Alterações Não Salvas

```tsx
import { useUnsavedChanges } from './hooks/useForm';

function MyForm() {
  const [isDirty, setIsDirty] = useState(false);
  
  // MUST: Avisa ao navegar com alterações não salvas
  useUnsavedChanges(isDirty);
  
  const handleChange = () => {
    setIsDirty(true);
  };
}
```

### MUST: Submissão com Idempotência

```tsx
import { useFormSubmission } from './hooks/useForm';

function MyForm() {
  const { isSubmitting, submit } = useFormSubmission();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await submit(async (idempotencyKey) => {
        // API recebe chave de idempotência
        return await api.post('/submit', {
          data: formData,
          idempotencyKey
        });
      });
      
      // Sucesso
    } catch (err) {
      // Erro
    }
  };
  
  return (
    <Button 
      type="submit" 
      isLoading={isSubmitting}
      disabled={isSubmitting}
    >
      {isSubmitting ? 'Enviando…' : 'Enviar'}
    </Button>
  );
}
```

### NEVER: Bloquear Colar

O CSS garante que colar sempre funciona:

```css
input, textarea {
  -webkit-user-select: text;
  user-select: text;
}
```

---

## Animações

### MUST: Respeitar prefers-reduced-motion

Todas as animações respeitam automaticamente a preferência do usuário:

```tsx
import { createMotionVariants } from './utils/animation';

// Cria variantes que respeitam reduced motion
const slideVariants = createMotionVariants({
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  duration: 0.3
});

<motion.div {...slideVariants}>
  Conteúdo
</motion.div>
```

### MUST: Apenas Transform e Opacity

Para animações CSS customizadas:

```tsx
import { createTransition } from './utils/animation';

// Cria transição segura para compositor
const transition = createTransition(['transform', 'opacity'], 0.2, 'smooth');

<div style={{ transition }}>
  Conteúdo
</div>
```

### Variantes Prontas

```tsx
import { 
  modalVariants, 
  toastVariants, 
  fadeVariants,
  drawerVariants 
} from './utils/animation';

<motion.div {...modalVariants}>Modal</motion.div>
<motion.div {...toastVariants}>Toast</motion.div>
<motion.div {...fadeVariants}>Fade</motion.div>
<motion.div {...drawerVariants.bottom}>Drawer</motion.div>
```

---

## Componentes Acessíveis

### Button

```tsx
import { Button } from './components';

// Botão primário
<Button variant="primary" onClick={handleClick}>
  Clique aqui
</Button>

// Botão com loading
<Button isLoading={isSubmitting}>
  Enviar
</Button>

// Botão apenas ícone - MUST ter aria-label
<Button iconOnly aria-label="Fechar">
  <CloseIcon />
</Button>

// Botão destrutivo
<Button variant="destructive" onClick={handleDelete}>
  Excluir
</Button>
```

### Link

```tsx
import { Link } from './components';

// Link interno
<Link href="/dashboard">Dashboard</Link>

// Link externo - abre em nova aba com segurança
<Link href="https://example.com" external>
  Site Externo
</Link>

// Link com aria-current para navegação
<Link href="/current" aria-current="page">
  Página Atual
</Link>
```

### Modal/Dialog

```tsx
import { Modal, ConfirmDialog } from './components';

// Modal simples
<Modal
  open={isOpen}
  onClose={handleClose}
  title="Título do Modal"
  description="Descrição opcional"
>
  Conteúdo do modal
</Modal>

// Dialog de confirmação
<ConfirmDialog
  open={confirmOpen}
  onClose={() => setConfirmOpen(false)}
  onConfirm={handleConfirm}
  title="Confirmar Ação"
  description="Tem certeza que deseja continuar?"
  confirmLabel="Sim, continuar"
  cancelLabel="Cancelar"
  destructive={true}
/>
```

### Toast

```tsx
import { useToast } from './hooks/useToast';

function MyComponent() {
  const { showToast } = useToast();
  
  const handleSuccess = () => {
    // MUST: aria-live="polite" por padrão
    showToast('Sucesso!', 'success');
  };
  
  const handleError = () => {
    // MUST: aria-live="assertive" para erros críticos
    showToast('Erro crítico!', 'error');
  };
  
  const handleInfo = () => {
    showToast('Informação', 'info', 5000); // 5s de duração
  };
}
```

---

## Utilitários

### Acessibilidade

```tsx
import {
  focusElement,
  getFocusableElements,
  createFocusTrap,
  meetsMinimumTargetSize,
  announce,
  prefersReducedMotion,
  nbsp,
  ellipsis,
  formatPlaceholder,
  hasAccessibleName,
  generateId
} from './utils/accessibility';

// Foco com preventScroll
focusElement(element, { preventScroll: true });

// Obter elementos focáveis
const focusable = getFocusableElements(container);

// Anunciar para leitores de tela
announce('Mensagem importante', 'polite');
announce('Erro crítico!', 'assertive');

// Verificar preferência de movimento reduzido
if (prefersReducedMotion()) {
  // Sem animações
}

// Espaços não-quebráveis
<span>{nbsp('10 MB')}</span>
<span>{nbsp('⌘ + K')}</span>

// Reticências corretas
<span>Carregando{ellipsis()}</span>

// Placeholder com exemplo
<input placeholder={formatPlaceholder('usuario@exemplo.com')} />
```

### Tipografia

```tsx
// Números tabulares para comparação
<div className="tabular-nums">
  1.234,56 kWh
</div>

// Espaços não-quebráveis
<span className="nbsp">10 MB</span>
<span className="nbsp">⌘ + K</span>
```

---

## Testes de Acessibilidade

### Checklist Manual

#### Teclado
- [ ] Tab navega por todos os elementos interativos
- [ ] Escape fecha modais e dropdowns
- [ ] Enter submete formulários
- [ ] Setas navegam em menus e listas
- [ ] Focus trap funciona em modais
- [ ] Foco retorna ao gatilho ao fechar modais

#### Alvos de Toque
- [ ] Todos os botões têm min 24×24px (44×44px no mobile)
- [ ] Espaçamento adequado entre alvos próximos
- [ ] Hit areas expandidas onde visual é menor

#### Formulários
- [ ] Colar funciona em todos os inputs
- [ ] Mobile inputs com font-size ≥ 16px
- [ ] Errors inline ao lado do campo
- [ ] Foco no primeiro erro ao submeter
- [ ] Aviso de alterações não salvas
- [ ] Autocomplete correto
- [ ] Labels associados corretamente

#### Animações
- [ ] Redução de movimento respeitada
- [ ] Apenas transform/opacity animados
- [ ] 60fps mantido

#### Screen Readers
- [ ] Aria-labels presentes em botões ícone-apenas
- [ ] Aria-live em toasts e validação
- [ ] Hierarquia de headings correta
- [ ] Alt text em imagens
- [ ] Skip to content funciona

### ESLint

O projeto está configurado com `eslint-plugin-jsx-a11y`:

```bash
npm run lint
```

### Ferramentas Recomendadas

- **axe DevTools**: Extensão do Chrome para testar acessibilidade
- **NVDA/JAWS**: Leitores de tela para Windows
- **VoiceOver**: Leitor de tela do macOS (Cmd+F5)
- **React DevTools**: Para verificar árvore de acessibilidade
- **Lighthouse**: Auditoria de acessibilidade integrada ao Chrome

---

## Recursos Adicionais

### Referências
- [WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/)
- [WCAG 2.2](https://www.w3.org/WAI/WCAG22/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [Inclusive Components](https://inclusive-components.design/)

### Padrões WAI-ARIA APG Implementados
- Dialog (Modal)
- Menu (Dropdown)
- Alert (Toast)
- Form Validation

### Métricas de Acessibilidade
- **Target Size**: 24×24px mínimo (WCAG 2.5.8 Enhanced)
- **Contrast**: 4.5:1 para texto normal
- **Focus Indicators**: 2px solid com offset
- **Motion Duration**: Animações efetivamente desabilitadas (≤0.01s) quando `prefers-reduced-motion: reduce`

---

## Contribuindo

Ao adicionar novos componentes ou features:

1. ✅ Siga os padrões WAI-ARIA APG
2. ✅ Use os componentes e hooks existentes
3. ✅ Teste com teclado
4. ✅ Teste com leitor de tela
5. ✅ Verifique tamanhos mínimos de alvo
6. ✅ Respeite prefers-reduced-motion
7. ✅ Execute `npm run lint`
8. ✅ Adicione aria-labels quando necessário

## Suporte

Para dúvidas sobre acessibilidade:
1. Consulte este documento
2. Verifique os exemplos em `src/App.tsx`
3. Consulte [WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/)
