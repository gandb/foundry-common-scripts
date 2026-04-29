---
name: skill-autoevolution
description: Padroniza o registro de lacunas estáveis de instrução encontradas durante o uso de skills
---

## Objetivo

Melhorar skills apenas quando faltar uma instrução estável, recorrente e reutilizável.

## Quando usar

- ao final do uso de outra skill
- quando houver dúvida evitável causada por ambiguidade ou ausência de critério estável

## Registrar

- ambiguidade de fluxo que a skill deveria ter resolvido
- critério objetivo ausente
- exceção estável e recorrente não documentada
- conflito entre skill e documento-base

## Não registrar

- preferência variável do usuário
- decisão de produto ainda aberta
- exceção ad hoc de uma única task
- estilo textual temporário ou gosto pessoal

## Modelo de registro

```md
Skill afetada: <nome>
Dúvida encontrada: <texto curto>
Instrução estável que faltou: <texto sugerido>
Por que isso é estável: <justificativa>
Ação: <ajuste pontual na skill | abrir task derivada>
```

## Critério de escalonamento

- **ajuste pontual:** quando a correção é local e não muda a governança geral
- **task derivada:** quando a lacuna afeta vários arquivos, muda políticas ou exige refatoração estrutural

## Regra final

Não converter a autoevolução em mudança improvisada de escopo da task atual.
