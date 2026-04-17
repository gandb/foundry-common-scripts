---
name: clean-tasks
description: Limpa o arquivo docs/TASKS.md mantendo sempre as ultimas 10 tarefas (feitas ou nao feitas). Remove tarefas antigas do inicio da lista.
---

## O que esta skill faz

Limpa o arquivo docs/TASKS.md mantendo sempre as últimas 10 tarefas (feitas ou não feitas). Remove as tarefas mais antigas do início da lista.

## Procedimento

### 1. Ler o arquivo docs/TASKS.md

Carregar o conteúdo atual do arquivo docs/TASKS.md na raiz do projeto.

### 2. Separar tarefas feitas e não feitas

- Tarefas com `- ✅` no início são concluídas
- Tarefas com `- [ ]` no início são pendentes

### 3. Calcular quantas tarefas manter

- Se houver 10 ou menos tarefas no total: manter todas
- Se houver mais de 10 tarefas: manter apenas as últimas 10 (feitas ou não feitas)

### 4. Reconstruir o arquivo

Manter o cabeçalho original (formato das tarefas) e reconstruir a lista de tarefas:
1. Juntar tarefas feitas e não feitas na ordem original
2. Manter apenas as últimas 10 da lista

### 5. Preservar estrutura original

Manter qualquer texto antes e depois da lista de tarefas original.

## Exemplo

**Antes (20 tarefas - 10 feitas, 10 não feitas):**
```
- ✅ Tarefa 1
- ✅ Tarefa 2
...
- ✅ Tarefa 10
- [ ] Tarefa 11
- [ ] Tarefa 12
...
- [ ] Tarefa 20
```

**Depois (10 tarefas - 5 feitas, 5 não feitas):**
```
- ✅ Tarefa 6
- ✅ Tarefa 7
...
- ✅ Tarefa 10
- [ ] Tarefa 11
- [ ] Tarefa 12
...
- [ ] Tarefa 20
```

## Quando usar esta skill

- Periodicamente para manter o arquivo limpo
- Quando o arquivo docs/TASKS.md ficar muito grande
- Após muitas tarefas serem concluídas

## Arquivo de entrada

- `docs/TASKS.md` na raiz do projeto atual

## Arquivo de saída

- `docs/TASKS.md` atualizado (mesmo arquivo)