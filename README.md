# boldsbrain

App React 19 para gestão solar no Brasil com acessibilidade completa seguindo WAI-ARIA APG e WCAG 2.2.

## 🚀 Tecnologias

- **React 19** - Framework UI
- **TypeScript** - Type safety
- **Vite 7** - Build tool e dev server
- **Tailwind CSS v4** - Styling
- **Radix UI** - Componentes acessíveis primitivos
- **Framer Motion** - Animações
- **ESLint + jsx-a11y** - Linting com regras de acessibilidade

## ♿ Acessibilidade

Este projeto implementa **diretrizes completas de acessibilidade** seguindo:
- [WAI-ARIA Authoring Practices Guide (APG)](https://www.w3.org/WAI/ARIA/apg/)
- WCAG 2.2 (Web Content Accessibility Guidelines)
- Mega prompts de UI (Interações, Animação, Layout, Conteúdo, Performance e Design)

### Principais Features de Acessibilidade

✅ **Navegação por Teclado**: Cobertura completa, focus trap em modais, atalhos  
✅ **Alvos de Toque**: 24×24px mínimo (44×44px no mobile)  
✅ **Formulários**: Validação inline, sem bloqueio de colar, foco em erros  
✅ **Animações**: Respeita `prefers-reduced-motion`, apenas transform/opacity  
✅ **Screen Readers**: aria-live, labels corretos, hierarquia semântica  
✅ **Mobile**: Inputs ≥16px, zoom nunca desabilitado, touch-action  
✅ **Foco Visível**: :focus-visible em todos os elementos interativos  

📖 [**Documentação Completa de Acessibilidade**](./ACCESSIBILITY.md)

## 🏃 Quick Start

```bash
# Instalar dependências
npm install

# Iniciar dev server
npm run dev

# Build para produção
npm run build

# Lint
npm run lint
```

Abra [http://localhost:5173](http://localhost:5173) para ver a aplicação.

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes acessíveis
│   ├── Button.tsx      # Botão com touch targets corretos
│   ├── Input.tsx       # Input com validação inline
│   ├── Link.tsx        # Link semântico
│   ├── Modal.tsx       # Modal com focus trap
│   └── Toast.tsx       # Notificações com aria-live
├── hooks/              # React hooks
│   ├── useFocus.ts     # Gerenciamento de foco
│   ├── useForm.ts      # Estado e validação de formulários
│   └── useToast.ts     # Notificações
├── utils/              # Utilitários
│   ├── accessibility.ts # Funções de acessibilidade
│   └── animation.ts    # Animações acessíveis
├── App.tsx             # Aplicação demo
└── index.css           # CSS global com regras a11y
```

## 🎯 Componentes Disponíveis

### Button
```tsx
<Button variant="primary" onClick={handleClick}>Clique</Button>
<Button iconOnly aria-label="Buscar"><SearchIcon /></Button>
<Button isLoading={true}>Enviando…</Button>
```

### Input
```tsx
<Input
  label="E-mail"
  type="email"
  autoComplete="email"
  error={errors.email}
  required
/>
```

### Modal
```tsx
<Modal open={isOpen} onClose={handleClose} title="Título">
  Conteúdo do modal
</Modal>
```

### Toast
```tsx
const { showToast } = useToast();
showToast('Sucesso!', 'success');
showToast('Erro!', 'error');
```

## 🧪 Testes de Acessibilidade

```bash
# Executar linter com regras jsx-a11y
npm run lint
```

### Testes Manuais Recomendados

- ⌨️ Navegação por teclado (Tab, Escape, Enter, Setas)
- 🖱️ Tamanhos de alvo (24×24px desktop, 44×44px mobile)
- 📱 Mobile (zoom, font-size de inputs, touch-action)
- 🎭 Screen reader (VoiceOver, NVDA, JAWS)
- 🎨 Contraste (4.5:1 mínimo)
- 🎬 Animações (testar com prefers-reduced-motion)

## 📚 Recursos

- [Documentação de Acessibilidade](./ACCESSIBILITY.md)
- [WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/)
- [WCAG 2.2](https://www.w3.org/WAI/WCAG22/quickref/)
- [React 19 Docs](https://react.dev/)
- [Tailwind CSS v4 Docs](https://tailwindcss.com/)

## 🤝 Contribuindo

1. Siga as [diretrizes de acessibilidade](./ACCESSIBILITY.md)
2. Use os componentes e hooks existentes
3. Teste com teclado e screen reader
4. Execute `npm run lint` antes de commit

## 📄 Licença

Este projeto segue a Lei 14.300/2022 (Marco Legal da Geração Distribuída) para gestão solar no Brasil.

---

Desenvolvido com GitHub Copilot como pair programmer, seguindo as melhores práticas de acessibilidade web.

