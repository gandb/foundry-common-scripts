---
name: readme-sync-enforcer
description: Verifica se todos os scripts e variaveis do projeto estao documentados no README.md e se a documentacao reflete o comportamento atual
---

## O que esta skill faz

Garante que o `README.md` na raiz do projeto esta sincronizado com a realidade do codigo TypeScript. Isso inclui:
- Todo submodule documentado
- Todo script npm/build documentado
- Todas as configuracoes (`config.json`, `module.json`) documentadas
- Descricoes de comportamento atualizadas
- Estrutura de arquivos atualizada

## Procedimento

### 1. Listar todos os arquivos fonte do projeto

Buscar todos os `.ts` e `.mjs` nas pastas do projeto (excluindo `.git/`, `node_modules/`, `dist/`):

**Locais esperados:**
- `src/`: codigo TypeScript principal
- `src/submodules/`: submodules do Foundry VTT (NPC, HeroPoints, etc.)
- `src/socket/`: implementacoes de socket
- `src/util/`: utilitarios e helpers
- `src/__tests__/`: testes com vitest
- Raiz: `build.mjs`, `vite.config.ts`, `tsconfig.json`

### 2. Verificar presenca no README.md

Para cada submodule e arquivo relevante encontrado, verificar se ha uma entrada correspondente no `README.md`. O README deve conter:

- **Nome do submodule/arquivo** (nome descritivo)
- **Descricao** do que faz
- **Exports relevantes** (classes, funcoes, interfaces)
- **Dependencias internas** (se aplicavel)

### 3. Verificar scripts npm documentados

Cruzar os scripts definidos no `package.json` com os documentados no README:
- Scripts existentes mas nao documentados -> `[ERRO]`
- Scripts documentados mas nao existentes -> `[WARN]`

### 4. Verificar configuracoes documentadas

Comparar as configuracoes em `config.json` e `module.json` com o que esta documentado:
- Campos de configuracao usados no codigo vs documentados
- Globais registrados (`game.commonScripts`, etc.) vs documentados

### 5. Verificar comportamento documentado vs real

Para submodules ja documentados, comparar:
- O comportamento descrito no README com o codigo real
- Hooks do Foundry registrados vs documentados
- Estrategias de socket mencionadas vs implementadas
- Dependencias externas (`taulukko-commons`, etc.) vs documentadas

### 6. Verificar testes

Todo arquivo em `src/__tests__/` deve estar documentado na secao de testes do README.md com:
- Nome do teste
- O que testa
- Comando de execucao (`npx vitest run`)

## Formato de saida

```
=== SINCRONIZACAO README.md ===

--- Submodules ---
[OK]    npc-system                             | Documentado
[OK]    hero-points                            | Documentado
[ERRO]  region-utils                           | NAO documentado no README
[WARN]  players-tools                          | Documentacao incompleta (falta exports)

--- Scripts npm ---
[OK]    build                                  | Documentado
[OK]    test                                   | Documentado
[ERRO]  dev                                    | NAO documentado no README

--- Configuracoes ---
[OK]    config.json                            | Documentado
[WARN]  module.json                            | Faltam campos documentados

--- Comportamento ---
[OK]    Socket Strategy Pattern                | Documentado corretamente
[WARN]  Lifecycle Hooks                        | Lista de hooks no README difere do codigo
```

### 7. Sugerir correcoes

Para cada `[ERRO]`, gerar um bloco markdown pronto para ser inserido no README.md seguindo o formato existente:

```markdown
### nome-do-submodule

Descricao breve do que faz.

**Arquivo:** `src/submodules/nome-do-submodule.ts`
**Exports:** `ClassePrincipal`, `funcaoHelper`
```

## Quando usar esta skill

- Apos criar ou modificar qualquer submodule TypeScript
- Apos alterar `package.json`, `config.json` ou `module.json`
- Antes de commits que alteram a estrutura do projeto
- Em revisoes de codigo (etapa CODE_REVIEWER do fluxo de agentes)
- Na etapa DOCUMENTATION_WRITER do fluxo de agentes
- Periodicamente para manter a documentacao saudavel
