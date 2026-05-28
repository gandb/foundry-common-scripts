---
name: task-spec-governance
description: Padroniza criação, aprovação e uso da spec ativa em docs/spec/
---

## Objetivo

Padronizar a criação e o uso da spec ativa sem carregar todas as specs do projeto.

## Carregamento mínimo

- task recebida do `SCRUM_MASTER`
- `docs/spec/` apenas para criar ou localizar a spec ativa
- contexto técnico relevante via `architecture-context-loader`, se necessário

## Regras

1. Criar a spec em `docs/spec/<nome-resumido>-spec.md`.
2. Informar explicitamente ao usuário qual arquivo de spec foi criado.
3. Pedir aprovação explícita do usuário antes de avançar no fluxo.
4. Após aprovada, considerar essa spec como a única spec ativa da task.
5. Não reler outras specs sem necessidade real.

## Estrutura mínima da spec

- **Objetivo**
- **Arquivos**
- **Funções**
- **Variáveis**
- **Testes esperados**
- **Atualização docs**
- **Escopo fechado**

## Rotina

### 1. Produzir a spec

- transforme a task em plano executável
- registre arquivos e restrições objetivas
- documente exceções de fluxo aprovadas pelo usuário, se existirem

### 2. Submeter ao usuário

Use um aviso explícito com o caminho do arquivo, por exemplo:

```md
Criei a spec da task em `docs/spec/<nome-resumido>-spec.md`.
Leia este arquivo e confirme se o plano está aprovado para seguir.
```

### 3. Encaminhar a próxima etapa

- com aprovação normal: enviar a spec ativa ao `TESTER`
- com exceção de fluxo aprovada: registrar a exceção na própria spec e seguir somente o fluxo permitido

## Autoevolução

Se faltar instrução estável sobre criação ou uso de specs, use `skill-autoevolution`.
