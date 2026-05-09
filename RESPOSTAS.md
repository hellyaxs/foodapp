Parte 1 — Correção de bugs (obrigatório)

### Bug 1 — Item duplicado no carrinho em vez de incrementar quantidade

- **Onde está:** `contexts/CartContext.tsx`, função `addItem` (região da linha 22).
- **O que vi de errado:** ao adicionar o mesmo produto mais de uma vez, o carrinho criava registros repetidos, em vez de aumentar a quantidade do item existente.
- **Por que acontece:** faltava tratar corretamente o caso em que o produto já estava no array `items`.
- **O que fiz para corrigir:** adicionei verificação de item existente por `id`; quando existe, faço `map` para incrementar `quantity`; quando não existe, adiciono o novo item com `quantity: 1`.

### Bug 2 — Total da compra não considerava quantidade

- **Onde está:** `contexts/CartContext.tsx`, cálculo de `total` (região da linha 41).
- **O que vi de errado:** o valor final do carrinho ficava menor do que deveria quando havia itens com quantidade maior que 1.
- **Por que acontece:** a soma estava considerando apenas o preço unitário, sem multiplicar pela quantidade de cada item.
- **O que fiz para corrigir:** ajustei o `reduce` para somar `item.price * item.quantity`.

### Bug 3 — Carrinho não era limpo após finalizar pedido

- **Onde está:** `app/checkout/page.tsx` (fluxo de submit, região da linha 18 no código original).
- **O que vi de errado:** após pedido concluído com sucesso, o usuário voltava e o carrinho ainda tinha itens da compra anterior.
- **Por que acontece:** o método `clearCart()` não era executado no fluxo de sucesso do `POST /api/orders`.
- **O que fiz para corrigir:** no caminho de sucesso da finalização do pedido, chamei `clearCart()` para limpar o estado do carrinho.

---

### Parte 3 — Olhar crítico (obrigatório)

Além dos três bugs da Parte 1, foram notados outros pontos (código, UX ou arquitetura). Parte destes foi tratada na evolução do projeto (hooks no checkout, tipos por domínio, cliente HTTP `createOrder`, classes CSS para alertas/cupom, `clearCart()` antes da navegação e leitura segura do corpo de erro nas respostas da API):

1. **Checkout monolítico** — Estado do formulário, cupom, `fetch`, roteamento e JSX num único componente difícil de testar e de reler.

2. **Tipos num único ficheiro** — `Product`, `CartItem`, `Order` e `CreateOrderPayload` misturados; convém separar por domínio (catálogo, carrinho, pedido/API) mantendo barrel para imports estáveis.

3. **`fetch` e erros dentro da UI** — Chamada ao endpoint de pedidos e interpretação do JSON de erro acopladas à página; respostas não-JSON em erro podiam quebrar a experiência se não fossem tratadas de forma segura.

4. **Estilos inline repetidos** — Mensagens de erro e bloco do cupom usavam muitos `style={{ }}`, fugindo ao padrão do restante CSS global.

5. **Fluxo após pedido bem-sucedido** — Esconder/esvaziar o carrinho o mais cedo possível após confirmar o pedido melhora a perceção (evitar carinho “cheio” ainda visível até a transição).

Outros pontos que continuam válidos neste exercise (não obrigatório corrigir):

- **`GET /api/orders`** expõe todos os pedidos sem autenticação (aceitável em demo; em produção seria bloqueante).
- **Carrinho apenas em memória** (React state): atualizar a página perde itens — não há `localStorage`/sessão/back-end de carrinho.
- **`order-success`** mostra apenas o ID via query string; não confirma o pedido contra o servidor (alguém poderia adulterar a URL).

