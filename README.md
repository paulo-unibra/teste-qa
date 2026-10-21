# Atlas — Desafio de QA

Aplicação de cadastro de clientes para avaliação prática de qualidade. Contém comportamentos defeituosos intencionais. Use somente dados fictícios.

## Executar

Requer Python 3.10 ou superior, sem dependências externas.

```sh
git clone https://github.com/paulo-unibra/teste-qa.git
cd teste-qa
python3 server.py
```

Abra http://localhost:8000. O banco SQLite é criado automaticamente com 18 clientes fictícios. Os dados persistem entre reinicializações. Para restaurar a base, pare o servidor, remova `data.sqlite3` e execute novamente. Cada candidato deve usar sua própria cópia.

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

Sem login e sem serviços externos. Dados armazenados apenas no SQLite local. Mensagens de SQL/stack trace fazem parte do exercício; não há credenciais reais. O erro SQL é provocado por uma consulta inválida fixa, sem concatenar entrada do usuário em SQL. Não use esta aplicação como base de produção.

`HOST` (padrão 127.0.0.1), `PORT` (8000) e `QA_DB` permitem configurar execução. Não publique um banco com dados pessoais.
