
import { injectController, LogGenericImpl, Log } from "taulukko-commons";
import { CommonModule } from "./common-module";


const commonModule = new CommonModule();
const doc = document as FoundryDocument;
const logguer: Log = new LogGenericImpl({ format: "", prefix: "CA", hasDate: true, hasLevel: true });

injectController.registerByName("FoundryDocument", doc);
injectController.registerByClass(commonModule);
injectController.registerByName("Log", logguer);

commonModule.init(); 