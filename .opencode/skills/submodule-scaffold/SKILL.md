---
name: submodule-scaffold
description: Gera a estrutura completa de um novo submodule incluindo arquivo TypeScript, registro no CommonModule, hook lifecycle, teste vitest e entrada no README
---

## O que esta skill faz

Gera todos os arquivos e registros necessarios para criar um novo submodule no projeto, seguindo os padroes existentes. Isso garante consistencia entre todos os submodules e evita esquecer etapas.

## Pre-requisitos

Antes de executar, confirmar com o usuario:
- **Nome do submodule** (ex: `spell-tracker`)
- **Descricao curta** do que faz
- **Hooks do Foundry** que vai usar (ex: `init`, `ready`, `renderChatMessage`)

## Procedimento

### 1. Criar diretorio do submodule

Criar pasta em `src/submodules/<nome-do-submodule>/`.

**Convencao de nomes:**
- Diretorio: kebab-case (ex: `spell-tracker`)
- Classe: PascalCase (ex: `SpellTracker`)
- Arquivo principal: mesmo nome do diretorio (ex: `spell-tracker.ts`)

### 2. Criar arquivo TypeScript principal

Gerar `src/submodules/<nome>/nome.ts` seguindo o padrao dos submodules existentes:

```typescript
import { Log, injectController } from "taulukko-commons";
import { SubModuleBase } from "../sub-module-base";

export class NomeDoSubmodule extends SubModuleBase {

    protected async initHooks(): Promise<void> {
        const logguer: Log = injectController.resolve("CommonLogguer");
        
        Hooks.once("ready", async () => {
            logguer.debug("NomeDoSubmodule: ready hook fired");
            // Implementacao aqui
        });
    }

    protected async waitReady(): Promise<void> {
        // Polling ou evento que indica que o submodule esta pronto
    }
}
```

**Regras obrigatorias:**
- DEVE estender `SubModuleBase`
- DEVE implementar `initHooks()` e `waitReady()`
- DEVE usar `injectController.resolve("CommonLogguer")` para logging
- NAO deve instanciar dependencias diretamente (usar DI)

### 3. Registrar no index de submodules

Adicionar export em `src/submodules/index.ts`:

```typescript
export { NomeDoSubmodule } from "./nome-do-submodule/nome-do-submodule";
```

### 4. Registrar no CommonModule

Adicionar no metodo `loadSubModules()` em `src/common-module.ts`:

1. Adicionar import no topo do arquivo
2. Adicionar `new NomeDoSubmodule()` no array `subModules` dentro de `loadSubModules()`

### 5. Registrar no module.ts (se necessario)

Se o submodule precisa ser exposto globalmente via `win.TaulukkoCommon`, adicionar:
1. Import no `src/module.ts`
2. Propriedade no objeto `win.TaulukkoCommon`

### 6. Criar teste vitest

Gerar `src/__tests__/nome-do-submodule.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NomeDoSubmodule } from "../submodules/nome-do-submodule/nome-do-submodule";

// Mock taulukko-commons
vi.mock("taulukko-commons", () => ({
    injectController: {
        resolve: vi.fn().mockReturnValue({
            debug: vi.fn(),
            info: vi.fn(),
            error: vi.fn(),
        }),
        registerByClass: vi.fn(),
        registerByName: vi.fn(),
    },
    Log: vi.fn(),
}));

// Mock Foundry globals
(globalThis as any).Hooks = {
    once: vi.fn(),
    on: vi.fn(),
    callAll: vi.fn(),
};
(globalThis as any).game = {
    user: { isGM: false },
    settings: { register: vi.fn(), get: vi.fn(), set: vi.fn() },
};

describe("NomeDoSubmodule", () => {
    let submodule: NomeDoSubmodule;

    beforeEach(() => {
        vi.clearAllMocks();
        submodule = new NomeDoSubmodule();
    });

    it("deve ser instanciavel", () => {
        expect(submodule).toBeInstanceOf(NomeDoSubmodule);
    });

    it("deve registrar hooks ao inicializar", async () => {
        // Testar que initHooks registra os hooks esperados
    });
});
```

### 7. Atualizar README.md

Adicionar entrada na secao de submodules do README.md seguindo o formato:

```markdown
### NomeDoSubmodule

Descricao do que faz.

**Arquivo:** `src/submodules/nome-do-submodule/nome-do-submodule.ts`
**Classe:** `NomeDoSubmodule` (extends `SubModuleBase`)
**Hooks:** `ready` (ou os hooks utilizados)
```

## Checklist final

- [ ] Arquivo `.ts` criado em `src/submodules/<nome>/`
- [ ] Classe estende `SubModuleBase`
- [ ] `initHooks()` e `waitReady()` implementados
- [ ] Export adicionado em `src/submodules/index.ts`
- [ ] Instancia adicionada em `CommonModule.loadSubModules()`
- [ ] Teste vitest criado com mocks corretos
- [ ] README.md atualizado
- [ ] Build passa sem erros (`npm run build`)

## Quando usar esta skill

- Quando o usuario pedir para criar um novo submodule
- Quando o ARCHITECT definir um novo submodule na arquitetura
- Quando o PRODUCT_OWNER definir uma nova funcionalidade que requer submodule proprio
