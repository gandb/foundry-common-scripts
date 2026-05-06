---
name: reload-readme
description: Recarrega apenas o contexto base do projeto e indica quais blocos extras devem ser carregados por tipo de task
---

## Objetivo

Reiniciar uma sessão com contexto base curto, sem releitura ampla de todos os Markdown por padrão.

## Carregamento padrão

1. `README.md`
2. `docs/CONSTITUTION.md`
3. `.opencode/USER.md`

## Carregamento condicional

- **backlog:** carregar `docs/TASKS.md` e `backlog-governance`
- **planejamento:** carregar a spec ativa, o agente `ARCHITECT` e `architecture-context-loader`
- **testes:** carregar a spec ativa, o agente `TESTER` e `test-governance`; carregar `architecture-context-loader` quando o contexto técnico impactar a validação
- **implementação:** carregar a spec ativa, o agente `DEVELOPER`, `implementation-governance` e `architecture-context-loader`
- **review:** carregar diff/artefatos alterados, o agente `CODE_REVIEWER` e auditorias aplicáveis; carregar a spec ativa e `architecture-context-loader` apenas quando o diff ou a task exigirem contexto técnico adicional
- **documentação:** carregar apenas docs afetados, o agente `DOCUMENTATION_WRITER` e `documentation-governance`
- **release:** carregar `CHANGELOG.md`, `package.json` e `release-context-loader`

Se alguma skill listada ainda não aparecer como carregável na sessão atual, leia diretamente o arquivo `SKILL.md` correspondente em `.opencode/skills/`.

## Rotina

1. Leia o contexto base.
2. Identifique com o usuário qual tipo de task será tratada.
3. Indique explicitamente quais artefatos extras precisam ser carregados.
4. Não faça varredura global do repositório salvo pedido explícito do usuário.

## Saída esperada

Se você carregou de fato os arquivos deste documento como esperado, se não o faça, imprima pro usuário apenas:
"Agora tenho conhecimento atualizado do projeto. O que deseja fazer a seguir?" - e depois imprima uma lista numerada das skills do projeto pra ele escolher com uma última opção de "Nenhuma, vou escrever e pedir algo novo".

- identidade do projeto
- regras permanentes
- preferências estáveis do usuário
- próximos carregamentos recomendados por tipo de task

## Autoevolução

Se faltar um critério estável de recarga, use `skill-autoevolution`.
