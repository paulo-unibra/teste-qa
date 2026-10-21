# Atlas — Desafio de QA

Aplicação de cadastro de clientes para avaliação prática de qualidade. Contém comportamentos defeituosos intencionais. Use somente dados fictícios.

## Acessar

Aplicação **100% estática**, sem API, back-end, banco remoto ou instalação para o candidato. O CRUD usa localStorage: os cadastros ficam somente no navegador e na origem em que o site foi aberto. Cada candidato tem sua própria base. Recarregar mantém os dados; limpar os dados do site ou usar outro navegador inicia outra base. Use "Restaurar dados" para retornar aos 18 clientes fictícios. Não é preciso login.

## GitHub Pages

Em Settings → Pages → Build and deployment, selecione **GitHub Actions** como Source. Execute o workflow "Publicar GitHub Pages" na aba Actions ou envie um commit à main. A URL esperada após publicação é https://paulo-unibra.github.io/teste-qa/ — confirme o resultado do workflow antes de compartilhar.

Somente a pasta public/ é publicada. Os caminhos relativos também funcionam no subdiretório /teste-qa/.

## Escopo esperado

- Cadastrar, listar, editar e excluir clientes; exclusão deve solicitar confirmação.
- Nome, e-mail, CPF e telefone são obrigatórios. Nome deve ter ao menos 3 caracteres após remover espaços nas extremidades.
- E-mail deve ser válido. CPF deve ter 11 dígitos válidos e ser único, independentemente da pontuação.
- Telefone brasileiro deve aceitar DDD com 10 ou 11 dígitos. CEP opcional deve ter 8 dígitos, no formato 00000-000.
- Nascimento opcional não pode ser futuro. Crédito deve ser não negativo e aceitar valor brasileiro, como 1.234,56.
- Alterações em todos os campos devem persistir após recarregar a página.
- Busca parcial por nome deve ignorar caixa e acentos; filtros combinados usam E lógico.
- Situação deve retornar o status escolhido. Crédito mínimo inclui o limite informado.
- Ordenação crescente numérica para crédito e alfabética para nome.
- Aplicar ou limpar filtros deve retornar à primeira página. Limpar deve remover todos os filtros.
- Erros devem apresentar uma mensagem compreensível sem expor detalhes internos.

## Entrega do candidato

Sugestão: 60–90 minutos de exploração e 30 minutos para relatório. Entregue os cenários executados, bugs com passos de reprodução, resultado esperado e observado, evidências, severidade e prioridade. Destaque os três maiores riscos e justifique. Automação de alguns cenários é opcional; não é necessário corrigir o código.

## Ambiente

Todos os defeitos do exercício acontecem no navegador. As mensagens de SQL, caminho de banco e stack trace são textos fictícios simulados; nenhuma consulta SQL é executada. Não existe API nem serviço externo. Use dados fictícios. O navegador pode bloquear ou limitar localStorage; dados não são sincronizados entre dispositivos e podem ser apagados pelas configurações do navegador.

## Verificação para o mantenedor

Com Node.js 24 ou superior, execute `npm test`. Não há dependências a instalar. Os testes verificam CRUD local, recarga do módulo, manutenção da base vazia e simulações. Para desenvolvimento, sirva public/ com qualquer servidor de arquivos estáticos; abra pela URL HTTP, em vez de clicar no HTML como arquivo local.

