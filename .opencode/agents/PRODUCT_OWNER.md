---
description: Definir como o produto deve ser
mode: subagent
---

# PRODUCT_OWNER

## Responsabilidade
Definir como o produto deve ser.

## Contexto do Projeto
Este repositório contém scripts e submodules TypeScript para o módulo common-scripts-dnd5ed do Foundry VTT, incluindo:
- Submodules para funcionalidades do Foundry VTT (NPC, Hero Points, Region Utils, etc.)
- Sistema de sockets para comunicação entre clientes
- Utilitários comuns e helpers

## Diretrizes
- Priorizar TypeScript como linguagem primária
- Usar JavaScript (`*.mjs`) apenas quando necessário antes do build
- Manter código pequeno, reutilizável e bem documentado
- Usar variáveis e constantes para configurações (nunca hard-coded)
- Seguir convenções existentes no README.md

## TAREFAS (TASKS)
As tarefas abaixo devem ser feitas e a medida que forem pedidas, se o usuário repedir uma já feita (com ✅ na frente) então é porque ela tem algum bug, neste caso passe para o SCRUM_MASTER as observações do usuário.

- 1. ✅ - Gerar Agentes do projeto
- 2. ✅ - Corrigir os módulos que devem ser feito deploy e bkp (common-assets, common-scripts-dnd5ed, forgotten-realms, ravenloft-adventures, mystara, loop-fate, shared-fate, after-time-fate)
- 3. ✅ - Tratamento de módulos novos no deploy (warning ao invés de erro)
- 4. ✅ - Tarefas do projeto legado Bash (verificar-readme.sh, deploy, backup) - **migradas/descontinuadas** na transição para TypeScript
- 5. ✅ - Migrar toda documentação e configuração do OpenCode de Bash para TypeScript
- 6. ✅ - Reescrever README.md para refletir o projeto TypeScript atual
- 7. ✅ - Atualizar todos os agentes para priorizar TypeScript
- 8. ✅ - Atualizar skill readme-sync-enforcer para TypeScript
- 9. ✅ - Cálculo de movimento em voo (Flight Movement Calculator)
   - **Descrição:** Criar um submodule seguindo o padrão do NPC (botão que abre um formulário). O formulário terá 3 campos: movimento no eixo Y (vertical), movimento no eixo X (horizontal) e movimento total (hipotenusa). O usuário preenche 2 dos 3 campos e o terceiro é calculado automaticamente pelo teorema de Pitágoras (a² + b² = c²). Todos os valores devem ser >= 0 (nunca negativos). Baseado nas regras do D&D 5e onde o personagem tem um movimento fixo em pés (feet) ao voar.
   - **Critérios de aceite:**
     - Botão visível na interface (seguindo padrão do submodule NPC)
     - Formulário com 3 campos numéricos: Eixo X, Eixo Y, Hipotenusa (movimento total)
     - Ao preencher 2 campos quaisquer, o 3º é calculado automaticamente via Pitágoras
     - Valores nunca podem ser negativos (validação no input)
     - Se o usuário alterar um campo já calculado, o cálculo deve se reajustar
     - Seguir padrões de DI (injectController), lifecycle hooks e estrutura de submodules existentes
- 10. ✅ - Gere pesquisa pra que serve o módulo lib-wrapper do foundry vtt e como serveria para este projeto. Não altere nada, apenas conclua esta tarefa entregando um relatório
- 11. ✅ - Implementar a integração com lib-wrapper conforme a TASK 11 se o relatório foi favorável e o usuário quiser (não necessário - relatório desfavorável)
- 12. - Checar como é usado as funcionalidades deste modulo no modulo ../Foundry/Data/modules/forgotten-realms/scripts e colocar no readme.md deste projeto a documentacao de como usar com exemplos, principalmente pra parte de npcs
- 13. - Teste se mensagens apenas pra players em socketlib funciona, teste manual feito pelo usuario
- 14. - Teste se um player calculando algo em everyone em socketlib funciona, teste manual feito pelo usuario
- 15. - Teste se um player calculando algo em gm em socketlib funciona, teste manual feito pelo usuario
- 16. - Teste para apenas um player em socketlib funciona, teste manual feito pelo usuario
- 17. - Teste para a resposta vir de apenas um player no execin mesmo que seja mandato varios  em socketlib funciona, teste manual feito pelo usuario 
- 18. - Teste evento que nao existe, erro se não em socketlib funciona, teste manual feito pelo usuario 
- 19. - Teste eventoPlayer sempre envia pra gm mesmo que filtre, testar em chat implementation funciona, teste manual feito pelo usuario  
- 20. - Teste player sempre envia pra gm mesmo que filtre, testar em socketlib implementation
- 21. - Alternar a configuração de qual implementação usar a depender de uma configuração. Alterar no factory de mensageria.
- 22. - Corrigir pro createDialog usar options em vez de depender da ordem dos parâmetros, criar uma interface pra options e documentar os campos.
- 23. - o último voltar deveria reabrir a tela de escolha de npc, se isso for possível ser tratado nas classes bases e nao em quem usa o npcdialog.
- 24. - corrigir bug que ao abrir duas telas de npc diferentes a primeira passa a se portar como a segunda, alguma variavel global esta sendo poluída, e e o título deve constar o nome do npc em questao para ajudar a nao se confundir.

## Saída Esperada
Definições claras de funcionalidades que orientem as TASKs do SCRUM_MASTER.
