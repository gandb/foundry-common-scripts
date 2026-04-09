
import { Log, injectController } from "taulukko-commons";
import { SubModuleBase } from "../sub-module-base"; 
 

const REGION_UTILS_REGISTERED_NAMES = {
	MODULE_NAME: "common-assets",
	TOOGLE_VISIBILITY: "common-assets-toogle-visibility-regions"
};

export class RegionUtils extends SubModuleBase {
	#requiredHooksLoaded: boolean = false;

	protected async initHooks() {


		Hooks.once("init", async () => {
			 
			const logguer: Log = injectController.resolve("CommonLogguer");

			logguer.debug("RegionUtils.initHooks: init event, registering key bindings");

			const regionUtils: RegionUtils = injectController.resolve("RegionUtils");

			regionUtils.registerKeybindings(); 

			logguer.debug("RegionUtils.initHooks: init event, registering key bindings done!");

			regionUtils.#requiredHooksLoaded = true; 

		});
 
	
	}

	protected async waitReady() {
		const logguer: Log = injectController.resolve("CommonLogguer");
		const fiveMinutes = 5 * 60 * 1000;
		await this.whaitFor(() => this.#requiredHooksLoaded, fiveMinutes);
		if (!this.#requiredHooksLoaded) {
			throw new Error("Timeout waiting for hooks");
		}
		Hooks.callAll("onReadyRegionUtils", {});
		logguer.debug("Region Utils ready");
	}
 

	stop(event: any) {
		const logguer: Log = injectController.resolve("CommonLogguer");
		const shape: any = event?.region?.shapes[0];
		logguer.debug("event:", event, ",shape:", shape);

		if (!shape) {
			logguer.error("shape not found");
			return;
		}



		const width: number = shape.width;
		const height: number = shape.height;
		const newX: number = shape.x as number + Math.round(width / 2);
		const newY: number = shape.y + Math.round(height / 2);

		const token = event?.data?.token;


		token.x = newX;
		token.y = newY;

		logguer.debug("Token indo para x:", newX, ",y:", newY);
		token.update({ x: token.x, y: token.y });

	}

	toggleVisibilityRegions() {
		const logguer: Log = injectController.resolve("CommonLogguer");
		logguer.debug("toggleVisibilityRegions called");
		const activeScene = game.scenes.current;
		if (!activeScene) {
			logguer.error("No scene active");
			return;
		}


		activeScene.regions.forEach((region: any) => {
			const logguer: Log = injectController.resolve("CommonLogguer");
			logguer.debug("region", region);

			region.update({
				visibility: !region.visibility
			});

		});

	}



	registerKeybindings() {
		game.keybindings.register(REGION_UTILS_REGISTERED_NAMES.MODULE_NAME, REGION_UTILS_REGISTERED_NAMES.TOOGLE_VISIBILITY, {
			name: "Alternar visão das regiões da cena",
			hint: "Liga/desliga visibilidade das regiões da cena atual.",
			editable: [
				{
					key: "KeyG",
					modifiers: ["Shift"]
				}
			],
			onDown: async () => {
				const regionUtils:RegionUtils = injectController.resolve("RegionUtils");
				const logguer:Log = injectController.resolve("CommonLogguer");
				logguer.debug("onDown will be called");

				regionUtils.toggleVisibilityRegions();
			},
			restricted: true,   // true = só GM
			reservedModifiers: [], // normalmente vazio
			precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
		});

	}
}
