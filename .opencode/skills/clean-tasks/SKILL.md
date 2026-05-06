---
name: clean-tasks
description: Limpa docs/TASKS.md preservando todas as pendências atuais e limitando o histórico concluído quando possível
---

## Objetivo

Reduzir o tamanho de `docs/TASKS.md` sem destruir a prioridade atual das tasks pendentes.

## Regras

1. Preservar integralmente a seção de cabeçalho do arquivo.
2. Preservar a ordem atual de todas as tasks pendentes.
3. Manter no máximo 10 tasks visíveis no total apenas quando isso não conflitar com a preservação integral das pendências atuais.
4. Quando houver conflito entre limite total e pendências atuais, preservar todas as pendências e reduzir apenas o histórico concluído.

## Procedimento

### 1. Ler `docs/TASKS.md`

Carregue a seção `## TAREFAS` e separe:

- tasks concluídas (- ✅ descricao)
- tasks pendentes (- sem  o símbolo ✅ e em seguida a descriçñao)

### 2. Definir o conjunto a manter

- mantenha **todas** as tasks pendentes atuais, na ordem existente
- se o total de pendências for menor que 10, preencha o restante até 10 com as tasks concluídas mais recentes
- se já houver mais de 10 pendências, mantenha apenas as pendências e não preserve concluídas antigas
- se já houver 10 ou menos tasks no total, não remova nada

### 3. Reconstruir a lista

- primeiro mantenha as concluídas selecionadas
- depois mantenha a fila pendente atual intacta
- preserve qualquer texto fora da lista de tasks

## Quando usar

- quando `docs/TASKS.md` crescer demais
- após várias tasks concluídas
- quando for necessário enxugar histórico sem perder a fila pendente prioritária

## Autoevolução

Se surgir conflito estável entre limpeza e priorização do backlog, use `skill-autoevolution`.
