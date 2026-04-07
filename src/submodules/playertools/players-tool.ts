import { Log, injectController } from "taulukko-commons";
import { SubModuleBase } from "../sub-module-base";

export class PlayersTools extends SubModuleBase {
	#requiredHooksLoaded: boolean = false;

	protected initHooks() {
		Hooks.on("onReadyCommonModule", async () => {
			const playersTools: PlayersTools = injectController.resolve("PlayersTools");
			const logguer: Log = injectController.resolve("Log");
			logguer.info("Starting Hability hero processing");
			playersTools.initializeFlyMeasure();
			playersTools.#requiredHooksLoaded = true;
		});

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
		const logguer: Log = injectController.resolve("Log");
		logguer.debug("initlizeFlyMeasure init");
	}

}
