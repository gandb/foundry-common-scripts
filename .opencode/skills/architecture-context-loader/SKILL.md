---
name: architecture-context-loader
description: Carrega apenas o subconjunto arquitetural relevante para a task técnica ativa
---

## Objetivo

Montar um briefing técnico curto sem reler toda a documentação estrutural do projeto.

## Fontes permitidas

- `docs/ARCHITECTURE.md`
- `docs/CONSTITUTION.md`
- spec ativa
- artefatos diretamente afetados pela task

## Matriz de carregamento

| Cenário | Carregar |
| --- | --- |
| Planejamento | regras centrais + seções arquiteturais do domínio afetado + spec ativa |
| Implementação | decisões técnicas aplicáveis ao diff + spec ativa |
| Code review | restrições permanentes + arquitetura do trecho alterado |
| Testes | somente o contexto técnico necessário para validar os requisitos |

## Rotina

1. Identifique o tipo da task técnica.
2. Leia apenas as seções arquiteturais necessárias.
3. Resuma em um briefing curto com:
   - restrições obrigatórias
   - exceções permitidas
   - arquivos/padrões impactados
4. Não expanda para backlog, release ou documentação geral sem necessidade.

## Saída esperada

Um resumo curto do tipo:

```md
Briefing técnico da task ativa:
- regras permanentes aplicáveis: ...
- padrões obrigatórios: ...
- exceções relevantes: ...
- arquivos/áreas afetadas: ...
```

## Autoevolução

Se o carregador não cobrir uma necessidade técnica recorrente e estável, use `skill-autoevolution`.
