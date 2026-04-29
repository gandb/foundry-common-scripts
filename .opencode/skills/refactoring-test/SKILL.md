---
name: refactoring-test
description: Refatorar teste vindo do DEVELOPER
---

## Objetivo

Garantir que os testes com defeitos sejam corrigidos de acordo com a conversa com o DEVELOPER, mantendo a qualidade e alinhamento à spec ativa.

## Carregamento mínimo

- spec ativa
- arquivos de teste já existentes afetados
- contexto técnico relevante apenas se impactar a validação

## Regras

1. Testes devem falhar quando a implementação ainda não existir ou estiver errada.
2. Testes devem validar comportamento real, não apenas assinatura, existência de símbolo ou happy path superficial.
3. Dependências externas devem ser mockadas quando necessário para isolamento.
4. Em correções/refactors, prefira ajustar testes existentes antes de criar novos arquivos sem necessidade.

## Rotina

### 1. Ler a spec ativa

- extraia requisitos testáveis
- converta cada requisito em cenário verificável

### 2. Escolher o menor conjunto suficiente de testes

- cubra sucesso, falha e bordas relevantes
- evite duplicar cenários equivalentes
- não faça testes em nada quue não seja código
- não faça testes permanentes , testes que não testem regras de negócio. Se tiver que criar um teste para validar um comportamento que não seja regra de negócio, crie um teste temporário com nome -tmp.test.<extensao> .

### 3. Validar a qualidade dos testes

Checklist mínimo:

- o teste falha sem a implementação correta
- o teste observa saídas, efeitos ou integrações reais
- o teste é determinístico
- o teste não depende de interação manual

### 4. Handoff

- se achar que o teste está finalizadod, rode o testte para ver se ele falha como esperado uma vez que ele aiinda não foi feito.
- envie testes + spec ativa ao `DEVELOPER`
- se o `DEVELOPER` reportar falha rode a skill refactoring-test

## Autoevolução

Se houver lacuna estável nos critérios de teste, use `skill-autoevolution`.

legítima nos testes, corrija apenas o necessário e neste caso depos volte para o `DEVELOPER` validar que os testes
