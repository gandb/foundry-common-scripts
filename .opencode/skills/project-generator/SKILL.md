---
name: project-generator
description: Skill aposentada; use skills menores e contexto sob demanda
---

## Status

Esta skill foi reduzida para um ponteiro explícito e não deve mais ser usada como skill geral do projeto.

## Use no lugar

- `backlog-governance` para backlog
- `task-spec-governance` para specs
- `test-governance` para testes
- `implementation-governance` para implementação
- `documentation-governance` para documentação
- `architecture-context-loader` para contexto técnico
- `release-context-loader` para release

Se alguma skill listada ainda não aparecer como carregável na sessão atual, leia diretamente o arquivo `.opencode/skills/<nome-da-skill>/SKILL.md` correspondente.

## Observação

O contexto base do projeto fica em `README.md`, `docs/CONSTITUTION.md` e `.opencode/USER.md`.
