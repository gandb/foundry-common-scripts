import { CommonModule } from "../common-module";
import { DialogUtils } from "../dialog-utils";
import {NPCDialog} from "./npcDialog"; 


const RANDOM_GROUP:string = "999";

const docNPC:FoundryDocument = document as FoundryDocument;
let commonModule:CommonModule;
let dialogUtils:DialogUtils;
let npcDialog:NPCDialog;

export abstract class NPC   {
  
	readonly DEFAULT_STYLE:string=`
					<style>
					.select-action { padding: 20px; background: #222; color: #eee; }
					.select-action button { margin: 5px; padding: 5px 10px; }
					.brizola-actions-buttons {  display: flex; flex-direction: column; gap: 8px; }
				`;

	actor:any;
	groups:Set<string> = new Set();
	screens = new Array<Screen|any>(); 
	abstract groupToLines:Map<string,string>;
	abstract lines:any;
	

	constructor(public readonly name:string, public readonly imageUrl:string ,public readonly formatSound:string="ogg"){ 
	
		commonModule = docNPC.COMMON_MODULE;
		dialogUtils = commonModule.DIALOG_UTILS;
		npcDialog = dialogUtils.NPC_DIALOG;

		commonModule.debug("NPC.constructor: COMMON_MODULE:",commonModule);
		commonModule.debug("NPC.constructor: npcDialog:",npcDialog);
		commonModule.debug("NPC.constructor: npcDialog.showNPCChooseDialog:",npcDialog.showNPCChooseDialog);
 		this.screens.push({name:"npc-dialog",callback:npcDialog.showNPCChooseDialog});		
	}
 
	public  decrementGroup (){
		const array = [...npcDialog.activeNPC.groups];
		const newArray = array.slice(0, -1); 
		npcDialog.activeNPC.groups =new Set(newArray);

	}

	public getAlias(){
		return this.name.toLocaleLowerCase();
	}

    public async createDialog (title:string ,content:string,options:Array<any>,submits:Array<any>|null)
	{
		const alias = npcDialog.activeNPC.getAlias();

		let innerContent=`
		<DIV class="${alias}-actions-buttons">
			<SELECT>
				<option selected="selected" value="${alias}-random">Aleatório dado o contexto até aqui</option>
		` ;
		
		options.forEach((option)=>{


			const backAction:string =  `${alias}-back`; 
			const sendAction:string =   `${alias}-send`;
			const cancelction:string =   `${alias}-cancel`;

			if(option.action== backAction||option.action==sendAction||option.action==cancelction){
				return;
			} 

			docNPC.COMMON_MODULE.debug("NPC.createDialog:5 for,button:",option);

			innerContent +=  `
				<option value="${option.action}">${option.label} </option>
			`;
		});

		innerContent+=`
			</SELECT>
		</DIV>
		` ;
		
	 

		commonModule.debug("NPC.createDialog:10",options);
		commonModule.debug("NPC.createDialog:15:activeNPC.groups:",
		npcDialog.activeNPC.groups);

		if(!submits){
			
			commonModule.debug("NPC.createDialog:20");

			submits = [
				commonModule.DIALOG_UTILS.createButton("send","Enviar",true,"action",async ()=> {
					commonModule.debug("NPC.createDialog, before creating send:",npcDialog.activeNPC.groups	);
	
					commonModule.debug("NPC.createDialog [10]: Escolhido a opcao enviar");					

					const queryResult = docNPC.querySelector(`.${alias}-actions-buttons SELECT`) as HTMLSelectElement || null;
					const result = queryResult?.value;

					if(result===null || result===undefined){
						docNPC.COMMON_MODULE.error("NPC.createDialog: Erro ao obter a opcao selecionada");
						return
					}

					docNPC.COMMON_MODULE.debug("NPC.createDialog [20]: depois de selecionar o resultado",result);


					if(result===`${alias}-random`)
					{
						const lastScreen  = npcDialog.activeNPC.screens.at(-1);
						npcDialog.activeNPC.screens.push( {name:result,callback:npcDialog.activeNPC.send,type:lastScreen.type} );
						commonModule.debug("NPC.createDialog, before  random send:",npcDialog.activeNPC.groups	);	
						npcDialog.activeNPC.send(false);
						commonModule.debug("NPC.createDialog, after random send:",npcDialog.activeNPC.groups	);
	
						return;
					}
					options.forEach((button)=>{	
						if(button.action!=result){
							return;
						}

						docNPC.COMMON_MODULE.debug("NPC.Enviado a opcao :" + result );
						npcDialog.activeNPC.screens.push({name:result,callback:button.callback,type:button.type} );
						button.callback();
						docNPC.COMMON_MODULE.debug("NPC.createDialog, after 3 creating send:",npcDialog.activeNPC.groups	);
					});
					
				}),
				commonModule.DIALOG_UTILS.createButton("back","Voltar",true,"action",async ()=> {

					commonModule.debug("NPC.screens ao voltar - antes: ",npcDialog.activeNPC.screens	);
					 
					const previousLastScreen = npcDialog.activeNPC.screens.at(-2);
					const lastScreen = npcDialog.activeNPC.screens.pop();		
					commonModule.debug("lastScreen:", lastScreen)
					commonModule.debug("screens ao voltar - depois: ",npcDialog.activeNPC.screens	);
					
					if(lastScreen.type=="screen-context")
					{
						npcDialog.activeNPC.decrementGroup();
					}

					previousLastScreen.callback();

					  

				}),
				commonModule.DIALOG_UTILS.createButton("cancel","Cancelar",true,"action",async ()=> {
					commonModule.debug("NPC.Cancelado a tela do ",alias); 
				})
			];	

			commonModule.debug("NPC.createDialog:25. Create submits",submits);

			docNPC.COMMON_MODULE.debug("NPC.createDialog:30 - depois de criar submits");
		}
  
	  
		const submit = (action:string,label:string,defaultValue:string,callback:any)=>{
		};

		commonModule.debug("NPC.createDialog:40 - antes de criar dialogo");

		commonModule.DIALOG_UTILS.createDialog( title ,npcDialog.activeNPC.DEFAULT_STYLE ,innerContent,submits,submit,200,undefined, 400);

		commonModule.debug("NPC.createDialog:50 - depois de criar dialogo");

	}

	public abstract startScreen ():Promise<void> ; 

		       
	public async getListLinesFromGroup (groupsUnordered:any) {

		const groups = Array.from(groupsUnordered).map(Number).sort((a, b) => a - b);

		if(groups.length === 0 && groupsUnordered.size===0) {
			return new Array();
		} 

		if(groups.length === 0){
			groups.push(Number.parseInt(groupsUnordered.get(0),10));
		}

		if(groups.length==1)
		{
			return groups;
		}
		
		let combinations = await npcDialog.activeNPC.getCombinations(groups);
		commonModule.debug("groups:",groups);
		commonModule.debug("keys:",combinations);
		 
		return combinations;
	

	};


	public async getCombinations (numbers:Array<number>,separator:string=";") {
		
		
		const ret = new Array();

		if(numbers.length==0 || numbers.length==1)
		{
			return  [...numbers];
		}

 		 
	 	commonModule.debug("numbers:",numbers);

		const generate = (start:number, path:Array<number>) => {
			commonModule.debug("generate start:",start,",path",path);


			let combinationKey = numbers.join(";") 
			commonModule.debug("combinationKey:",combinationKey);

			commonModule.debug("groupToLines:",npcDialog.activeNPC.groupToLines,"-",typeof combinationKey);

			if(npcDialog.activeNPC.groupToLines.has(combinationKey)) {
				commonModule.debug("find, return the combination");
				ret.push(combinationKey);
				return ret;
			}
		   commonModule.debug("combinationKey not found:",combinationKey);
			for (let i = start; i < numbers.length; i++) {
				const newCombinationGroup:Array<number> = [...path, numbers[i]];
				commonModule.debug("novaCombinacao:",newCombinationGroup);
				combinationKey = newCombinationGroup.join(";") 
				ret.push(combinationKey);
	 			generate(i + 1, newCombinationGroup);
			}

		};

		generate(0, []);
		return ret;
	}
	

	public async speak  (lineIndex:number){
		const line = npcDialog.activeNPC.lines[lineIndex];
 

		commonModule.debug("speak:talk:",line);
	 

		commonModule.debug("disparando o evento pra todo mundo:");


  
   		 console.log('[NPC Portrait] Enviando para todos...');
    
		// Cria uma mensagem invisível que todos recebem
		await ChatMessage.create({
		content: 'NPC Portrait Event', // Invisível pra maioria
		whisper: Array.from(game.users?.values() || []).map((u: any) => u.id),
		flags: {
			'forgotten-realms': {
			type: 'npcDialogOnTalk',
			payload:  {imageUrl:this.imageUrl,npcName:this.name,dialogText:line}
			}
		}
		});
	
 
		//com socket nao funcionou
		/*
		if (game.user?.isGM) {
			(game.socket as any).emit('forgotten-realms', {
				type: 'npcDialogOnTalk',
				data: {imageUrl:this.imageUrl,npcName:this.name,dialogText:line},
			});
		} 
			*/

		//com hooks nao funcionou		
		//Hooks.callAll('npcDialogOnTalk',  {imageUrl:this.imageUrl,npcName:this.name,dialogText:line});

		commonModule.debug(" evento disparado pra todo mundo:");


		const formatedIndex = lineIndex.toString().padStart(3, '0'); 
		const name =  npcDialog.activeNPC.name;
		const src = `modules/forgotten-realms/sounds/npcs/${name}/${formatedIndex}/${name}${formatedIndex}.${npcDialog.activeNPC.formatSound}`;
		const ret = await this.playSoundWithNoEffect(src);
		commonModule.debug("Retorno do play:",ret );
	}

	private async playSoundWithNoEffect(src:string):Promise<boolean>{
		try{
			const response = await fetch(src, { method: 'HEAD' });
			if (!response.ok) {
				console.warn(`Arquivo não encontrado: ${src} (${response.status})`);
				return false;  
			}
			
			
			foundry.audio.AudioHelper.play({ src, autoplay: true }, true);
			return true;  
		}
		catch(error:any){
			commonModule.error("Erro ao reproduzir o som:",src,error);
			return false;  
		}
	}
 
	
	public  async send(removeLastGroup=true) {
			if(npcDialog.activeNPC.groups.size === 0) {
				npcDialog.activeNPC.groups.add(RANDOM_GROUP);
			} 
	
			const list = await npcDialog.activeNPC.getListLinesFromGroup(npcDialog.activeNPC.groups);
 
			commonModule.debug("NPC.send, before send,list:",list);

			const lines = new Array();

			for(const groupNumber of list) {
		
				const group = groupNumber.toString();
				commonModule.debug("group:",group);
				if(!npcDialog.activeNPC.groupToLines.has(group))
				{
					commonModule.warn(`NPC.send, afterSend:Grupo ${group} não encontrado em groupToLines!`);
					continue;
				}
	
				const size = group.split(";").length +1;

		
				const linesForThisGroupConcat:string =  npcDialog.activeNPC.groupToLines.get(group) ;
				commonModule.debug("NPC.send, 50,linesForThisGroupConcat:",linesForThisGroupConcat,"-size:",size);

				const linesForThisGroup = linesForThisGroupConcat.split(";"); 
				commonModule.debug("NPC.send, 60,linesForThisGroup:",linesForThisGroup);
				linesForThisGroup.forEach(line=>{
					for(let i=0;i<size;i++) {
						lines.push(  line);
					}
				});
				
			}

			commonModule.debug("NPC.send, afterSend,lines:",lines);

			let randomIndex = Math.abs(  Math.round( (Math.random( )*lines.length))); 
			randomIndex = randomIndex>=lines.length ? lines.length-1: randomIndex;

			commonModule.debug("NPC.send, afterSend,randomIndex:",randomIndex);

			const lineIndex = Number.parseInt( lines[randomIndex],10);

			commonModule.debug("NPC.send, afterSend,lineIndex:",lineIndex);


			npcDialog.activeNPC.speak(lineIndex);
	

			commonModule.debug("NPC.send, afterSend,activeScreen:",npcDialog.activeNPC.screens	);
		
			const activeScreen = npcDialog.activeNPC.screens.at(-2);
			npcDialog.activeNPC.screens.pop();
		
			activeScreen.callback();

			npcDialog.activeNPC.groups.delete(RANDOM_GROUP);

			if(removeLastGroup)
			{
				npcDialog.activeNPC.decrementGroup();
			}


			commonModule.debug("NPC.send, afterSend:",npcDialog.activeNPC.groups	);
		
	}
 
 
}



