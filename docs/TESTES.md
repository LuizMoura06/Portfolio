# Evidências de validação — 22/10/2026

## Ambiente

- Checkout: G:\DIAW\Portfolio, branch main.
- Node 24.16.0; Next.js 16.4.2.
- Navegador de teste: Microsoft Edge com Playwright, movimento reduzido.
- Produção: https://portfolio-eta-lyart-an0rd3myb7.vercel.app

## Verificações executadas

| Verificação | Resultado |
| --- | --- |
| npm run build | Aprovado; página, favicon e Open Graph estáticos; contato dinâmico |
| npm run lint | Aprovado, sem erros ou avisos após correções |
| npm run typecheck | Aprovado |
| npm test | 6 aprovados: schema, normalização, validações PT/EN, API e timeline |
| npm run test:e2e local | 7 aprovados: cinco resoluções, validação e screenshots |
| E2E contra produção | Sete cenários principais aprovados; cenário adicional do formulário aprovado após corrigir seletor do teste |
| 1440/1024/768/390/360 px | Sem overflow horizontal; navegação e PT/EN verificados |
| Menu móvel | Abre e fecha ao escolher uma seção |
| Troca PT/EN | Sem recarregar, seção preservada e idioma persistido após reload |
| Imagem real | Carrega com naturalWidth > 0; fonte e contribuições em ASSETS.md |
| Formulário com respostas controladas | Estado enviando, botão desabilitado, sucesso, limpeza dos campos, falha e reativação verificados |
| HTTP público sem autenticação | 200, título correto e conteúdo do portfólio |
| Resend local real | Delivered, ID 01a166a0-8728-7c4b-9868-5b18f936e9f8 |
| Resend produção real | Delivered, ID 01a166a4-e4d8-706e-bb96-cbafc313648b |
| npm audit --omit=dev | Zero vulnerabilidades |
| Proteção de secrets | .env.local ignorado, não rastreado; variáveis configuradas no ambiente Vercel |

O teste adicional encontrou dois elementos role=alert: feedback e anunciador de rotas do Next.js. O seletor foi limitado ao formulário e o cenário passou. A aplicação já apresentava a mensagem corretamente; a falha era de ambiguidade do teste.

## Limites

- Sem auditoria formal com leitor de tela ou certificação WCAG.
- A fotografia e os wireframes, indisponíveis na entrega inicial, foram incorporados a partir dos arquivos originais fornecidos pelo autor em 23/10/2026.
- Os e-mails reais foram enviados somente ao autor, com autorização. Respostas controladas de E2E não enviam e-mail e são identificadas separadamente.
- Remetente onboarding@resend.dev é suficiente para enviar ao e-mail da conta Resend; um domínio verificado será necessário para expandir o uso do serviço.

## Revalidação da melhoria posterior — 23/10/2026

- Lint, TypeScript e build de produção: aprovados.
- 6 testes de schema, API e timeline: aprovados.
- 8 cenários E2E: aprovados, incluindo PT/EN, menu, imagem do projeto, validação e estados do formulário.
- Fotografia original: carregamento e proporção 360:340 verificados em 1440, 1024, 768, 390 e 360 px; texto alternativo PT/EN conferido.
- Screenshots existentes atualizados para representar o site com a foto.
- README: 3 screenshots, 2 wireframes e 1 imagem do Voluntarize com caminhos relativos existentes.
- .env.local ignorado e não rastreado. Não foram alteradas credenciais nem a integração de e-mail.
