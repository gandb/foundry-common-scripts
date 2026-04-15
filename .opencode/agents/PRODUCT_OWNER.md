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


- 1. ✅ - Documentar a stack no README.md
   - **Descrição:** Adicionar seção "Stack e Versões" no README.md com: Versão do OpenCode (1.4.3), Node (v22.18.0), npm (10.9.3), TypeScript (^5.9.2 - presente no package.json). O DOCUMENTATION_WRITER foi atualizado para incluir esta documentação automaticamente em futuras alterações.
- 2. - Corrigir SocketLib executeAsGM() para não enviar para GM
   - **Descrição:** A função executeAsGM() na implementação SocketLib atualmente usa executeForEveryone() que envia mensagens para todos os jogadores incluindo o GM. Deve ser corrigida para usar executeForOthersGM() ou filtrar recipients para enviar apenas para jogadores não-GM, mantendo consistência com a implementação ChatSocket.
- 3. - Implementar filtro onlyPlayers no SocketLib
   - **Descrição:** Adicionar filtro similar ao que existe no ChatSocket para descartar mensagens marcadas como onlyPlayers quando o receptor é GM. Atualmente o SocketLib não tem este mecanismo, causando inconsistência entre implementações.
- 4. - Melhorar validação isReadyToSendToGM()
   - **Descrição:** A função isReadyToSendToGM() atualmente retorna (game.user as any) || (game.users as any) que sempre retorna true se os objetos existirem. Deve ser melhorada para verificar game.user?.isGM e garantir que o usuário atual seja GM antes de permitir envio de mensagens como GM.
- 5. - Teste se mensagens apenas pra players em socketlib funciona, teste manual feito pelo usuario
- 6. - Teste se um player calculando algo em everyone em socketlib funciona, teste manual feito pelo usuario
- 7. - Teste se um player calculando algo em gm em socketlib funciona, teste manual feito pelo usuario
- 8. - Teste para apenas um player em socketlib funciona, teste manual feito pelo usuario
- 9. - Teste para a resposta vir de apenas um player no execin mesmo que seja mandato varios  em socketlib funciona, teste manual feito pelo usuario 
- 10. - Teste evento que nao existe, erro se não em socketlib funciona, teste manual feito pelo usuario 
- 11. - Teste eventoPlayer sempre envia pra gm mesmo que filtre, testar em chat implementation funciona, teste manual feito pelo usuario  
- 12. - Teste player sempre envia pra gm mesmo que filtre, testar em socketlib implementation
- 13. - Alternar a configuração de qual implementação usar a depender de uma configuração. Alterar no factory de mensageria.
- 14. - Corrigir pro createDialog usar options em vez de depender da ordem dos parâmetros, criar uma interface pra options e documentar os campos.
- 15. - o último voltar deveria reabrir a tela de escolha de npc, se isso for possível ser tratado nas classes bases e nao de quem usa o npcdialog.
- 16. - corrigir bug que ao abrir duas telas de npc diferentes a primeira passa a se portar como a segunda, alguma variavel global esta sendo poluída, e e o título deve constar o nome do npc em questao para ajudar a nao se confundir.
- 17. Trocar em  npcTalkDialog.ts  pra uar a nova implementacao usando socket a interface inicialmente do chat
- 18. - Trocar em  npcTalkDialog.ts  pra uar a nova implementacao usando a interface do socketlib  
- 19. - Verificar que no projeto ../../../../forgotten-realms/scripts/ nos npcs no lugar onde tem "action", "screen", "screen-context", criar um enum neste projeto e documentar isto, pra que os projetos que usarem fazerem uso do enum e nao uma string, para evitar erros de digitacao


## Saída Esperada
Definições claras de funcionalidades que orientem as TASKs do SCRUM_MASTER.
