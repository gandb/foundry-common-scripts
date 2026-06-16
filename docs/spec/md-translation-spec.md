# Spec: Converter todos os arquivos .md para inglês

## Objetivo

Traduzir todo o conteúdo em português dos 9 arquivos `.md` do projeto para inglês, renomear pastas/arquivos com nomes em português e ajustar links internos.

## Decisões aprovadas pelo USUÁRIO (PO)

1. **Rename** files/directories from Portuguese names (`relatorios` → `reports`, `diario-de-bordo.md` → `journal-log.md`) and adjust all internal links pointing to them.
2. **Tradução in-place**: substituir conteúdo existente, não criar versões paralelas.
3. **Ignorar tasks concluídas** (✅) no TASKS.md — apenas traduzir as pendentes.
4. **Todo o conteúdo em inglês**, incluindo cabeçalhos, tabelas e corpo.

## Arquivos afetados

| # | Caminho atual | Novo caminho | Ação |
|---|--------------|-------------|------|
| 1 | `scripts/AGENTS.md` | `scripts/AGENTS.md` | Traduzir in-place |
| 2 | `scripts/README.md` | `scripts/README.md` | Traduzir in-place |
| 3 | `scripts/CHANGELOG.md` | `scripts/CHANGELOG.md` | Traduzir in-place (tudo em inglês) |
| 4 | `scripts/docs/TASKS.md` | `scripts/docs/TASKS.md` | Traduzir apenas tasks pendentes; ignorar ✅ |
| 5 | `scripts/docs/spec/inject-controller-audit-spec.md` | `scripts/docs/spec/inject-controller-audit-spec.md` | Traduzir in-place |
| 6 | `scripts/docs/spec/auto-injection-fix-spec.md` | `scripts/docs/spec/auto-injection-fix-spec.md` | Traduzir in-place |
| 7 | `scripts/docs/spec/npc-portrait-event-ocultar-spec.md` | `scripts/docs/spec/npc-portrait-event-ocultar-spec.md` | Traduzir in-place |
| 8 | `scripts/docs/relatorios/diario-de-bordo.md` | `scripts/docs/reports/journal-log.md` | Renomear pasta + arquivo + traduzir + ajustar links |
| 9 | `docs/relatorios/diario-de-bordo.md` | `docs/reports/journal-log.md` | Renomear pasta + arquivo + traduzir + ajustar links |

## Regras de renomeação

### Pastas
- `relatorios/` → `reports/` (em ambos os níveis: raiz e scripts/)

### Arquivos
- `diario-de-bordo.md` → `journal-log.md`

### Links a ajustar
Todos os links internos que apontam para `docs/relatorios/diario-de-bordo.md` ou `scripts/docs/relatorios/diario-de-bordo.md` devem ser atualizados para:
- `docs/reports/journal-log.md` (nível raiz)
- `scripts/docs/reports/journal-log.md` (nível scripts/)

### Arquivos que referenciam o diario-de-bordo
Verificar em todos os arquivos .md e `.ts` se há caminhos hard-coded para `diario-de-bordo.md`.

## Regras de tradução

### AGENTS.md
- Manter estrutura Markdown, tabelas e blocos de código
- Traduzir apenas texto visível (títulos, descrições, regras)
- Manter nomes técnicos em inglês (`injectController`, `CommonModule`, etc.)
- Manter termos de agentes: `ORÁCULO` → `ORACLE`, `USUÁRIO` → `USER`, `COOPERADOR` → `COORDINATOR`

### README.md
- Traduzir todo o conteúdo textual
- Manter código TypeScript/JSON inalterado
- Manter nomes de arquivos, classes e métodos em inglês
- Traduzir tabelas (cabeçalhos + corpo)

### CHANGELOG.md
- Tudo em inglês: cabeçalhos (`Fixed`, `Changed`, `New`, `Removed`) e corpo
- Manter formato Markdown existente

### TASKS.md
- Traduzir apenas tasks pendentes (linhas sem ✅)
- Ignorar tasks concluídas (✅) — manter como estão
- Traduzir títulos de seções

### Specs (.md em docs/spec/)
- Traduzir todo o conteúdo textual
- Manter blocos de código inalterados
- Manter referências a arquivos e linhas

### diario-de-bordo.md → journal-log.md
- Traduzir cabeçalhos e labels (ex: `ORACULO | read` → `ORACLE | read`)
- Manter timestamps e caminhos intactos

## Critérios de aceite

1. Todos os 9 arquivos traduzidos para inglês
2. Pastas renomeadas (`relatorios/` → `reports/`) em ambos os níveis
3. Arquivos renomeados (`diario-de-bordo.md` → `journal-log.md`) em ambos os níveis
4. Links internos atualizados nos arquivos que referenciam os caminhos renomeados
5. Tasks concluídas (✅) no TASKS.md não foram alteradas
6. Blocos de código (.ts, .json, .md code blocks) mantidos inalterados
7. Estrutura Markdown preservada (títulos, tabelas, listas)

## Escopo fechado

- Apenas arquivos `.md` listados acima
- Nenhum arquivo de código `.ts`/`.js` modificado (exceto caminhos hard-coded se encontrados)
- Sem mudança de comportamento funcional
