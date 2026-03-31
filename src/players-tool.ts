
 
const docDialogUtils:FoundryDocument = document as FoundryDocument;

export class PlayersTools{
 
}


function initializeFlyMeasure(){
}
  
 
 

Hooks.on("onReadyCommonModule", async () => {
	doc.COMMON_MODULE.info("Starting Hability hero processing");
	initializeFlyMeasure();
	doc.COMMON_MODULE.info("Hability hero initialized");
});
