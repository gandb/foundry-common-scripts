# CONSTITUTION.md

## Contexto geral

Este repositório é orientado a automações e scripts de desenvolvimento.
O objetivo principal do OpenCode aqui é:
- Automatizar tarefas usando **scripts Typescript**.
- Criar melhorias no Foundry VTT usando a API dele.
- Usar **JavaScript (Node.js)** apenas quando TypeScript não puder ser usado (ex: antes do build ou como ponto de entrada obrigatório).
- Manter scripts pequenos, reutilizáveis e bem documentados.

Sempre leia este arquivo e o `README.md` na raiz antes de fazer qualquer alteração significativa.

---

## Regras de Ouro

1. **Priorizar TypeScript** - Sempre tente resolver em TypeScript primeiro
2. **Injeção de dependência** - Use `injectController` pelo nome da classe ou instância
3. **Sem valores hard-coded** - Use variáveis de configuração
4. **Documentação obrigatória** - Documente no README.md todas as funcionalidades
5. **Não recriar o que já existe** - Verifique dependências e scripts existentes antes de criar novos

---

## Fluxo Obrigatório de Agentes

**NUNCA execute código ou faça alterações sem seguir este fluxo:**

1. **PRODUCT_OWNER** → Define as TASKs no arquivo `PRODUCT_OWNER.md`
2. **SCRUM_MASTER** → Entrega UMA TASK por vez (usuário deve pedir "Faça TASK X")
3. **ARCHITECT** → Planeja a TASK e envia para o TESTER
4. **TESTER** → Cria testes que validam a TASK
5. **DEVELOPER** → Codifica a solução (só passa quando testes passam)
6. **CODE_REVIEWER** → Revisa aderência a padrões
7. **DOCUMENTATION_WRITER** → Documenta no README.md e arquivos

**Como ativar:** Quando o usuário disser "Faça TASK X", leia `PRODUCT_OWNER.md` e siga as etapas na ordem acima.

---

## Checkpoints Obrigatórios

**Antes de codificar (etapa DEVELOPER):**
- [ ] Ter um plano do ARCHITECT
- [ ] Ter testes do TESTER
- [ ] Ter confirmado com o usuário se há dúvidas no plano

**Antes de finalizar (qualquer etapa):**
- [ ] Ter passado em todos os testes
- [ ] Ter revisão aprovada do CODE_REVIEWER (exceto para SCRUM_MASTER e PRODUCT_OWNER)

---

## Delegação de Tarefas

O PRODUCT_OWNER pode receber pedidos de delegação no formato:
- "Peça ao developer corrigir o bug de null na TASK 9"
- "Peça ao architect planejar a TASK 15"
- "Peça ao tester criar testes para a TASK 12"
- "Peça ao documentation writer documentar a TASK 3"

Ao receber um pedido de delegação, o PRODUCT_OWNER deve seguir o fluxo completo de trabalho do agente solicitado, pulando os anteriores, caso contrário deve seguir o fluxo completo, iniciando ao passar a task completa para o SCRUM_MASTER.

---

## Notas Finais

- Cada agente tem suas diretrizes específicas em `.opencode/agents/[AGENTE].md`
- As skills disponíveis estão em `.opencode/skills/`
- Seguir este fluxo é obrigatório para qualquer agente trabalhando neste projeto