# Especificação: Auditoria de injectController.resolve

## Objetivo
Auditar todos os usages de `injectController.resolve` no projeto para garantir que o objeto existe no container no ponto onde é resolvido. Se não existe, é um BUG no código - deve ser corrigido, não tratado com fallback.

## Regra Principal
- Se foi programado para pegar do inject controller, o objeto **DEVE** existir naquele ponto
- O `injectController.has()` só deve ser usado quando há um **fallback preparado** (ex: objeto opcional)
- Se não existe e não há fallback, **corrigir o código** (o objeto deveria ter sido registrado antes)

## Arquivos a modificar
- Todos os arquivos `.ts` em `src/` que contenham `injectController.resolve` sem verificação prévia

## Procedimento

### 1. Mapear todos os usages
Buscar todos os `injectController.resolve` no projeto (~159 ocorrências)

### 2. Categorizar cada usage
- **Tem garantia**: O objeto é registrado antes deste ponto no fluxo de execução → OK, não precisa de mudança
- **Tem fallback**: O código trata o caso de objeto não existir com fallback → OK, mas documentar o fallback
- **Não tem fallback**: Se o objeto não existir, é um bug → **CORRIGIR** (registrar o objeto ou ajustar o fluxo)

### 3. Corrigir casos problemáticos
Para usages sem fallback onde o objeto deveria existir:
- Verificar se o objeto está sendo registrado corretamente no container
- Se não está, adicionar o registro no local apropriado (ex: module.ts, common-module.ts)
- Se está registrado mas em momento errado, ajustar a ordem de registro

## Padrão de Referência
- `npc-dialog.ts` linhas 110-120: Exemplo de verificação com fallback
- `flight-movement.ts` linhas 67-71: Exemplo de verificação com fallback

## Padrão: Auto-Referência em Singletons

Quando uma classe Singleton precisa referenciar a si mesma:

### Não fazer:
```typescript
const minhaClasse: MinhaClasse = injectController.resolve("MinhaClasse");
```

### Fazer:
1. Criar variável global de instância no topo do arquivo:
   ```typescript
   let minhaClasse: MinhaClasse | undefined = undefined;
   ```
2. Atribuir no construtor:
   ```typescript
   constructor() {
     super();
     minhaClasse = this;
   }
   ```
3. Usar a variável global ao invés do resolve:
   ```typescript
   const instance: MinhaClasse = minhaClasse as MinhaClasse;
   ```

### Quando usar:
- Classes que são Singletons registrados via `injectController.registerByClass()`
- Classes que precisam referenciar a si mesmas em métodos como `initHooks()` ou `waitReady()`
- Não usar para dependências externas (CommonLogguer, CommonModule, etc)

### Classes que seguem este padrão:
- `PlayersTools` (`src/submodules/playertools/players-tool.ts`)
- `HeroPoints` (`src/submodules/hero-points/hero-points.ts`)
- `RegionUtils` (`src/submodules/region-utils/region-utils.ts`)
- `NPCDialog` (`src/submodules/npc/npc-dialog.ts`)
- `HideUnidentify` (`src/submodules/hide-unindentify/hide-unidentify.ts`)
- `FlightMovement` (`src/submodules/flight-movement/flight-movement.ts`)

## Testes esperados
1. Todos os testes existentes (`npm test`) devem continuar passando
2. Não deve haver regressões em funcionalidades existentes