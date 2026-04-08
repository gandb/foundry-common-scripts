
import { injectController, LogGenericImpl as Logguer, Level } from "taulukko-commons";
import { CommonModule } from "./common-module";
import { NPC, NPCDialog, DialogUtils, ModuleBase, SubModuleBase } from "./";

const commonModule = new CommonModule();
const doc = document as FoundryDocument;
const logguer: Logguer = new Logguer({ format: "", prefix: "CA", hasDate: true, hasLevel: true });

injectController.registerByName("FoundryDocument", doc);
injectController.registerByName("CommonModule", commonModule);
injectController.registerByName("CommonLogguer", logguer);


commonModule.init();

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