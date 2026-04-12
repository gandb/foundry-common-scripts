---
name: foundry-api-compatibility
description: Verifica compatibilidade do codigo com a API do Foundry VTT, detecta uso de APIs deprecated ou inexistentes na versao declarada
---

## O que esta skill faz

Analisa o codigo TypeScript do projeto para verificar se as APIs do Foundry VTT utilizadas sao compativeis com a versao declarada no `module.json`. Detecta:
- APIs deprecated que devem ser substituidas
- APIs inexistentes na versao alvo
- Padroes de uso incorretos da API do Foundry
- Tipos do Foundry usados sem tipagem adequada

## Referencia do projeto

- **module.json**: contem `compatibility.minimum`, `compatibility.verified`, `compatibility.maximum`
- **Tipo do sistema**: D&D 5e (`dnd5e`)
- **Tipagem Foundry**: via `global.d.ts` em `src/global.d.ts`

## Procedimento

### 1. Identificar versao alvo

Ler o arquivo `module.json` (na raiz do modulo, nao na pasta `scripts/`):
- `compatibility.minimum` - versao minima suportada
- `compatibility.verified` - versao testada
- `compatibility.maximum` - versao maxima suportada

O codigo deve ser compativel com TODAS as versoes entre minimum e maximum.

### 2. Buscar uso de APIs do Foundry

Buscar em todos os `.ts` (excluindo `node_modules/`, `dist/`) padroes de uso:

**APIs globais:**
- `game.*` (game.user, game.settings, game.journal, game.actors, etc.)
- `Hooks.*` (Hooks.on, Hooks.once, Hooks.callAll, Hooks.call, Hooks.off)
- `canvas.*` (canvas.tokens, canvas.scene, etc.)
- `ui.*` (ui.notifications, ui.sidebar, etc.)
- `ChatMessage.*`, `Actor.*`, `Item.*`, `Scene.*`, etc.
- `foundry.*` (foundry.utils, foundry.abstract, etc.)

**APIs de DOM do Foundry:**
- `document.getElementById("roll-privacy")` e outros seletores especificos do Foundry UI
- `game.journal.getName()`
- `.sheet.render(true)`

### 3. Verificar APIs deprecated

Para cada API encontrada, verificar se foi deprecated na versao alvo:

**Deprecated comuns no Foundry v10 -> v11 -> v12:**
- `entity` -> `document` (v10)
- `data.data` -> `system` (v10)
- `actor.data.data` -> `actor.system` (v10)
- `item.data.data` -> `item.system` (v10)
- `ChatMessage.create({content})` mudancas de parametros
- `game.settings.register` mudancas de schema (v12)
- `Hooks.on("renderApplication")` -> mudancas com Application v2 (v12)
- `document.sheet.render(true)` -> mudancas com Application v2 (v12)

Para cada uso deprecated -> `[ERRO]` com sugestao de substituicao

### 4. Verificar tipagem do Foundry

Analisar `src/global.d.ts` e verificar:
- Tipos declarados cobrem as APIs usadas no codigo
- Tipos estao corretos para a versao alvo
- `any` excessivo em interfaces Foundry -> `[WARN]`

**Interfaces esperadas em global.d.ts:**
- `FoundryWindow` (window com propriedades do Foundry)
- `FoundryDocument` (document com extensoes)
- Hooks, game, canvas tipos

### 5. Verificar padroes de uso correto

**Verificar acesso seguro a game:**
- `game.user` so esta disponivel apos hook `ready`
- `game.settings` so esta disponivel apos hook `init`
- `game.journal` so esta disponivel apos hook `ready`
- Acesso fora do hook correto -> `[ERRO]`

**Verificar acesso seguro a canvas:**
- `canvas` so esta disponivel apos hook `canvasReady`
- Acesso sem verificacao -> `[WARN]`

**Verificar acesso a DOM do Foundry:**
- Seletores de DOM podem mudar entre versoes
- Seletor sem fallback (verificacao de null) -> `[WARN]`

### 6. Verificar compatibilidade com dnd5e

O sistema dnd5e tem sua propria API que muda entre versoes:
- `actor.system.attributes.hp` (formato correto v10+)
- `actor.system.abilities.str` (formato correto v10+)
- Uso de APIs especificas do dnd5e sem verificacao de sistema -> `[WARN]`

## Formato de saida

```
=== COMPATIBILIDADE FOUNDRY API ===

--- Versao Alvo ---
Minimum: v11
Verified: v12
Maximum: v12
Sistema: dnd5e

--- APIs Utilizadas ---
Arquivo                          | API                        | Versao OK
---------------------------------|----------------------------|----------
src/common-module.ts:94          | Hooks.once("init")         | v11-v12 OK
src/common-module.ts:106         | Hooks.once("ready")        | v11-v12 OK
src/common-module.ts:115         | game.user.isGM             | v11-v12 OK
src/common-module.ts:156         | doc.getElementById(...)    | v11-v12 OK
src/common-module.ts:168         | game.journal.getName(...)  | v11-v12 OK
src/common-module.ts:174         | journal.sheet.render(true) | [WARN] v12 App v2

--- Deprecated ---
[OK]    Nenhum uso de API deprecated detectado

--- Tipagem ---
[WARN]  global.d.ts: FoundryWindow usa `any` em 3 propriedades
[OK]    FoundryDocument tipado corretamente

--- Acesso Seguro ---
[OK]    game.user acessado dentro de hook "ready"
[OK]    game.settings acessado dentro de hook "init"
[OK]    getElementById com verificacao de null
```

## Quando usar esta skill

- Ao atualizar a versao do Foundry VTT no module.json
- Apos adicionar codigo que usa APIs novas do Foundry
- Antes de releases do modulo
- Em revisoes de codigo (etapa CODE_REVIEWER)
- Na etapa ARCHITECT ao planejar uso de novas APIs
- Quando o Foundry VTT lanccar nova major version
