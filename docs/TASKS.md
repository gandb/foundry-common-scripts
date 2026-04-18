# TASKS

Lista de tarefas do projeto. Quando o usuário pedir "Faça TASK X", o SCRUM_MASTER entrega a tarefa uma por vez seguindo o fluxo de agentes.

## Tarefas Pendentes e Concluídas

- 1. ✅ - Documentar a stack no README.md
   - **Descrição:** Adicionar seção "Stack e Versões" no README.md com: Versão do OpenCode (1.4.3), Node (v22.18.0), npm (10.9.3), TypeScript (^5.9.2 - presente no package.json). O DOCUMENTATION_WRITER foi atualizado para incluir esta documentação automaticamente em futuras alterações.
- 2. ✅ - Corrigir SocketLib executeAsGM() para não enviar para GM
   - **Descrição:** A função executeAsGM() na implementação SocketLib atualmente usa executeForEveryone() que envia mensagens para todos os jogadores incluindo o GM. Deve ser corrigida para usar executeForOthersGM() ou filtrar recipients para enviar apenas para jogadores não-GM, mantendo consistência com a implementação ChatSocket.
- 3. - Corrigir uso de `this` em `common-socket-socketlib.ts`
    - **Descrição:** Corrigir a implementação de `common-socket-socketlib.ts` para remover o uso de `this.socketOriginal`. Seguindo a diretriz de "Não Utilizar Contexto Dinâmico de `this`" definida no `ARCHITECT.md`, deve-se resolver a instância de `SocketLib` via `injectController` para garantir a estabilidade do contexto, especialmente em callbacks e eventos.
- 4. - Expandir correção de contexto de `this` para todo o projeto
    - **Descrição:** Aplicar a mesma correção realizada na TASK 3 em todas as demais classes Singletons e Controllers do projeto. Deve-se auditar o código em busca de acessos a propriedades/métodos via `this` que possam ser vulneráveis a perda de contexto, substituindo-os pela resolução via `injectController` conforme a diretriz do `ARCHITECT.md`.
- 5. - Melhorar testes para usar injeção de dependência
    - **Descrição:** Refatorar o código para usar injeção de dependência ao invés de acessar objetos globais diretamente (como `game`). O código deve verificar se o objeto existe, e se não existir, obtê-lo via injeção de dependência. Isso elimina a necessidade de mocks nos testes e torna os testes mais legíveis e fáceis de manter.
- 6. - Implementar filtro onlyPlayers no SocketLib
    - **Descrição:** Adicionar filtro similar ao que existe no ChatSocket para descartar mensagens marcadas como onlyPlayers quando o receptor é GM. Atualmente o SocketLib não tem este mecanismo, causando inconsistência entre implementações.
- 7. - Corrigir e habilitar teste de envio exclusivo para non-GMs no SocketLib
    - **Descrição:** O teste `"should send to non-GM users only"` em `common-socket-socketlib.test.ts` está atualmente ignorado (`it.skip`) pois não possui asserções (está apenas chamando o método). A tarefa consiste em refatorar o teste para verificar se `executeAsGM` filtra corretamente a lista de usuários via `getNonGMUserIds` e chama `executeForUsers` com os IDs corretos e o payload `onlyPlayers: true`, habilitando-o em seguida.
- 8. - Melhorar validação isReadyToSendToGM()
    - **Descrição:** A função isReadyToSendToGM() atualmente retorna (game.user as any) || (game.users as any) que sempre retorna true se os objetos existirem. Deve ser melhorada para verificar game.user?.isGM e garantir que o usuário atual seja GM antes de permitir envio de mensagens como GM.
- 9. - Teste se mensagens apenas pra players em socketlib funciona, teste manual feito pelo usuario
- 10. - Teste se um player calculando algo em everyone em socketlib funciona, teste manual feito pelo usuario
- 11. - Teste se um player calculando algo em gm em socketlib funciona, teste manual feito pelo usuario
- 12. - Teste para apenas um player em socketlib funciona, teste manual feito pelo usuario
- 13. - Teste para a resposta vir de apenas um player no execin mesmo que seja mandato varios  em socketlib funciona, teste manual feito pelo usuario 
- 14. - Teste evento que nao existe, erro se não em socketlib funciona, teste manual feito pelo usuario 
- 15. - Teste eventoPlayer sempre envia pra gm mesmo que filtre, testar em chat implementation funciona, teste manual feito pelo usuario  
- 16. - Teste player sempre envia pra gm mesmo que filtre, testar em socketlib implementation
- 17. - Alternar a configuração de qual implementação usar a depender de uma configuração. Alterar no factory de mensageria.
- 18. - Corrigir pro createDialog usar options em vez de depender da ordem dos parâmetros, criar uma interface pra options e documentar os campos.
- 19. - o último voltar deveria reabrir a tela de escolha de npc, se isso for possível ser tratado nas classes bases e nao de quem usa o npcdialog.
- 20. - corrigir bug que ao abrir duas telas de npc diferentes a primeira passa a se portar como a segunda, alguma variavel global esta sendo poluída, e e o título deve constar o nome do npc em questao para ajudar a nao se confundir.
- 21. - Trocar em  npcTalkDialog.ts  pra uar a nova implementacao usando socket a interface inicialmente do chat
- 22. - Trocar em  npcTalkDialog.ts  pra uar a nova implementacao usando a interface do socketlib  
- 23. - Verificar que no projeto ../../../../forgotten-realms/scripts/ nos npcs no lugar onde tem "action", "screen", "screen-context", criar um enum neste projeto e documentar isto, pra que os projetos que usarem fazerem uso do enum e nao uma string, para evitar erros de digitacao