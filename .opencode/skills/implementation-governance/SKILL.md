---
name: implementation-governance
description: Define a rotina operacional do DEVELOPER com foco em TDD, mudanças mínimas e validação real
---

## Objetivo

Implementar a task com o menor diff necessário, guiado pela spec ativa e pelos testes recebidos.

## Carregamento mínimo

- spec ativa
- testes recebidos do `TESTER`
- arquitetura pertinente via `architecture-context-loader`

## Regras

1. Executar os testes recebidos no estado atual antes de codificar.
2. Se os testes já passarem sem a mudança esperada, devolver ao `TESTER`.
3. Não alterar testes sem retorno formal do `TESTER` ou exceção aprovada pelo usuário.
4. Alterar apenas os arquivos necessários para satisfazer a spec.
5. Validar que os testes realmente exercitam o código de produção.

## Rotina

### 1. Confirmar falha inicial

- rode os testes da task
- se já passarem, interrompa a implementação e reporte o problema

### 2. Implementar

- use a spec ativa como limite do escopo
- respeite constituição, arquitetura e padrões do projeto

### 3. Validar

- rode os testes após a implementação
- faça uma checagem simples de sanidade contra comportamento errado quando necessário

### 4. Encaminhar

- entregue para `CODE_REVIEWER` somente após a implementação estar validada

## Autoevolução

Se faltar instrução estável sobre rotina de implementação, use `skill-autoevolution`.
