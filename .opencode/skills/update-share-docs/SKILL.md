---
name: update-share-docs
description: Executa a distribuição de documentos compartilhados para todos os projetos ativos
mode: subagent
permission:
  bash: allow
  edit: deny
---

## Objetivo

Distribuir automaticamente documentos compartilhados para todos os projetos ativos listados em [`docs/list-of-active-projects.md`](docs/list-of-active-projects.md).

## Tool Reference

Esta skill utiliza a tool formalizada em:
`.opencode/tools/update-share-docs/tool.json`

O manifesto da tool contém:
- Metadados (nome, versão, descrição)
- Caminho do script: `src/update-share-docs.sh`
- Variáveis de ambiente necessárias: `PROJECT_GENERATOR_PATH`
- Comportamento de saída esperado

## Regras permanentes

- **Exclusiva do SCRUM_MASTER**: Apenas o agente SCRUM_MASTER deve invocar esta skill.
- **Modo privado**: Não expor detalhes internos ao usuário; apenas relatório final.
- **Usar a tool formalizada**: Invocar conforme descrito no manifesto, não chamar o script diretamente.

## Variáveis de ambiente

| Variável | Descrição |
|----------|-----------|
| `PROJECT_GENERATOR_PATH` | Caminho base do repositório; o script concatena `/templates/generic-project/share/` internamente |

## Procedimento

1. Verificar se `PROJECT_GENERATOR_PATH` está definida no ambiente.
2. Consultar o manifesto da tool em `.opencode/tools/update-share-docs/tool.json` para confirmar caminho do script e comportamento esperado.
3. Executar a tool via bash:
   ```bash
   bash src/update-share-docs.sh
   ```
4. Relatar ao usuário:
   - Se erro (stderr): mostrar mensagem de erro
   - Se sucesso (stdout): "Todos os projetos atualizados com X arquivos"
   - Se 0 arquivos: "0 arquivos para distribuir"

## Comportamento esperado da tool

(igual ao existente — vide SKILL.md atual para detalhes)

- **Variável ausente**: Erro não-zero com mensagem clara
- **Pasta share vazia/inexistente**: "0 arquivos para distribuir", encerra sem erro
- **Projeto inexistente na lista**: Aviso logado, projeto pulado, continua
- **Arquivo já existe no destino**: Substituído silenciosamente
- **Execução normal com N projetos e M arquivos**: "Todos os projetos atualizados com X arquivos" (X = N × M)

## Autoevolução

Se faltar um critério estável de distribuição, use `skill-autoevolution`.
