---
name: typescript-strict-audit
description: Audita o codigo TypeScript contra boas praticas como any implicito, tipos faltantes, exports nao tipados, interfaces vs types e consistencia de nomenclatura
---

## O que esta skill faz

Realiza uma auditoria de qualidade do codigo TypeScript do projeto, verificando aderencia a boas praticas e ao estilo do projeto. Complementa o compilador TypeScript com verificacoes que o `tsc` nao faz.

## Configuracao de referencia

**tsconfig.json** do projeto define as regras do compilador. Esta skill vai ALEM do que o compilador verifica.

## Procedimento

### 1. Verificar uso de `any`

Buscar em todos os `.ts` (excluindo `node_modules/`, `dist/`, `*.d.ts`):

**any explicito:**
- Parametro com tipo `any` -> `[WARN]` (justificavel em interop com Foundry)
- Retorno com tipo `any` -> `[WARN]`
- Variavel com tipo `any` -> `[WARN]`
- Cast `as any` -> `[WARN]` (necessario para Foundry globals, mas deve ser minimizado)

**any implicito:**
- Funcao sem tipo de retorno declarado -> `[WARN]`
- Parametro sem tipo -> `[ERRO]` (se strict e' true no tsconfig)
- Variavel sem tipo e sem inferencia clara -> `[WARN]`

**Excecoes aceitas:**
- `(window as any) as FoundryWindow` - padrao do projeto para cast do window
- Parametros de callbacks do Foundry (`Hooks.once("ready", async () => {...})`)
- Metodos da interface Socket que usam `...data: any` (compatibilidade)

### 2. Verificar exports e interfaces

**Exports:**
- Classe publica sem export -> `[WARN]` (pode ser intencional)
- Funcao exportada sem tipo de retorno -> `[WARN]`
- Re-export em index.ts faltando para classe usada externamente -> `[ERRO]`

**Interfaces vs Types:**
- Interface vazia -> `[WARN]` (ex: `SubModuleBase` sem metodos adicionais pode ser intencional)
- Type alias desnecessario (apenas renomeia um tipo primitivo) -> `[WARN]`
- Interface que deveria ser type (uniao de tipos, por exemplo) -> `[INFO]`

### 3. Verificar nomenclatura

**Convencoes do projeto:**
- Classes: PascalCase (ex: `CommonModule`, `SubModuleBase`, `DummySocket`)
- Interfaces: PascalCase sem prefixo I (ex: `Socket`, NAO `ISocket`)
- Metodos: camelCase (ex: `initHooks`, `waitReady`)
- Constantes: UPPER_SNAKE_CASE (ex: `CALLBACK_FUNCTION_EVENT_NAME`, `COMMON_REGISTERED_NAMES`)
- Arquivos: kebab-case (ex: `common-module.ts`, `sub-module-base.ts`)
- Diretorios: kebab-case (ex: `hero-points/`, `dialog-utils/`)
- Campos privados: prefixo `#` (ex: `#debug`, `#hooksRequiredLoaded`)

**Verificar:**
- Classe fora do padrao PascalCase -> `[ERRO]`
- Arquivo com nome diferente da classe principal -> `[WARN]`
- Constante que deveria ser UPPER_SNAKE_CASE -> `[WARN]`
- Membro privado sem `#` usando `private` keyword -> `[INFO]` (projeto usa ambos)

### 4. Verificar padroes de classe

**Heranca:**
- Submodule que NAO estende `SubModuleBase` -> `[ERRO]`
- Classe que estende `ModuleBase` diretamente (exceto `CommonModule` e `SubModuleBase`) -> `[WARN]`

**Metodos abstratos:**
- Classe com `initHooks` ou `waitReady` que NAO sao override de abstract -> `[WARN]`
- Submodule sem implementacao de `initHooks()` -> `[ERRO]`
- Submodule sem implementacao de `waitReady()` -> `[ERRO]`

**Campos de classe:**
- Campo publico mutavel que deveria ser readonly -> `[WARN]`
- Campo `name` e `version` devem ser readonly (padrao de `CommonModule`)

### 5. Verificar imports

- Import nao utilizado -> `[WARN]` (normalmente o IDE/compilador pega)
- Import circular (A importa B, B importa A) -> `[ERRO]`
- Import de caminho absoluto ao inves de relativo -> `[WARN]`
- Import de `dist/` -> `[ERRO]`

### 6. Verificar async/await

- Funcao `async` que nunca usa `await` -> `[WARN]`
- Promise nao awaited (fire-and-forget) sem justificativa -> `[WARN]`
- `.then()` misturado com `async/await` no mesmo escopo -> `[WARN]` (projeto tem isso em `loadSubModules`)

### 7. Verificar error handling

- `catch` vazio ou que engole erro -> `[ERRO]`
- `Promise` sem `.catch()` e sem try/catch -> `[WARN]`
- throw sem tipo de erro especifico -> `[INFO]`

## Formato de saida

```
=== AUDITORIA TYPESCRIPT ===

--- Uso de any ---
Total: 12 ocorrencias
[WARN]  src/module.ts:8          | (window as any) as FoundryWindow    | ACEITO (padrao projeto)
[WARN]  src/sockets/common-socket.ts:7 | ...data: any                 | ACEITO (interface socket)
[WARN]  src/common-module.ts:184 | type: any = String                  | Pode ser tipado melhor

--- Nomenclatura ---
[OK]    Classes: todas PascalCase
[OK]    Arquivos: todos kebab-case
[WARN]  src/submodules/hide-unindentify/ | typo: "unindentify" -> "unidentify"

--- Heranca ---
[OK]    Todos submodules estendem SubModuleBase
[OK]    Apenas CommonModule estende ModuleBase diretamente

--- Async/Await ---
[WARN]  src/common-module.ts:59-64 | .then() misturado com async em loadSubModules

--- Resumo ---
Erros: 0
Warnings: 5
Info: 2
```

## Quando usar esta skill

- Em revisoes de codigo (etapa CODE_REVIEWER)
- Apos refatoracoes grandes
- Antes de releases
- Periodicamente para manter qualidade do codigo
- Na etapa ARCHITECT ao validar padroes
