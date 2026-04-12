---
name: dependency-injection-checker
description: Verifica que todos os controllers usam injectController corretamente, que nao ha instanciacao direta e que o container DI esta consistente com taulukko-commons
---

## O que esta skill faz

Audita o uso de injecao de dependencia (DI) no projeto, garantindo que o pattern do `taulukko-commons` (`injectController`) esta sendo usado corretamente e de forma consistente.

## Container DI do projeto

O projeto usa `injectController` do pacote `taulukko-commons` com dois metodos principais:
- `injectController.registerByName(name, instance)` - registra por nome string
- `injectController.registerByClass(instance)` - registra pelo nome da classe
- `injectController.resolve(name)` - resolve uma dependencia por nome

### Registros conhecidos (em `src/module.ts` e `src/common-module.ts`)

| Nome no container       | Tipo              | Onde registrado          |
|------------------------|-------------------|--------------------------|
| `"FoundryDocument"`    | `Document`        | `module.ts:45`           |
| `"CommonModule"`       | `CommonModule`    | `module.ts:46`           |
| `"CommonLogguer"`      | `LogGenericImpl`  | `module.ts:47`           |
| `"Socket"`             | `Socket` (impl)   | `common-module.ts:69`    |
| Submodules (por classe)| `SubModuleBase`   | `common-module.ts:60`    |

## Procedimento

### 1. Mapear todos os registros

Buscar em todos os `.ts`:
- `injectController.registerByName("` -> extrair nome e valor
- `injectController.registerByClass(` -> extrair classe

Construir mapa completo: `{ nome -> tipo, arquivo, linha }`

### 2. Mapear todos os resolves

Buscar em todos os `.ts`:
- `injectController.resolve("` -> extrair nome

Construir mapa: `{ nome -> [arquivo:linha, arquivo:linha, ...] }`

### 3. Verificar consistencia registro/resolve

- Nome resolvido mas nunca registrado -> `[ERRO]` (vai dar erro em runtime)
- Nome registrado mas nunca resolvido -> `[WARN]` (registro desnecessario)
- Nome registrado mais de uma vez -> `[WARN]` (o segundo sobrescreve o primeiro)

### 4. Verificar ordem de registro vs resolve

O registro DEVE ocorrer antes do resolve na sequencia de execucao:
- `module.ts` registra primeiro (executa antes de tudo)
- `CommonModule.init()` registra na sequencia
- Submodules resolvem depois

Verificar se algum resolve pode executar antes do registro correspondente -> `[ERRO]`

### 5. Verificar instanciacao direta

Buscar padroes de instanciacao que deveriam usar DI:
- `new LogGenericImpl(` fora de `module.ts` -> `[ERRO]` (deve usar `resolve("CommonLogguer")`)
- `new CommonModule(` fora de `module.ts` -> `[ERRO]`
- `new DummySocket(` / `new ChatSocket(` / `new SocketLibSocket(` fora de `common-module.ts` -> `[ERRO]` (deve usar `resolve("Socket")`)

**Excecoes permitidas:**
- Submodules instanciados em `CommonModule.loadSubModules()` (padrao do projeto)
- `LogGenericImpl` instanciado em `module.ts` (bootstrap)

### 6. Verificar tipagem nos resolves

O `injectController.resolve()` retorna `any` por padrao. Verificar:
- Se ha cast explicito para o tipo esperado (ex: `const logguer: Log = injectController.resolve(...)`)
- Resolve sem tipagem -> `[WARN]` (perde type safety)

### 7. Verificar que submodules usam DI para dependencias

Dentro de cada submodule em `src/submodules/*/`:
- Dependencias devem ser obtidas via `injectController.resolve()`
- Acesso a `game`, `Hooks`, `document` e' permitido (globais do Foundry)
- Import direto de outro submodule para instanciacao -> `[WARN]` (acoplamento)

## Formato de saida

```
=== AUDITORIA DE INJECAO DE DEPENDENCIA ===

--- Registros ---
Nome                 | Tipo            | Arquivo              | Linha
---------------------|-----------------|----------------------|------
FoundryDocument      | Document        | module.ts            | 45
CommonModule         | CommonModule    | module.ts            | 46
CommonLogguer        | LogGenericImpl  | module.ts            | 47
Socket               | DummySocket     | common-module.ts     | 69

--- Resolves ---
Nome                 | Arquivo                    | Linha
---------------------|----------------------------|------
CommonLogguer        | common-module.ts           | 34
CommonLogguer        | common-module.ts           | 62
CommonModule         | common-module.ts           | 35
Socket               | submodules/npc/npc.ts      | 15

--- Consistencia ---
[OK]    Todos os nomes resolvidos possuem registro correspondente
[WARN]  "FoundryDocument" registrado mas nunca resolvido

--- Instanciacao Direta ---
[OK]    Nenhuma instanciacao direta indevida encontrada

--- Tipagem ---
[OK]    Todos os resolves possuem tipo explicito
```

## Quando usar esta skill

- Apos adicionar novo registro ou resolve no container DI
- Apos criar novo submodule
- Quando houver erros de runtime tipo "Cannot resolve ..."
- Em revisoes de codigo (etapa CODE_REVIEWER)
- Na etapa ARCHITECT ao validar a arquitetura
