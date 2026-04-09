
import { Log, injectController } from "taulukko-commons";
import { Button } from "../npc/button";
import { SubModuleBase } from "../sub-module-base";
import { NPC } from "../npc/npc";
import { NPCDialog } from "../npc/npc-dialog";
import { CommonModule } from "../../common-module";

export class DialogUtils extends SubModuleBase {


	public readonly npctype = NPC; 

	#requiredHooksLoaded: boolean = false;


	protected async waitReady() {
		const logguer: Log = injectController.resolve("CommonLogguer"); 
 
		Hooks.callAll("onReadyDialogUtils", {});
		logguer.debug("Dialog Utils ready");
	}


	protected async initHooks() { 
		const dialogUtils:DialogUtils = injectController.resolve( "DialogUtils"); 
		dialogUtils.#requiredHooksLoaded = true;
	}


	public createButton(action: string, label: string, defaultValue: boolean = false, type: string = "screen", callback: any = undefined): Button {
 
		const button:Button = new Button(
			action,
			label,
			defaultValue,
			type,
			callback
		);
 

		return button;
	}

	public createDialog(title: string, style: string = "", content: string = "", buttons: Array<any> = new Array(), submit:( ... args:any[] )=>void = ()=>{}, left: undefined | number = undefined, top: undefined | number = undefined, width: number | "auto" = "auto", height: number | "auto" = "auto"): foundry.applications.api.DialogV2 {

		const logguer: Log = injectController.resolve("CommonLogguer");
		logguer.debug("Dialog Utils creating dialog width: ", width, " height: ", height);
		if (!buttons?.length || buttons.length === 0) {
			throw new Error("DialogUtils.createDialog: buttons array must have at least one button");
		}

		const options = {
			window: { title, resizable: true },
			content: `<style>${style}</style>	
					<div>${content}</div>`,
			buttons,
			submit: submit,
			position: { width: width, height, left, top },
		};

		logguer.debug("Dialog Utils dialog options: ", options);
		const ret = new foundry.applications.api.DialogV2(options);
		ret.render({ force: true });
		return ret;

	}

}

