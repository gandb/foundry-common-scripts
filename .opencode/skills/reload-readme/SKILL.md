---
name: reload-readme
description: Le README.md e os arquivos Markdown do projeto para consolidar contexto e preparar o PRODUCT_OWNER para receber novas tarefas.
---

## O que esta skill faz

Esta skill recarrega o contexto documental do projeto antes de novas definicoes de backlog.

Ela deve:

1. Ler `README.md` primeiro
2. Ler os demais arquivos `.md` relevantes do projeto
3. Consolidar um resumo operacional do produto, regras, backlog e contexto dos agentes
4. Preparar o `PRODUCT_OWNER` para receber novas tarefas com base nesse material

## Procedimento

### 1. Ler `README.md` primeiro

Antes de qualquer outra leitura, abra `README.md` na raiz do projeto.

Objetivo desta etapa:

- entender o que o projeto faz
- identificar a estrutura principal do repositorio
- revisar scripts, entrypoint, fluxo de execucao e dependencias documentadas

### 2. Localizar e ler os demais arquivos Markdown do projeto

Depois do `README.md`, localize **todos** os arquivos `.md` do projeto e leia esse material para completar o contexto.

Regras desta etapa:

- o `README.md` deve ser lido primeiro, antes de qualquer outro `.md`
- depois disso, faca uma varredura explicita dos arquivos Markdown do repositorio
- considere como escopo todos os `.md` do projeto atual, por exemplo em `docs/`, `.opencode/`, raiz e subpastas relevantes do repositorio
- nao ignore arquivos `.md` so porque parecem secundarios; eles tambem fazem parte do contexto documental
- preserve a ordem e o estado real do backlog em `docs/TASKS.md`

Ordem recomendada de leitura depois do `README.md`:

1. `docs/CONSTITUTION.md`
2. `docs/TASKS.md`
3. `.opencode/USER.md`
4. `.opencode/agents/*.md`
5. `.opencode/skills/*/SKILL.md`
6. demais `.md` encontrados no repositorio, como especificacoes em `docs/spec/`

Se houver muitos arquivos, essa ordem define a prioridade de leitura, mas **todos os arquivos Markdown encontrados no projeto devem ser lidos antes de concluir a preparacao do `PRODUCT_OWNER`**.

### 3. Consolidar o contexto do projeto

Depois da leitura, organize um resumo interno com pelo menos estes pontos:

- o que o produto e hoje
- regras arquiteturais e de processo obrigatorias
- responsabilidades dos agentes
- estado atual do backlog e proximas tasks pendentes
- skills existentes que ajudam no fluxo
- preferencias do usuario documentadas

### 4. Preparar o `PRODUCT_OWNER`

Com o contexto consolidado, entregue ao `PRODUCT_OWNER` um briefing curto e objetivo para que ele esteja pronto para receber novas tarefas.

Esse briefing deve conter:

- resumo do projeto
- restricoes principais do repositorio
- fluxo obrigatorio entre agentes
- estado atual das tasks abertas
- observacoes importantes para refinamento de novas tasks

Template recomendado de encaminhamento ao `PRODUCT_OWNER`:

```md
Segue um recarregamento de contexto do projeto apos leitura de `README.md` e dos arquivos Markdown relevantes do repositorio.

## Resumo do projeto
- <resumo curto>

## Regras e restricoes principais
- <ponto 1>
- <ponto 2>

## Estado atual do backlog
- <task pendente 1>
- <task pendente 2>

## Agentes e fluxo
- <resumo curto do fluxo obrigatorio>

## Observacoes para novas tasks
- <ponto importante 1>
- <ponto importante 2>

Use este contexto ao definir ou refinar proximas tarefas do projeto.
```

### 5. Responder ao usuario

Ao finalizar:

- informe que o contexto documental foi recarregado
- diga que o `PRODUCT_OWNER` foi preparado com base nos arquivos Markdown atuais
- resuma de forma curta os principais pontos encontrados

## Quando usar esta skill

- disparado pelo usuário para recarregar o contexto documental do projeto

## Regras importantes

- sempre ler `README.md` antes dos demais `.md`
- sempre varrer e ler todos os arquivos Markdown atuais do repositorio como fonte da verdade documental
- nao pular a leitura de `docs/TASKS.md`, `docs/CONSTITUTION.md` e `.opencode/agents/PRODUCT_OWNER.md`
- preparar o `PRODUCT_OWNER` com um resumo pronto para uso, sem inventar contexto fora dos arquivos lidos
