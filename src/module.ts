
import { injectController, LogGenericImpl as Logguer, Level } from "taulukko-commons";
import { CommonModule } from "./common-module";
import { NPC, NPCDialog, DialogUtils, ModuleBase, SubModuleBase } from "./";

const commonModule = new CommonModule();
const doc = document as FoundryDocument;

async function initModule() {
    const configResponse = await fetch('/modules/common-scripts-dnd5ed/scripts/config.json');
    const config = await configResponse.json();
    const logConfig = config.log || { format: "", prefix: "CA", hasDate: true, hasLevel: true };
    
    const logguer: Logguer = new Logguer(logConfig);

    logguer.level(Level.DEBUG);

    injectController.registerByName("FoundryDocument", doc);
    injectController.registerByName("CommonModule", commonModule);
    injectController.registerByName("CommonLogguer", logguer);

    commonModule.init();
}

initModule();

(window as any).TaulukkoCommon = {
    NPC,
    NPCDialog,
    DialogUtils,
    ModuleBase,
    SubModuleBase,
    injectController,
    Logguer,
    Level
};