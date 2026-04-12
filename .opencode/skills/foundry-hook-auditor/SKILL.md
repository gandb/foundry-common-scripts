---
name: foundry-hook-auditor
description: Audita todos os Hooks do Foundry registrados no projeto, verifica documentacao, cleanup correto e ausencia de hooks duplicados
---

## O que esta skill faz

Analisa todo o codigo TypeScript do projeto para encontrar e validar todos os registros de Hooks do Foundry VTT (`Hooks.on`, `Hooks.once`, `Hooks.callAll`, `Hooks.call`). Garante que:
- Todos os hooks registrados estao documentados
- Nao ha hooks duplicados
- `Hooks.once` vs `Hooks.on` estao sendo usados corretamente
- Hooks customizados estao documentados e sendo chamados

## Hooks conhecidos do Foundry VTT

### Hooks de lifecycle (usados neste projeto)
- `init` - Foundry esta inicializando, registrar settings e configs
- `ready` - Foundry esta pronto, todos os dados carregados

### Hooks customizados do projeto
- `onReadyCommonModule` - Disparado quando o CommonModule termina de carregar
- `onReadyCommonSocket` - Definido como constante `CALLBACK_FUNCTION_EVENT_NAME`

## Procedimento

### 1. Buscar todos os registros de Hooks

Buscar em todos os arquivos `.ts` do projeto (excluindo `node_modules/`, `dist/`):

**Padroes a buscar:**
- `Hooks.on("` - registro persistente
- `Hooks.once("` - registro one-shot
- `Hooks.callAll("` - disparo de hook customizado
- `Hooks.call("` - disparo de hook customizado (com retorno)

Para cada ocorrencia, registrar:
- Arquivo e linha
- Tipo (`on`, `once`, `callAll`, `call`)
- Nome do hook
- Se esta dentro de `initHooks()` (padrao esperado) ou em outro local

### 2. Verificar duplicatas

Detectar hooks registrados mais de uma vez:
- Mesmo nome de hook com `Hooks.on` em multiplos locais -> `[WARN]` (pode ser intencional)
- Mesmo nome de hook com `Hooks.once` em multiplos locais -> `[ERRO]` (provavel bug, o segundo nunca executa se o primeiro ja consumiu)
- Hook registrado com `on` E `once` para o mesmo evento -> `[WARN]`

### 3. Verificar uso correto de once vs on

- `init` e `ready` DEVEM usar `Hooks.once` (sao eventos unicos do lifecycle)
- Hooks de rendering (`renderChatMessage`, `renderActorSheet`, etc.) DEVEM usar `Hooks.on` (ocorrem multiplas vezes)
- Hooks customizados: verificar se faz sentido ser `once` ou `on`

### 4. Verificar hooks customizados

Para cada `Hooks.callAll` ou `Hooks.call`:
- Verificar se existe pelo menos um `Hooks.on` ou `Hooks.once` correspondente
- Hook customizado disparado mas nunca escutado -> `[WARN]`
- Hook customizado escutado mas nunca disparado -> `[ERRO]`

### 5. Verificar cleanup

Para hooks registrados com `Hooks.on` (persistentes):
- Verificar se ha `Hooks.off` correspondente quando o modulo/submodule e descarregado
- Se nao ha cleanup -> `[WARN]` (pode causar memory leak)

### 6. Verificar que hooks estao em initHooks()

No padrao do projeto, todos os hooks devem ser registrados dentro do metodo `initHooks()`:
- Hook registrado fora de `initHooks()` -> `[WARN]` (quebra padrao do projeto)
- Hook registrado no constructor -> `[ERRO]` (nao deve ter side effects no constructor)

### 7. Verificar documentacao

Cruzar hooks encontrados com o README.md:
- Hook usado mas nao documentado -> `[ERRO]`
- Hook documentado mas nao usado -> `[WARN]`

## Formato de saida

```
=== AUDITORIA DE HOOKS ===

--- Hooks Registrados ---
Arquivo                          | Tipo  | Hook               | Local
---------------------------------|-------|--------------------|------------------
src/common-module.ts:94          | once  | init               | initHooks() [OK]
src/common-module.ts:106         | once  | ready              | initHooks() [OK]
src/common-module.ts:84          | call  | onReadyCommonModule| waitReady() [OK]
src/submodules/npc/npc.ts:25     | once  | ready              | initHooks() [OK]

--- Duplicatas ---
[OK]    Nenhuma duplicata detectada

--- Once vs On ---
[OK]    init: usando Hooks.once (correto)
[OK]    ready: usando Hooks.once (correto)

--- Hooks Customizados ---
[OK]    onReadyCommonModule: disparado E escutado
[WARN]  onReadyCommonSocket: definido como constante mas nao encontrado em Hooks.callAll

--- Cleanup ---
[WARN]  Nenhum Hooks.off encontrado no projeto (ok se todos sao once)

--- Documentacao ---
[OK]    init documentado no README
[ERRO]  onReadyCommonModule nao documentado no README
```

## Quando usar esta skill

- Apos registrar novos hooks no projeto
- Apos criar novo submodule (que registra hooks em initHooks)
- Em revisoes de codigo que envolvam hooks
- Quando houver bugs de "hook nao dispara" ou "callback executado duas vezes"
- Na etapa CODE_REVIEWER do fluxo de agentes
- Periodicamente para detectar hooks orfaos
