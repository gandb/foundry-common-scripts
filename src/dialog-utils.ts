
'use strict';
import { CommonModule } from "./common-module";
import { Button } from "./ui/button";
import { NPC } from "./ui/npc";
import { NPCDialog } from "./ui/npcDialog";

const docDialogUtils:FoundryDocument = document as FoundryDocument;

let commonModule:CommonModule;

 export class DialogUtils{
	public readonly npctype = NPC;

	public readonly NPC_DIALOG:NPCDialog = new NPCDialog();

	constructor(){

  		commonModule =docDialogUtils.COMMON_MODULE;
		commonModule.debug("Dialog Utils constructor"); 
	}
 
	public createButton  (action:string,label:string,defaultValue:boolean=false,type:string="screen",callback:any=undefined):Button{
		return new Button(
				action,
				label,
				defaultValue,
				type,
				callback
		);
	}
	public createDialog  (title:string,style:string="",content:string="",buttons:Array<any>=new Array(),submit:Array<any>=new Array(),left:undefined|number=undefined,top:undefined|number=undefined, width:number|"auto"="auto",height:number|"auto"="auto"):foundry.applications.api.DialogV2{


		commonModule.debug("Dialog Utils creating dialog width: ",width," height: ",height	);
		if(!buttons?.length || buttons.length===0)
		{
			throw new Error("DIALOG_UTILS.createDialog: buttons array must have at least one button");
		}

		const options = {
			window: { title ,resizable: true},
			content:  `<style>${style}</style>	
					<div>${content}</div>`,
			buttons,
			submit:submit,
			position:{width: width, height,left, top},
			};

		commonModule.debug("Dialog Utils dialog options: ",options	);
		const ret =  new foundry.applications.api.DialogV2(options);
		ret.render({ force: true });
		return ret;

	}
	
}

Hooks.on("onReadyCommonModule", async (data) => {


	commonModule =docDialogUtils.COMMON_MODULE;
	commonModule.debug("Dialog Utils loading on onReadyCommonModule"); 
	commonModule.DIALOG_UTILS = new DialogUtils();
	commonModule.debug("Dialog Utils ready");  
	Hooks.callAll("onReadyDialogUtils", { });
	console.log("onBeforeLoadNPCDialogButton depois de carregar o dialogutils" ,document, docDialogUtils,commonModule);
	
});

 