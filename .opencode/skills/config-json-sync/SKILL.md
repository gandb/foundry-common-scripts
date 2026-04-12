---
name: config-json-sync
description: Sincroniza config.json com o codigo, verificando que toda configuracao lida no runtime esta declarada no config e vice-versa
---

## O que esta skill faz

Garante que o arquivo `config.json` esta sincronizado com o codigo TypeScript que o consome. Verifica que:
- Toda chave lida no codigo existe no `config.json`
- Toda chave no `config.json` e efetivamente usada no codigo
- Os tipos dos valores sao consistentes com o uso no codigo
- Valores padrao (fallbacks) no codigo sao documentados

## Arquivo de configuracao atual

**Localizacao:** `config.json` (raiz do projeto `scripts/`)

**Carregamento:** `src/module.ts:35-37`
```typescript
const configResponse = await fetch('/modules/common-scripts-dnd5ed/scripts/config.json');
const config = await configResponse.json();
const logConfig = config.log || { format: "", prefix: "CA", hasDate: true, hasLevel: true };
```

**Estrutura atual:**
```json
{
  "log": {
    "format": "",
    "prefix": "CS",
    "hasDate": true,
    "hasLevel": true,
    "level": "INFO"
  }
}
```

## Procedimento

### 1. Ler config.json atual

Parsear o arquivo e construir arvore de chaves:
- `log` (object)
  - `log.format` (string)
  - `log.prefix` (string)
  - `log.hasDate` (boolean)
  - `log.hasLevel` (boolean)
  - `log.level` (string)

### 2. Buscar todos os acessos a config no codigo

Buscar em todos os `.ts`:
- `config.` seguido de qualquer propriedade
- `config[` acesso por bracket
- Desestruturacao de config: `const { ... } = config`
- Variavel derivada do config passada adiante

**Acessos conhecidos em module.ts:**
- `config.log` (objeto inteiro)
- `config.log?.level` (com optional chaining)

### 3. Verificar fallbacks

Para cada acesso a config, verificar se ha valor padrao:
- `config.log || { ... }` - fallback com `||`
- `config.log?.level ?? "DEBUG"` - fallback com `??`
- Acesso sem fallback -> `[WARN]` (pode ser undefined em runtime)

Documentar os fallbacks encontrados:
| Chave          | Fallback no codigo              | Valor no config.json |
|----------------|--------------------------------|---------------------|
| `log`          | `{format:"",prefix:"CA",...}`  | `{format:"",prefix:"CS",...}` |
| `log.level`    | `"DEBUG"`                      | `"INFO"` |

### 4. Verificar inconsistencias de fallback vs config

- Fallback tem valor diferente do config.json -> `[WARN]` (ex: prefix "CA" vs "CS")
- Isso indica que o fallback pode estar desatualizado

### 5. Verificar chaves nao usadas

Para cada chave no config.json:
- Se nao e acessada em nenhum `.ts` -> `[WARN]` (configuracao morta)

### 6. Verificar chaves usadas mas nao declaradas

Se o codigo acessa `config.algo` que nao existe no config.json -> `[ERRO]`
(O fallback pode cobrir, mas a chave deveria existir no config)

### 7. Verificar tipos

Para cada chave no config.json, verificar se o uso no codigo e compativel:
- `config.log.level` e string no JSON, usado como `keyof typeof Level` no codigo -> `[OK]` (conversao explicita)
- Tipo no JSON diferente do esperado no codigo -> `[ERRO]`

### 8. Verificar que config.json esta no build

Verificar em `vite.config.ts` e `build.mjs`:
- config.json e copiado para dist ou servido como asset estatico
- O path no fetch (`/modules/common-scripts-dnd5ed/scripts/config.json`) corresponde ao deploy real

## Formato de saida

```
=== SINCRONIZACAO CONFIG.JSON ===

--- Chaves no config.json ---
log.format    : "" (string)
log.prefix    : "CS" (string)
log.hasDate   : true (boolean)
log.hasLevel  : true (boolean)
log.level     : "INFO" (string)

--- Uso no codigo ---
[OK]    config.log           | module.ts:37     | fallback: {format:"",prefix:"CA",...}
[OK]    config.log?.level    | module.ts:38     | fallback: "DEBUG"

--- Consistencia ---
[WARN]  Fallback de log.prefix e "CA" mas config.json tem "CS"
[OK]    Todas as chaves do config.json sao usadas
[OK]    Todos os acessos tem chave correspondente

--- Build ---
[OK]    config.json acessivel via fetch no path esperado
```

## Quando usar esta skill

- Apos modificar config.json
- Apos adicionar novo acesso a config no codigo
- Ao alterar fallbacks no codigo
- Em revisoes de codigo que envolvam configuracao
- Na etapa CODE_REVIEWER do fluxo de agentes
- Antes de releases (verificar que config de producao esta correto)
