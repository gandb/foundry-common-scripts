import { Log, injectController } from "taulukko-commons";
import { SubModuleBase } from "../sub-module-base";
import { DialogUtils } from "../dialog-utils/dialog-utils";
import { NPC } from "./npc";
import { NPCPortraitDialog } from "./npc-portrait-dialog";



/*
To see groupids, see the minsc.groupids.txt file 

 
=Débito==
1-) Criar as falas do Brizola, um segundo personagem (brizola.ts)
	1.1-) Texto - OK
	1.2-) Grupos
		1.2.1) Constantes - OK
		1.2.2) Falas por grupo - OK
	1.3-) Telas - OK
	1.4-) Testar - OK
	1.5-) Melhorar falas usando o google ia - ok
	1.5 -) Gerar e testar sons, tentar achar sotaque gaucho - ok
	1.6-) Adicionar as girias e criar novos grupos pra explicá-las (ver abaixo as girias) - ok
	1.7-)  pra ter o sotaque vou ter que usar o voice changer interpretando o sotaque gaucho - ignorado por enquanto, pdoe ser que faça com dublador.
2-) Corrigir o warning: - ok
accessing the global "AudioHelper" which is now namespaced under foundry.audio.AudioHelper
Deprecated since Version 12
Backwards-compatible support will be removed in Version 14
  at Minsc.speak (minsc.js:836:3)
=>3-) Criar componente pra mensageria mas deixar o atual código comentado como failback (estudar este primeiro https://github.com/farling42/foundryvtt-socketlib)
3.1-) Criar a interface de socket - OK
3.2-) Criar a implementação usando socket - OK
3.2.1-) Corrigir bug que ocorre por vezes o onReadyCommonSocket ser chamado antes ou depois de onREadyCommonModule, criando um flag para controlar isso - OK
3.2.2-) Tentar corrigir bug que socket funciona apenas na propria maquina, nao enviando pros demais jogadores, testando com socketlib-OK
3.2.3-) Tentar corrigir o bug que surgiu ao implementar a versão de mensageria usando o socket - OK
=>3.3-) Criar a implementação usando dialogs, ver neste arquivo o evento createChatMessage e a classe NPCPortraitDialog
3.3.1-) Implementar - OK
3.3.2-) Implementar um dummy pra mandar pra producao sem nada enquanto nao fica pronto-OK
3.3.3-) Corrigir o bug do personagem - OK
3.3.4) Gerar um script de teste a ser chamado pelo commons para depois ser facilmente removido o que se trata de teste - OK
3.3.5-) Testar envio de resposta (enviar a resposta, receber e remover da pilha)-OK
3.3.5.1-) Teste - OK
3.3.5.2-) Corrigir bug que aparece em ficha quando a ficha não é de jogador, exemplo ficha de item, de efeito, magia etc,
 ao fechar aparece uma mensagem de erro na tela dizendo "Não foi encontrado" - OK
3.3.5.3-) Arrumar o loop infinito de enviar um request e não voltar por não ter ninguem logado - OK

==>3.3.6-) Implementar executeIn em ambas implemntações (chat e socketlib) (envia mensagens para usuários especificos, inicialmente bloqueado apenas pra uso de gem, posteriormente pode ser configurável)
3.3.6.1-) Implementar executeIn em na implementação de chat - OK
3.3.6.1.1-) Implementar sem erros de compilacao  - OK
3.3.6.2-) Testar
3.3.6.2.1-) Testar mensagens de jogadores pra gm e de gm para jogadores 
3.3.6.2.1.1-) Testar mensagens de jogadores pra gm  
3.3.6.2.1.2-) Testar mensagens de gm para jogadores 
3.3.6.2.2-) Testar mensagens seletivas (apenas pra alguns jogadores),se houver alteração de código quando terminada voltar pro item 3.3.6.2 para reteste
3.3.6.2.3-) Testar mensagens calculadas (apenas pra alguns jogadores),se houver alteração de código quando terminada voltar pro item 3.3.6.2 para reteste
3.3.6.3-) Implementar sem erros de compilacao a funcao executeIn no socketlib - OK
3.3.6.3.1-)Teste para todos - OK
3.3.6.3.2-)Teste para apenas GM -OK
3.3.6.3.3-)Teste para jogadores - OK
3.3.6.3.4-)Teste para pessoas especificas - OK
3.3.6.3.5-)Teste com calculo - OK
3.3.6.3.7-) O log não funciona bem com o firfox, no firefox no modo debug, nao deveria gerar erro ou ter outro modo pra imprimir o stack trace.
3.3.6.3.8) Tentar corrigir pra não mostrar o chat no jogo pra implementacao de chat, ,se houver alteração de código quando terminada voltar pro item 3.3.6.3.2 para reteste
3.3.6.3.9-)Implementar sem erros de compilacao o socketlib 
( ja foi feito , mas faltou a parte de mandar pra todos se receber do primeiro ignora os proximos)
3.3.6.3.10-) Testar mensagens de jogadores pra gm e de gm para jogadores
3.3.6.3.10.1-) Arrumar o bug que faz com que o envio Hello from GM em socket lib
 está chegando nos jogadores mas não está imprimindo, já o envio calculado volta pro gm e calcula.

====>3.3.6.3.11-) Testes pra todos em socketlib

====>3.3.6.3.12-) Testes pra apenas gm em socketlib, se houver erro volta pra 3.3.6.3.11
3.3.6.3.13-) Testes pra apenas players em socketlib, se houver erro volta pra 3.3.6.3.11
3.3.6.3.14-) Testes pra um player calculando algo em everyone
3.3.6.3.15-) Testes pra um player calculando algo em gm
3.3.6.3.16-) Testes pra apenas um player em socketlib, se houver erro volta pra 3.3.6.3.11
3.3.6.3.17-) Testar a resposta vir de apenas um player no execin mesmo que seja mandado varios em socketlib, se houver erro volta pra 3.3.6.3.11
3.3.6.3.18-) Testar evento que nao existe em socketlib, se houver erro volta pra 3.3.6.3.11
3.3.6.3.19-) Player sempre envia pra gm mesmo que filtre, testar em chat implementation
3.3.6.3.20-) Player sempre envia pra gm mesmo que filtre, testar em socketlib implementation
3.4-) Trocar em  npcTalkDialog.ts  pra uar a nova implementacao usando a interface inicialmente do chat, se houver erro volta pra 3.3.6.3.11
3.5-) Trocar em  npcTalkDialog.ts  pra uar a nova implementacao usando a interface do socketlib  , se houver erro volta pra 3.3.6.3.11
3.6-) Alternar a configuração de qual implementação usar a depender de uma configuração. Alterar no factory de mensageria., se houver erro volta pra 3.3.6.3.11
4-) Corrigir pro createDialog usar options em vez de depender da ordem dos parâmetros, criar uma interface pra options e documentar os campos.
5-) Nos npcs no lugar onde tem "action" , "screen", "screen-context", criar um enum pra isto com a documentação do que significa cada um
6-) o último voltar deveria reabrir a tela de escolha de npc
7-) melhorar o menu do minsc, o do brizola ficou melhor
8-) Tem como generalizar ainda mais o código pro próximo npc?
9-) Separar o common-assets do common-scripts (que pdoe ser opensource)

*/


    
export class NPCDialog extends SubModuleBase {


	public npcSelected: NPC | any;
	public activeNPC: NPC | any;
	public npcs: Map<string, NPC> = new Map();
	public buttonloaded: boolean = false;
	#requiredHooksLoaded: boolean = false;



	protected async initHooks() {

		Hooks.on('createChatMessage', async (message: any) => {
			const logguer: Log = injectController.resolve("CommonLogguer");
			const npcDialog: NPCDialog = injectController.resolve("NPCDialog");

			const fiveMinute: number = 5 * 60 * 1000;
			await npcDialog.whaitFor(() => injectController.has("DialogUtils"), fiveMinute);

			if (!injectController.has("DialogUtils")) {
				logguer.error("Givup chat message ", message, " because timeout waiting for DialogUtils");
				return;
			}

			try {
				logguer.debug("createChatMessage recebido...");
				// Verifica se é um evento nosso
				if (message.flags?.['common-assets']?.type === 'npcDialogOnTalk') {
					const data = message.flags['common-assets'].payload;
					logguer.debug('[NPC Portrait] Evento recebido dos jogadores:', data);

					NPCPortraitDialog.renderTalk(data);
				}
			} catch (e) {
				logguer.error('[NPC Portrait] Erro ao processar evento:', e);
			}
		});



		Hooks.on("getSceneControlButtons", async (controls: any) => {


			const logguer: Log = injectController.resolve("CommonLogguer");
			const npcDialog: NPCDialog = injectController.resolve("NPCDialog");

			const fiveMinute: number = 5 * 60 * 1000;
			await npcDialog.whaitFor(() => injectController.has("DialogUtils"), fiveMinute);

			if (!injectController.has("DialogUtils")) {
				logguer.error("Givup getSceneControlButtons ", controls, " because timeout wiaiting for DialogUtils");
				return;
			}

			logguer.debug("On getSceneControlButtons 05...", controls, npcDialog);


			await npcDialog.addNPCButtons(controls);


			npcDialog.#requiredHooksLoaded = true;


			//com sockets nao funcionou
			/*
			(game.socket as any).on('forgotten-realms', (data: any) => {
				if (data.type === 'npcDialogOnTalk') {
					commonModule.debug("recebendo o evento:");
		
					NPCPortraitDialog.renderTalk(data);
				}
			});*/


			//com hoooks nao funcionou

			/**	Hooks.on('npcDialogOnTalk',async  (data: any) => {
	
			commonModule.debug("npcDialogOnTalk received...") ;  
			NPCPortraitDialog.renderTalk(data);
			commonModule.debug("npcDialogOnTalk created...") ;  
	
		}); */

			logguer.debug("On getSceneControlButtons...:20");

		});
	}

	protected async waitReady() {
		const fiveMinutes = 5 * 60 * 1000;
		await this.whaitFor(() => this.#requiredHooksLoaded, fiveMinutes);
		if (!this.#requiredHooksLoaded) {
			throw new Error("Timeout waiting for hooks");
		}
		Hooks.callAll("onReadyNPCDialog", {});
	}


	public async addNPCButtons(controls: any) {
		const logguer: Log = injectController.resolve("CommonLogguer");
		const npcDialog: NPCDialog = injectController.resolve("NPCDialog");


		if (!game.user.isGM) {
			logguer.debug("NPC Buttons off");
			return;
		}

		logguer.debug("Criando botão dos NPCs especiais", controls);
		controls.tokens.tools["npcButton"] = {
			name: "npcButton",
			title: "NPCs Especiais",
			icon: "fa-solid fa-web-awesome",
			button: true,
			toggle: false,
			onClick: () => {
				logguer.debug("Botão de NPCs especiais pressionado");
	 
				npcDialog.showNPCChooseDialog();
				logguer.debug("Após abrir janela de NPCs especiais");
			}
		};

		logguer.debug("Botão de NPC criado");
	}


	public async showNPCChooseDialog() {
		const logguer: Log = injectController.resolve("CommonLogguer");
		const npcDialog: NPCDialog = injectController.resolve("NPCDialog");
		const dialogUtils: DialogUtils = injectController.resolve("DialogUtils");

		logguer.debug("Botão NPCsespecial pressionado, mostrando diálogo...");

		const title = "Escolha um NPC Especial";
		const style = `
					.select-npc  { padding: 20px; background: #222; color: #eee; }
					.select-npc button { margin: 5px; padding: 5px 10px; }
					`;
		const content = `
					<div class="select-npc">
					<H1>Escolha uma opção:</H1> 
					</div>`;

		logguer.debug("showNPCChooseDialog:10 before creating buttons", npcDialog);

		let buttons = [];

		npcDialog.npcs.forEach(npc => {
			logguer.debug("showNPCChooseDialog:15 add NPC ", npc.name, npc);
			buttons.push(dialogUtils.createButton(npc.name.toLocaleLowerCase(), npc.name, true, "screen", npcDialog.callNPC(npc)));
		});
		buttons.push(dialogUtils.createButton("cancel", "Cancel", false, "screen"));

		logguer.debug("showNPCChooseDialog:20 after creating buttons");

		dialogUtils.createDialog(title, style, content, buttons, undefined, 200, undefined, 400);

		logguer.debug("showNPCChooseDialog:30 after createDialog");

	}


	public helpSubmit: string = `
			Submit need be a function:
			(action,label,defaultValue,callback)=>{
				return result => {
						 
					}
			}
			`;


	public async callNPC(npc: NPC) {
		const npcDialog: NPCDialog = injectController.resolve("NPCDialog");
		const logguer: Log = injectController.resolve("CommonLogguer");
		logguer.debug("Selecionado ...", npc);
		npcDialog.npcSelected = npc;
		await npcDialog.npcSelected.startScreen();
	}

}

