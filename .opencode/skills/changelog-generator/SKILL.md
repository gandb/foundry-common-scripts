---
name: changelog-generator
description: Gera changelog automatico baseado nos commits e nas TASKs do PRODUCT_OWNER, formatado para release notes do modulo Foundry VTT
---

## O que esta skill faz

Gera um changelog estruturado para releases do modulo Foundry VTT, baseado em:
- Commits do git desde a ultima tag/release
- TASKs concluidas no PRODUCT_OWNER.md
- Alteracoes no package.json (versao)
- Alteracoes no module.json (compatibilidade)
- Gera arquivo se não existir ou o modifica o arquivo CHANGELOG.md na raiz

## Contexto do projeto

- **Modulo:** common-scripts-dnd5ed (Foundry VTT D&D 5e)
- **Versao package.json:** campo `version` em `package.json`
- **Versao do modulo:** campo `version` em `CommonModule` (`src/common-module.ts`)
- **TASKs:** listadas em `.opencode/agents/PRODUCT_OWNER.md`

## Procedimento

### 1. Identificar escopo do changelog

**Determinar versao atual:**
- Ler `package.json` -> campo `version`
- Ler `src/common-module.ts` -> campo `version` da classe `CommonModule`
- Se as duas versoes divergem -> `[WARN]` (devem estar sincronizadas)

**Determinar ponto de partida:**
- Buscar ultima tag git: `git describe --tags --abbrev=0`
- Se nao ha tags, usar o primeiro commit: `git rev-list --max-parents=0 HEAD`
- Listar commits desde o ponto de partida: `git log <tag>..HEAD --oneline`

### 2. Categorizar commits

Analisar cada commit e categorizar:

| Categoria       | Prefixos/Padroes                           | Emoji |
|----------------|-------------------------------------------|-------|
| **Novo**       | feat, add, new, criar, adicionar          | -     |
| **Alterado**   | change, update, alterar, atualizar, refactor | -  |
| **Corrigido**  | fix, bugfix, corrigir, correção           | -     |
| **Removido**   | remove, delete, remover                   | -     |
| **Documentacao** | docs, readme, documentar                | -     |
| **Interno**    | chore, ci, build, test                    | -     |

Se o commit nao se encaixa em nenhuma categoria, classificar como **Alterado**.

### 3. Cruzar com TASKs do PRODUCT_OWNER

Ler `.opencode/agents/PRODUCT_OWNER.md` e identificar TASKs marcadas com checkmark que foram concluidas desde a ultima release.

Para cada TASK concluida, verificar se ha commit correspondente. TASKs sem commit associado -> `[INFO]` (pode ter sido feita em batch).

### 4. Verificar mudancas de compatibilidade

Ler `module.json` e verificar se houve alteracao em:
- `compatibility.minimum` - breaking change potencial
- `compatibility.verified` - nova versao testada
- `compatibility.maximum` - expansao de suporte

Alteracao de `minimum` para cima -> deve ser destaque no changelog como **Breaking Change**.

### 5. Gerar changelog

**Formato padrao:**

```markdown
# Changelog - common-scripts-dnd5ed

## [1.11.58] - 2026-04-12

### Compatibilidade
- Foundry VTT: v11 - v12
- Sistema: D&D 5e

### Novo
- Adicionado submodule RegionUtils para manipulacao de regioes do Foundry
- Adicionado sistema de Socket com Strategy Pattern (Dummy, Chat, SocketLib)

### Alterado
- Migrada documentacao de Bash para TypeScript
- Atualizado README.md com estrutura completa do projeto

### Corrigido
- Corrigido typo em CONSTITUTION.md (CONSTITUITION -> CONSTITUTION)

### Interno
- Atualizados agentes do OpenCode para priorizar TypeScript
- Criadas 8 novas skills para o OpenCode
```

### 6. Verificar consistencia de versao

Antes de finalizar, verificar:
- Versao no changelog corresponde a `package.json`
- Versao no changelog corresponde a `CommonModule.version`
- Data do changelog e a data atual
- Se e major/minor/patch condiz com as mudancas (breaking = major, feature = minor, fix = patch)

### 7. Sugerir atualizacao de versao (se necessario)

Se as mudancas indicam que a versao deveria ser incrementada:
- Tem breaking changes mas versao e' patch -> `[WARN]` sugerir major bump
- Tem features novas mas versao e' patch -> `[WARN]` sugerir minor bump

## Formato de saida final

```
=== CHANGELOG GENERATOR ===

--- Escopo ---
Versao atual: 1.11.58
Ultima tag: v1.11.57
Commits desde tag: 15

--- Categorias ---
Novo: 3 itens
Alterado: 5 itens
Corrigido: 2 itens
Removido: 0 itens
Documentacao: 3 itens
Interno: 2 itens

--- TASKs ---
TASKs concluidas neste periodo: 4
TASKs com commit associado: 3
TASKs sem commit: 1

--- Versao ---
[OK]    package.json e CommonModule.version sincronizados
[OK]    Incremento de versao condiz com mudancas (minor)

--- Changelog gerado em CHANGELOG.md ---
```

## Regras de filtragem do conteudo

O changelog e voltado para o usuario final (jogadores e GMs do Foundry VTT). Aplicar os seguintes filtros:

1. **Nunca mencionar IA, agentes ou ferramentas de desenvolvimento** - Nao incluir referencias a OpenCode, agentes (SCRUM_MASTER, ARCHITECT, etc.), skills, prompts ou qualquer ferramenta de IA. Isso e interno.

2. **Nunca mencionar TASKs** - TASKs sao controle interno. No changelog, descrever apenas o que foi feito. Se uma TASK e seu bugfix aconteceram na mesma versao, mencionar apenas a funcionalidade final entregue (nao o bug intermediario).

3. **Nao mencionar infraestrutura de desenvolvimento** - Excluir itens como: scripts de build, arquivos .sh, configuracoes de CI/CD, scripts de deploy, backup, geracao de chaves, etc.

4. **Nao mencionar mudancas tecnicas internas** - Excluir itens como: troca de linguagem de programacao (JS para TS), refatoracoes internas, mudancas de bundler, reorganizacao de pastas, etc. O usuario final nao precisa saber disso.

5. **Sempre verificar sincronizacao de versoes** - Antes de gerar o changelog, confirmar que `package.json`, `CommonModule.version` e `module.json` estao com a mesma versao. Se divergirem, avisar e sugerir correcao antes de gerar.

6. **Focar no que o usuario ve** - Incluir apenas funcionalidades visiveis no Foundry VTT: novos botoes, dialogos, correcoes de comportamento em jogo, mudancas de compatibilidade, etc.

7. **Consolidar por funcionalidade dentro da mesma versao** - Quando uma funcionalidade nova, suas correcoes e seus ajustes acontecem todos na mesma versao (entre a tag anterior e a atual), consolidar tudo em um unico item na secao "Novo". Correcoes e alteracoes so devem aparecer em "Corrigido" ou "Alterado" se o item ja existia em uma versao anterior que o usuario final ja teve acesso. A pergunta-chave e: "o usuario final ja tinha acesso a essa funcionalidade antes desta release?" Se nao, tudo e "Novo".

## Quando usar esta skill

- Antes de cada release/deploy do modulo
- Quando o usuario pedir para gerar release notes
- Na etapa DOCUMENTATION_WRITER ao preparar release
- Periodicamente para manter historico de mudancas
- Apos sprint de desenvolvimento com multiplas TASKs concluidas
