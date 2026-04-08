import { Log, injectController } from "taulukko-commons";
import { socketTest } from "./sockets/common-socket-test";
import { ModuleBase } from "./common/module-base";
import { SubModuleBase } from "./submodules/sub-module-base";
import { RegionUtils } from "./submodules/region-utils/region-utils";
import { PlayersTools } from "./submodules/playertools/players-tool";
import { DialogUtils } from "./submodules/dialog-utils/dialog-utils";
import { HeroPoints } from "./submodules/hero-points/hero-points";
import { HideUnidentify } from "./submodules/hide-unindentify/hide-unidentify";
import { DummySocket } from "./sockets/implementations/common-socket-dummy";
import { Socket } from "./sockets/common-socket"; 

//import "./url-fix"; apenas na necessidade de corrigir

const COMMON_REGISTERED_NAMES = {
	MODULE_VERSION: "common-assets-version"
};

const doc: FoundryDocument = document as FoundryDocument;
export class CommonModule extends ModuleBase {

	
	public readonly name: string = "common-scripts-dnd5ed";
	public readonly version: string = "1.0.6";
	public readonly startVersion: string = "";
	#debug: boolean = true;
	#hooksRequiredLoaded: boolean = false;



	public async addInitCommonAssetsChanges() {

		const logguer: Log = injectController.resolve("CommonLogguer");
		const commonModule: CommonModule = injectController.resolve("CommonModule");


		logguer.debug("addInitCommonAssetsChanges:20,register  commnModule:", commonModule);

		this.registerSetting(COMMON_REGISTERED_NAMES.MODULE_VERSION);

	}

	public async init() {
		await super.init();
		await this.loadSubModules();
	}

	private async loadSubModules() {
		const subModules: SubModuleBase[] = [
			new RegionUtils(), new PlayersTools(), new DialogUtils(), new HeroPoints(), new HideUnidentify()
		];

		subModules.forEach(async (subModule) => {
			injectController.registerByClass(subModule);
			await subModule.init();
		});

		//choose implementation dependes what I want
		const commonSocket: Socket = new DummySocket();
		injectController.registerByName("Socket", commonSocket);
	}

	protected async waitReady() {
		const fiveMinutes = 5 * 60 * 1000;
		await this.whaitFor(() => this.#hooksRequiredLoaded, fiveMinutes);
		if (!this.#hooksRequiredLoaded) {
			throw new Error("Timeout waiting for hooks");
		}
		Hooks.callAll("onReadyCommonModule", {});
	}

	protected initHooks(): void {

		Hooks.once("init", async () => {
			const commonModule: CommonModule = injectController.resolve("CommonModule");
			const logguer: Log = injectController.resolve("CommonLogguer");

			logguer.info("Módulo Common Assets inicalizando...");
			await commonModule.addInitCommonAssetsChanges();

		});




		Hooks.once("ready", async () => {
			const commonModule: CommonModule = injectController.resolve("CommonModule");
			const logguer: Log = injectController.resolve("CommonLogguer");

			if (!commonModule.version) {
				logguer.error("Módulo Common Assets não está instalado ou não foi iniciado corretamente.");
				return;
			}

			if (game.user.isGM) {
				logguer.debug("GM detected, adding isGM class to body");
				document.body.classList.add("isGM");
			}



			logguer.debug(`Getting the old version with key:${COMMON_REGISTERED_NAMES.MODULE_VERSION}`);

			const instalatedVersion = await commonModule.getSettings(COMMON_REGISTERED_NAMES.MODULE_VERSION);


			await commonModule.addReadyCommonAssetsChanges();

			//debug only
			socketTest();


			this.#hooksRequiredLoaded = true;


			if (instalatedVersion === commonModule.version) {
				logguer.info(`Módulo Common Assets v.${commonModule.version} carregado com sucesso!`);
				return;
			}


			await commonModule.updateVersions(instalatedVersion, commonModule.version);

			//FIM DE ATUALIZAÇÃO DE VERSÃO
			logguer.info(`Módulo Common Assets atualizado de ${instalatedVersion} para ${commonModule.version} e carregado com sucesso!`);


		});

	}

	public async addReadyCommonAssetsChanges() {
		const logguer: Log = injectController.resolve("CommonLogguer");

		logguer.info("Criando botão de ajuda de rolagem");
		const el = doc.getElementById("roll-privacy");

		if (!el) {
			logguer.error("Menu privacy não encontrado");
			return;
		}

		const botao = doc.createElement("button");
		botao.textContent = "?";
		botao.className = "ui-control icon fa-solid fa-help common-assets-help";
		botao.addEventListener("click", (event) => {
			event.preventDefault();
			const journal = game.journal.getName("Como Rolar Dados");
			logguer.info("Mensagem exibida ao clicar no botão ?");
			if (!journal) {
				logguer.error("Journal não instalado!");
				return;
			}
			journal.sheet.render(true);
		});

		el.appendChild(botao);
		logguer.info("Botão de ajuda de rolagem criado");

	}



	public async registerSetting(key: string, type: any = String) {
		const commonModule: CommonModule = injectController.resolve("CommonModule");

		await game.settings.register(commonModule.name, key, { type });

	}

	public async setSettings(key: string, value: any) {
		const commonModule: CommonModule = injectController.resolve("CommonModule");
		await game.settings.set(commonModule.name, key, value);
	}

	public async getSettings(key: string) {
		const commonModule: CommonModule = injectController.resolve("CommonModule");
		return await game.settings.get(commonModule.name, key);
	}

	public async updateVersions(instalatedVersion: string, nextVersionUpdated: string) {

		if (instalatedVersion !== nextVersionUpdated) {
			this.warnAboutUpdate(instalatedVersion, nextVersionUpdated);

			//code... for old versions

			instalatedVersion = nextVersionUpdated;
			await this.setSettings(COMMON_REGISTERED_NAMES.MODULE_VERSION, instalatedVersion);
		}
	}

	public async warnAboutUpdate(previousVersion: string, lastVersion: string) {

		const logguer: Log = injectController.resolve("CommonLogguer");

		logguer.info(`Atualizando da versão : ${previousVersion} para a versão ${lastVersion}`);
	}

	public debug(debug: boolean | undefined) {
		if (debug !== undefined) {
			this.#debug = debug;
		}

		return this.#debug;
	}
}