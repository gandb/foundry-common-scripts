# TASKS

Lista de tarefas do projeto. Quando o usuário pedir "Faça TASK X", o SCRUM_MASTER entrega a tarefa uma por vez seguindo o fluxo de agentes.



## Tarefas Pendentes e Concluídas
O padrão para tarefas é: 
- ✅ Melhorar validação isReadyToSendToGM()
    - **Descrição:** A função isReadyToSendToGM() atualmente retorna (game.user as any) || (game.users as any) que sempre retorna true se os objetos existirem. Deve ser melhorada para verificar game.user?.isGM e garantir que o usuário atual seja GM antes de permitir envio de mensagens como GM.
    - **Resultado:** Testado em `common-socket-chatmessage.test.ts` com casos para usuário GM e não-GM. Validação implementada com `game.user?.isGM`.
- ✅ Corrigir tods os casos onde a classe tenta resolver via injectcontroller a propria casa, como no caso do players-tools.ts na linha 12 onde a classe PlayersTools tenta resolver ela propria. Casos assim tem que ser tratados como exceção , uma vez que ele é singleton então pode ter uma variavel global chamada nomeDaClasse exemplo var playerTools:PlayerTools|undefinded = undefined; e no construtor, assim que ele entra na classe ele deve preencher esta variável pra uso próprio. No final do init deve-se remover o waitfor neste caso pois sempre estara pronto- Atenção apenas usa-se em injetores que tentam resolver a propria classe.
- ✅ Ocultar mensagem "NPC Portrait Event" do chat do Foundry (spec: docs/spec/npc-portrait-event-ocultar-spec.md):
- ✅ Corrigir o src/submodules/npc/index.ts pois atualmente esta dando alguns bugs mas acho que sao poucos
- Auditar todos os usages de `injectController.resolve` para usar `injectController.has` antes quando não há certeza de que o objeto está registrado
    -- **Descrição:** O injectController dá erro no resolve() se o objeto não existe. Deve-se auditar todos os 161 usages de injectController.resolve no projeto e adicionar verificação com injectController.has() antes quando não há certeza de que o objeto está no container. Seguir o padrão já usado em npc-dialog.ts e flight-movement.ts.
- Corrigir a tipagem pra facilitar o auto-completar:
 - **Descrição:** : corrigir casos existentes e documentar em PROJECT.md que, ao declarar TODAS as variáveis deve-se usar o padrão (<let|const|var> nomeVariavel:<tipo esperado>=valor; ). SE for necessário colocar any porque a variável usa null, undefined ou qualquer outro tipo, faça a declaração de ambos os tipos pra permitir o autocompletar, exemplo: const idade:number|any= (isNaN(getIdade())?null|getIdade();
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