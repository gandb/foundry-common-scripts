---
name: opencode-session-list
description: Lista todas as sessoes do OpenCode
---

## O que esta skill faz

Lista todas as sessoes/areas de trabalho do OpenCode no projeto, incluindo:


## Procedimento

### 1. Listar Sessões

Identificar diretorios de sessoes em  `~/.local/share/opencode/snapshot/` (IMPORTANTE: este diretorio especifico, nao outro)
Formatar a saída pro usuário com um menu pra selecionar e oferecer sugestoes como, remover o selecionado, apagar todos ou sair
Remover todas as sessões se o usuário solicitar, confirmar antes se é o que ele deseja sendo bem explicito no que vai ser removido 

## Formato de saida

Os exemplos de diretórios/arquivos encontrados dentro da pasta do snapshot abaixo sao apenas ilustrativos - os nomes das sessoes sao gerados aleatoriamente e nao seguem nenhum padrao:

```
=== OPENCODE SESSIONS ===

--- Sessions (5) ---
1 - aB3cD4eF5gH6iJ7kL8mN9oPqRsT
2 - 2uV3wX4yZ5aB6cD7eF8gH9iJ0kL1
3 - 1lM2nO3pQ4rS5tU6vW7xY8z9aB0cD
4 - D1eF2gH3iJ4kL5mM6nN7oO8pP9qQ
5 - Q0rR1sT2uV3wX4yZ5aB6cD7eF8g
```
=== OPENCODE SESSIONS ===

--- Sessions (5) ---
1 - ses_2792ef7fbffeeHQTdgQ3RNz9GK
2 - ses_3792ef7fbffeeHQTdgQ3RNz9FK
3 - ses_4792ef7fbffeeHQTdgQ3RNz9HK
4 - ses_5792ef7fbffeeHQTdgQ3RNz9JK
5 - ses_6792ef7fbffeeHQTdgQ3RNz9DK
 

```

## Quando usar esta skill

- Quando o usuario solicitar listar sessoes disponiveis
- Quando o usuario solicitar remover todas 