---
name: do-next-task
description: Identifica a proxima task pendente em docs/TASKS.md, confirma com o usuario e a encaminha ao PRODUCT_OWNER com aviso de releitura do backlog.
---

## O que esta skill faz

Esta skill le o backlog atual em `docs/TASKS.md`, identifica a primeira task pendente na ordem em que aparece, confirma com o usuario se ela e a task correta e, somente depois da confirmacao, a encaminha ao `PRODUCT_OWNER`.

O encaminhamento ao `PRODUCT_OWNER` deve sempre incluir o aviso explicito de que `docs/TASKS.md` foi alterado e precisa ser relido antes de comecar.

## Procedimento

### 1. Reler `docs/TASKS.md`

Antes de qualquer analise, releia o arquivo `docs/TASKS.md` atual.

### 2. Identificar a primeira task pendente atual

Ao procurar a proxima task:

- Considere apenas itens de topo da secao `## TAREFAS` que comecem com `- `
- Ignore criterios numerados, paragrafos auxiliares e qualquer texto que nao seja um item de task de topo
- Considere como concluida apenas a task que comeca com `- ✅`
- Considere como pendente a primeira task de topo que **nao** comeca com `- ✅`
- Preserve a ordem exata do arquivo atual

Se nao houver task pendente, informe isso ao usuario e pare.

### 3. Confirmar com o usuario

Apresente ao usuario a task identificada e peca confirmacao explicita antes de qualquer encaminhamento.

Use uma confirmacao direta neste formato:

```md
A proxima task pendente identificada em `docs/TASKS.md` e:

`<task encontrada>`

Confirma que esta e a task correta para eu encaminhar ao `PRODUCT_OWNER`?
```

Regras:

- Nao encaminhe nada ao `PRODUCT_OWNER` sem confirmacao explicita do usuario
- Se o usuario corrigir a task ou disser que nao e essa, pare e siga a correcao dele
- Se houver ambiguidade, mostre a task encontrada e peca confirmacao em vez de assumir

### 4. Encaminhar ao `PRODUCT_OWNER`

Somente apos a confirmacao do usuario, encaminhe a task ao `PRODUCT_OWNER`.

No prompt para o `PRODUCT_OWNER`, inclua obrigatoriamente:

- A task exata identificada
- O aviso de que `docs/TASKS.md` foi alterado e deve ser relido antes de comecar
- O pedido para transformar a task em uma descricao clara, curta e pronta para execucao

Template recomendado de encaminhamento:

```md
Leia novamente `docs/TASKS.md` antes de comecar, porque o arquivo foi alterado recentemente.

O usuario confirmou explicitamente que a task correta e:
`<task confirmada>`

Transforme essa solicitacao em uma task de produto clara e pronta para execucao.

Retorne apenas:
1. Titulo da task
2. Objetivo
3. Criterios de aceite numerados
4. Observacoes curtas de implementacao, se necessario
```

### 5. Responder ao usuario

Depois que o `PRODUCT_OWNER` responder:

- Mostre ao usuario que a task foi encaminhada
- Resuma o retorno do `PRODUCT_OWNER` de forma curta
- Nao invente detalhes fora do que foi confirmado e retornado

## Quando usar esta skill

- Quando o usuario pedir para enviar a proxima task do backlog ao `PRODUCT_OWNER`
- Quando o usuario quiser confirmar qual e a proxima task pendente antes de encaminhar
- Quando for importante respeitar a ordem atual de `docs/TASKS.md`

## Regras importantes

- Sempre reler `docs/TASKS.md` antes da analise
- Sempre pedir confirmacao explicita do usuario antes do encaminhamento
- Sempre avisar ao `PRODUCT_OWNER` que `docs/TASKS.md` foi alterado e precisa ser relido antes de comecar
- Nunca pular direto para execucao da task sem a etapa de confirmacao
