---
name: release-context-loader
description: Carrega apenas o contexto necessário para changelog, versão e preparação de release
---

## Objetivo

Preparar tarefas de release sem recarregar backlog, agentes e documentação geral sem necessidade.

## Carregamento mínimo

- `CHANGELOG.md`
- `package.json`
- diff ou resumo das mudanças da release
- `README.md` apenas se a release alterar uso público ou comandos

## Regras

1. Não carregar `docs/TASKS.md` por padrão.
2. Não carregar todos os agentes por padrão.
3. Só usar backlog ou specs se a release depender explicitamente disso.
4. Validar versão e data antes de concluir.

## Rotina

1. Ler `package.json` e identificar a versão alvo.
2. Ler `CHANGELOG.md` e localizar a última entrada relevante.
3. Consolidar apenas mudanças visíveis ou permanentes para a release.
4. Se houver necessidade de geração de texto final, chamar `changelog-generator`.

## Autoevolução

Se surgir lacuna estável no processo de release, use `skill-autoevolution`.
