# TASKS

Lista de tarefas do projeto. Quando o usuário pedir "Faça TASK X", o SCRUM_MASTER entrega a tarefa uma por vez seguindo o fluxo de agentes.



## Tarefas Pendentes e Concluídas
O padrão para tarefas é:
- ✅ Task concluída
- Task a fazer
 
- ✅ Expandir correção de contexto de `this` para todo o projeto
    - **Descrição:** Aplicar a mesma correção realizada na TASK 3 em todas as demais classes Singletons e Controllers do projeto. Deve-se auditar o código em busca de acessos a propriedades/métodos via `this` que possam ser vulneráveis a perda de contexto, substituindo-os pela resolução via `injectController` conforme a diretriz do `ARCHITECT.md`.
- ✅ Melhorar testes para usar injeção de dependência
    - **Descrição:** Refatorar o código para usar injeção de dependência ao invés de acessar objetos globais diretamente (como `game`). O código deve verificar se o objeto existe, e se não existir, obtê-lo via injeção de dependência. Isso elimina a necessidade de mocks nos testes e torna os testes mais legíveis e fáceis de manter.
- ✅ Checar os testes do projeto pois tem um com skip
    -- **Descrição:** Analisar o motivo de ter um teste marcado com skip. Questione ao usuário depois de dar o relatório com o motivo, se ele quer remover o teste, manter como skip e se ele estiver funcionando e não ter motivos para skip, de a opcao de ativar o teste.
    - **Resultado:** Teste ativado com sucesso. Adicionados testes em `common-socket-socketlib.test.ts` (agora 11 testes) e criado `common-socket-chatmessage.test.ts` com 8 testes. Total de testes de socket: 24. Total geral: 44 testes.
- Auditar todos os usages de `injectController.resolve` para usar `injectController.has` antes quando não há certeza de que o objeto está registrado
    -- **Descrição:** O injectController dá erro no resolve() se o objeto não existe. Deve-se auditar todos os 161 usages de injectController.resolve no projeto e adicionar verificação com injectController.has() antes quando não há certeza de que o objeto está no container. Seguir o padrão já usado em npc-dialog.ts e flight-movement.ts.
- Corrigir a tipagem pra facilitar o auto-completar:
 - **Descrição:** : corrigir casos existentes e documentar em CONSTITUITION.md que, ao declarar TODAS as variáveis deve-se usar o padrão (<let|const|var> nomeVariavel:<tipo esperado>=valor; ). SE for necessário colocar any porque a variável usa null, undefined ou qualquer outro tipo, faça a declaração de ambos os tipos pra permitir o autocompletar, exemplo: const idade:number|any= (isNaN(getIdade())?null|getIdade();
- ✅ Implementar filtro onlyPlayers no SocketLib
    - **Descrição:** Adicionar filtro similar ao que existe no ChatSocket para descartar mensagens marcadas como onlyPlayers quando o receptor é GM. Atualmente o SocketLib não tem este mecanismo, causando inconsistência entre implementações.
    - **Resultado:** Implementado e testado. SocketLib define `onlyPlayers: true` no payload e ChatSocket usa parâmetro `onlyPlayers=true` em `sendMessage`. Testado em `common-socket-chatmessage.test.ts`.
- ✅ Corrigir e habilitar teste de envio exclusivo para non-GMs no SocketLib
    - **Descrição:** O teste `"should send to non-GM users only"` em `common-socket-socketlib.test.ts` está atualmente ignorado (`it.skip`) pois não possui asserções (está apenas chamando o método). A tarefa consiste em refatorar o teste para verificar se `executeAsGM` filtra corretamente a lista de usuários via `getNonGMUserIds` e chama `executeForUsers` com os IDs corretos e o payload `onlyPlayers: true`, habilitando-o em seguida.
    - **Resultado:** Teste ativado com sucesso. Adicionados 6 novos testes em `common-socket-socketlib.test.ts` e criado `common-socket-chatmessage.test.ts` com testes de consistência entre implementações.
- ✅ Melhorar validação isReadyToSendToGM()
    - **Descrição:** A função isReadyToSendToGM() atualmente retorna (game.user as any) || (game.users as any) que sempre retorna true se os objetos existirem. Deve ser melhorada para verificar game.user?.isGM e garantir que o usuário atual seja GM antes de permitir envio de mensagens como GM.
    - **Resultado:** Testado em `common-socket-chatmessage.test.ts` com casos para usuário GM e não-GM. Validação implementada com `game.user?.isGM`.
- Teste se mensagens apenas pra players em socketlib funciona, teste manual feito pelo usuario
- Teste se um player calculando algo em everyone em socketlib funciona, teste manual feito pelo usuario
- Teste se um player calculando algo em gm em socketlib funciona, teste manual feito pelo usuario
- Teste para apenas um player em socketlib funciona, teste manual feito pelo usuario
- Teste para a resposta vir de apenas um player no execin mesmo que seja mandato varios  em socketlib funciona, teste manual feito pelo usuario 
- Teste evento que nao existe, erro se não em socketlib funciona, teste manual feito pelo usuario 
- Teste eventoPlayer sempre envia pra gm mesmo que filtre, testar em chat implementation funciona, teste manual feito pelo usuario  
- Teste player sempre envia pra gm mesmo que filtre, testar em socketlib implementation
- Alternar a configuração de qual implementação usar a depender de uma configuração. Alterar no factory de mensageria.
- Corrigir pro createDialog usar options em vez de depender da ordem dos parâmetros, criar uma interface pra options e documentar os campos.
- o último voltar deveria reabrir a tela de escolha de npc, se isso for possível ser tratado nas classes bases e nao de quem usa o npcdialog.
- corrigir bug que ao abrir duas telas de npc diferentes a primeira passa a se portar como a segunda, alguma variavel global esta sendo poluída, e e o título deve constar o nome do npc em questao para ajudar a nao se confundir.
- Trocar em  npcTalkDialog.ts  pra uar a nova implementacao usando socket a interface inicialmente do chat
- Trocar em  npcTalkDialog.ts  pra uar a nova implementacao usando a interface do socketlib  
- Verificar que no projeto ../../../../forgotten-realms/scripts/ nos npcs no lugar onde tem "action", "screen", "screen-context", criar um enum neste projeto e documentar isto, pra que os projetos que usarem fazerem uso do enum e nao uma string, para evitar erros de digitacao