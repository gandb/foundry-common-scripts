# Especificação: Corrigir Auto-injeção em Singletons

## Objetivo
Identificar e corrigir todas as classes Singletons que tentam resolver a si mesmas através de `injectController.resolve()`, criando uma exceção reutilizável. Substituir por variável global de instância, remover o `waitFor` desnecessário.

## Classes Identificadas com Auto-Referência

| Classe | Arquivo | Linhas com auto-resolve |
|--------|---------|-------------------------|
| PlayersTools | `src/submodules/playertools/players-tool.ts` | 12, 23, 24 |
| HeroPoints | `src/submodules/hero-points/hero-points.ts` | 34, 245, 311 |
| RegionUtils | `src/submodules/region-utils/region-utils.ts` | 21, 109 |
| NPCDialog | `src/submodules/npc/npc-dialog.ts` | 41, 70, 79, 106, 147, 181 |
| HideUnidentify | `src/submodules/hide-unindentify/hide-unidentify.ts` | 23, 32 |
| FlightMovement | `src/submodules/flight-movement/flight-movement.ts` | 24, 34, 41, 63 |

## Padrão de Correção

Para cada classe identificada, implementar:

### 1. Variável Global de Instância
```typescript
// No topo do arquivo, fora da classe
let playersTools: PlayersTools | undefined = undefined;
```

### 2. Atribuição no Construtor
```typescript
export class PlayersTools extends SubModuleBase {
  constructor() {
    super();
    playersTools = this; // Atribuição própria
  }
  // ... resto do código
}
```

### 3. Substituir injectController.resolve("NomeClasse")
```typescript
// Antes (problema)
const playerTools: PlayersTools = injectController.resolve("PlayersTools");

// Depois (solução) - verifica injectController primeiro, senão usa variável global
const playerTools: PlayersTools = 
  (injectController.has("PlayersTools") ? injectController.resolve("PlayersTools") : playersTools) as PlayersTools;
```

**Nota:** Este padrão permite que os testes continuem funcionando com injeção de dependência, enquanto o código de produção usa a variável global quando não há registro no container.

### 4. Remover waitFor desnecessário
Nos métodos `initHooks()` ou `waitReady()`, onde a classe espera por ela mesma via `whaitFor()`, remover essa espera pois a variável global já está disponível.

## Arquivos que serão modificados

1. `src/submodules/playertools/players-tool.ts`
2. `src/submodules/hero-points/hero-points.ts`
3. `src/submodules/region-utils/region-utils.ts`
4. `src/submodules/npc/npc-dialog.ts`
5. `src/submodules/hide-unindentify/hide-unidentify.ts`
6. `src/submodules/flight-movement/flight-movement.ts`

## Testes esperados

1. Todos os testes existentes (`npm test`) devem continuar passando
2. O teste `audit.test.ts` deve continuar validando que os resolved names estão registrados
3. Verificar que as classes funcionam corretamente após a mudança

## Atualização da Documentação

A especificação de como implementar este padrão deve ser documentada no arquivo `docs/spec/inject-controller-audit-spec.md` (ou criar nova seção) para que DEVELOPER e DOCUMENTATION_WRITER saibam como trabalhar com esse padrão no futuro.

### Seção a ser adicionada em inject-controller-audit-spec.md:

```markdown
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
```

## Critérios de Aceite

1. ✅ Auditoria completa - todas as 6 classes identificadas
2. ✅ Padrão implementado - variável global, atribuição no construtor, remover waitFor
3. ✅ Consistência verificada - mesmas mudanças em todas as classes
4. ✅ Sem regressões - testes passando após mudanças
5. ✅ Documentação mínima no código - comentários explicativos
6. ✅ Documentação do padrão em `docs/spec/inject-controller-audit-spec.md`