import { Log, injectController } from "taulukko-commons";
import { SubModuleBase } from "../sub-module-base";
import { CommonModule } from "../../common-module";

export class PlayersTools extends SubModuleBase {
	#requiredHooksLoaded: boolean = false;

	protected async initHooks() {
		const commonModule:CommonModule = injectController.resolve("CommonModule");

		const fiveMinute: number = 5 * 60 * 1000;
		const playerTools: PlayersTools = injectController.resolve("PlayersTools");
	
		await playerTools.whaitFor(() => commonModule.isReady(), fiveMinute);
		
		if(!commonModule.isReady())
		{
			throw new Error("Timeout waiting for Common module"); 
		}
 
		const logguer: Log = injectController.resolve("CommonLogguer");
		logguer.debug("Starting PlayersTools init hooks");
		playerTools.initializeFlyMeasure(); 
		playerTools.#requiredHooksLoaded = true;
	}

	protected async waitReady() {
		const fiveMinutes = 5 * 60 * 1000;
		await this.whaitFor(() => this.#requiredHooksLoaded, fiveMinutes);
		if (!this.#requiredHooksLoaded) {
			throw new Error("Timeout waiting for hooks");
		}
		Hooks.callAll("onReadyPlayersTools", {});
	}

	public initializeFlyMeasure() {
		const logguer: Log = injectController.resolve("CommonLogguer");
		logguer.debug("initlizeFlyMeasure init");
	}

}
