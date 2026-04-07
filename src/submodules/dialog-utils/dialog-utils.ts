
import { Log, injectController } from "taulukko-commons";
import { Button } from "../npc/button";
import { SubModuleBase } from "../sub-module-base";
import { NPC } from "../npc/npc";
import { NPCDialog } from "../npc/npc-dialog";

export class DialogUtils extends SubModuleBase {


	public readonly npctype = NPC;

	public readonly NPC_DIALOG: NPCDialog = new NPCDialog();

	#requiredHooksLoaded: boolean = false;


	protected async waitReady() {
		const logguer: Log = injectController.resolve("Log");

		const fiveMinutes = 5 * 60 * 1000;
		await this.whaitFor(() => this.#requiredHooksLoaded, fiveMinutes);
		if (!this.#requiredHooksLoaded) {
			throw new Error("Timeout waiting for hooks");
		}
		Hooks.callAll("onReadyDialogUtils", {});
		logguer.debug("Dialog Utils ready");
	}


	protected initHooks(): void {

		Hooks.on("onReadyCommonModule", async (data) => {
			const dialogUtils: DialogUtils = injectController.resolve("DialogUtils");

			const logguer: Log = injectController.resolve("Log");

			logguer.debug("Dialog Utils loading on onReadyCommonModule");
			dialogUtils.#requiredHooksLoaded = true;
		});
	}


	public createButton(action: string, label: string, defaultValue: boolean = false, type: string = "screen", callback: any = undefined): Button {
		return new Button(
			action,
			label,
			defaultValue,
			type,
			callback
		);
	}

	public createDialog(title: string, style: string = "", content: string = "", buttons: Array<any> = new Array(), submit: Array<any> = new Array(), left: undefined | number = undefined, top: undefined | number = undefined, width: number | "auto" = "auto", height: number | "auto" = "auto"): foundry.applications.api.DialogV2 {

		const logguer: Log = injectController.resolve("Log");
		logguer.debug("Dialog Utils creating dialog width: ", width, " height: ", height);
		if (!buttons?.length || buttons.length === 0) {
			throw new Error("DIALOG_UTILS.createDialog: buttons array must have at least one button");
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

