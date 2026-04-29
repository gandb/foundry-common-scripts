---
name: do-backlog
description: Centraliza leitura, priorização e atualização do backlog em docs/TASKS.md
---

## Objetivo

Usar `docs/TASKS.md` apenas quando a task envolver backlog, priorização, abertura, fechamento ou criação de task derivada.

## Carregamento mínimo

- `docs/TASKS.md`
- agente ativo (`PRODUCT_OWNER` ou `SCRUM_MASTER`)
- aprovação do usuário quando houver criação ou reordenação de tasks

## Regras

1. Não reler backlog fora de tarefas de backlog.
2. Considerar concluída apenas a linha que começa com `- ✅`.
3. Considerar pendente a primeira task de topo que começa com `- ` e não começa com `- ✅`.
4. Preservar a ordem das tasks já concluídas.
5. Inserir novas tasks derivadas aprovadas **antes da primeira task pendente existente**.
6. Se várias tasks forem aprovadas em lote, inseri-las como bloco no topo da fila pendente, preservando a prioridade aprovada.

## Rotina

### 1. Ler o backlog atual

- abra `docs/TASKS.md`
- localize a seção `## TAREFAS`
- ignore texto auxiliar fora da lista de tasks de topo

### 2. Identificar a ação necessária

- **refinar task existente:** reescreva a task sem alterar a ordem
- **abrir task derivada:** peça aprovação explícita do usuário e insira no topo da fila pendente
- **encerrar task:** só marque com `✅` após aceite final do usuário

### 3. Manter rastreabilidade

Quando útil, deixe claro no texto da task sua origem, por exemplo:

- redução de contexto base
- extração de skill por agente
- governança de backlog
- autoevolução de skill

## Saída esperada

- backlog atualizado apenas se a tarefa exigir edição
- texto de task objetivo e pronto para o fluxo do `SCRUM_MASTER`

## Autoevolução

Se surgir lacuna estável nesta rotina, use `skill-autoevolution`.
