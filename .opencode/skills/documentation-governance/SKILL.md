---
name: documentation-governance
description: Define como atualizar README, changelog e documentação afetada sem carregar contexto desnecessário
---

## Objetivo

Atualizar apenas a documentação permanente realmente impactada pela task atual.

## Carregamento mínimo

- spec ativa, quando existir
- arquivos documentais afetados pela entrega
- `README.md` para mudanças permanentes de uso, comandos, estrutura ou identidade
- `CHANGELOG.md` apenas em tasks de release

## Regras

1. `README.md` é a referência pública principal do projeto.
2. Não atualizar documentação não afetada só para "aproveitar o contexto".
3. Não reler todos os Markdown por padrão.
4. Relatórios em `docs/relatorios/` são referência de validação, não alvo automático de edição.
5. Templates e runtime só devem ser tocados se a task aprovada exigir.
6. Sempre que encontrar referência num arquivo md, procure o arquivo e se existir no projeto crie um link para ele no padrão markdown. Se encontrar nos documentos outros sem links para arquivos md, crie os links se o arquivo existir. Ignore arquivos da pasta template.

## Rotina por tipo de entrega

### Feature ou ajuste estrutural

- atualize `README.md` se mudar comportamento permanente, comandos, mapa ou políticas base
- atualize `docs/CONSTITUTION.md` ou `docs/ARCHITECTURE.md` apenas se a mudança for transversal e estável

### Release

- carregue `release-context-loader`
- atualize `CHANGELOG.md`
- sincronize a versão com `package.json`

### Documentação interna de tarefa

- atualize apenas os arquivos citados na spec ativa
- preserve relatórios externos ao escopo

## Validação recomendada

- use `readme-sync-enforcer` quando houver mudança em `README.md`
- use `changelog-generator` quando houver release

## Autoevolução

Se surgir lacuna estável na governança documental, use `skill-autoevolution`.
