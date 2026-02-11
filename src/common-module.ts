import { DialogUtils } from "./dialog-utils";
import { socketFactory } from "./socket-factory";
	
const commonSocket = socketFactory.getSocket();
 
//alert(`TODO: `);
const COMMON_REGISTERED_NAMES = {
	MODULE_NAME : "common-assets",
	MODULE_VERSION : "common-assets-version"
};

 
let doc : FoundryDocument = document as FoundryDocument;

class CommonModule{
	public readonly name:string="common-assets";
	public readonly version:string="1.0.0";
	public readonly startVersion:string="";
	public DIALOG_UTILS:DialogUtils|undefined;
	private prefix:string="CA:";
	private _debugMode:boolean=true;

	constructor(){
		
	}


	public async startModule(){ 
		await doc.COMMON_MODULE.addInitCommonAssetsChanges(); 
		Hooks.callAll("onInitCommonModule", { });
	}
  
	public async addReadyCommonAssetsChanges () {
		this.debug("Criando botão de ajuda de rolagem");
		const el = doc.getElementById("roll-privacy");
		
		if(!el){
			this.error("Menu privacy não encontrado");
			return;
		}

		const botao = doc.createElement("button");
		botao.textContent = "?";
		botao.className = "ui-control icon fa-solid fa-help common-assets-help";
		botao.addEventListener("click", (event) => {
			event.preventDefault();
			const journal = game.journal.getName("Como Rolar Dados");
			this.log("Mensagem exibida ao clicar no botão ?");
			if (!journal) {
			  this.error("Journal não instalado!");
			  return;
			}
			journal.sheet.render(true);
		});

		el.appendChild(botao);
		this.debug("Botão de ajuda de rolagem criado");
	  
	}



	public async registerSetting(key:string,  type:any=String)
	{

		await game.settings.register(COMMON_REGISTERED_NAMES.MODULE_NAME,key, { type });

	}

	 

	public async registerNewSettings(){
		this.debug("registerNewSettings:10,module_name:",this.name,",key=",COMMON_REGISTERED_NAMES.MODULE_VERSION);

		
	
		this.debug("registerNewSettings:20,register  in settings key:", COMMON_REGISTERED_NAMES.MODULE_VERSION);

		this.registerSetting(COMMON_REGISTERED_NAMES.MODULE_VERSION);

		this.debug("registerNewSettings:30, registered");

 
		this.debug("registerNewSettings:40,module_name:",this.name);

	}


	public async setSettings(key:string,value:any){
		 await game.settings.set(COMMON_REGISTERED_NAMES.MODULE_NAME,key,value);  
	}

 	public async getSettings(key:string){
		 return await game.settings.get(COMMON_REGISTERED_NAMES.MODULE_NAME,key);  
	}

 

	public async addInitCommonAssetsChanges (){
		this.debug("addInitCommonAssetsChanges:10.1");
		await this.registerNewSettings(); 
		this.debug("addInitCommonAssetsChanges:20");
	}

	public async updateVersions (instalatedVersion:string,nextVersionUpdated:string) {
	 
	  if(instalatedVersion!==nextVersionUpdated) 
	  { 
		this.warnAboutUpdate(instalatedVersion,nextVersionUpdated);
		
		//code... for old versions
		 
		instalatedVersion=nextVersionUpdated;
		await this.setSettings(COMMON_REGISTERED_NAMES.MODULE_VERSION,instalatedVersion); 
	  }

	 
	 
	}
 
	public async  warnAboutUpdate (previousVersion:string,lastVersion:string){
	  this.log(`Atualizando da versão : ${previousVersion} para a versão ${lastVersion}`);
	}

	 

	public async  whaitFor (test:()=>boolean,timeout:number=60000):Promise<void>{
		let totalTime = 0;
		const ret:Promise<void>  = new Promise<void>((resolve,reject)=>{
			const handle = setInterval(()=>{
				if(test())
				{
					clearInterval(handle);
					resolve();
					return;
				}
				if(totalTime>timeout)
				{
					reject(new Error("timeout while wait For in common module "));
				}
				totalTime+100;
			},100); 
		});

		return ret;
	}

 
	public debugMode(debugLog:boolean|undefined=undefined):boolean{
		if(debugLog===undefined)
		{
			return doc.COMMON_MODULE._debugMode as boolean;
		}
		doc.COMMON_MODULE._debugMode =debugLog ||false;
		return doc.COMMON_MODULE._debugMode as boolean;
	}

	/*LOG FUNCTIONS*/
	public logPrefix(newPrefixValue:string){
		doc.COMMON_MODULE.prefix = newPrefixValue || "CA:";
	}

	public log (...args:Array<any>)  { 
		console.log(doc.COMMON_MODULE.prefix,...args);
		if(!doc.COMMON_MODULE.debugMode()) return;
		try{
			throw new Error("Thread trache");
		}
		catch(e){
			console.error("info debug:",e);
		}
	}

	public info (...args:Array<any>)  {
		console.info(doc.COMMON_MODULE.prefix,...args);
		if(!doc.COMMON_MODULE.debugMode()) return;
		try{
			throw new Error("Thread trache");
		}
		catch(e){
			console.error("info debug:",e);
		}
	}

	public error  (...args:Array<any>){
		console.error(doc.COMMON_MODULE.prefix,...args);
		if(!doc.COMMON_MODULE.debugMode()) return;
		try{
			throw new Error("Thread trache");
		}
		catch(e){
			console.error("info debug:",e);
		}
	}

	public warn (...args:Array<any>) {
		console.warn(doc.COMMON_MODULE.prefix,...args);
		if(!doc.COMMON_MODULE.debugMode()) return;
		try{
			throw new Error("Thread trache");
		}
		catch(e){
			console.error("info debug:",e);
		}
	}

	public debug (...args:Array<any>) { 
		if(!doc.COMMON_MODULE.debugMode()) return;
		console.debug(doc.COMMON_MODULE.prefix,...args);
		try{
			throw new Error("Thread trache");
		}
		catch(e){
			console.error("info debug:",e);
		}
	} 
 
}


doc = document as FoundryDocument;
doc.COMMON_MODULE = new CommonModule();

 

function startHooks(){

	Hooks.once("init", async () => {
		const doc = document as FoundryDocument;
		doc.COMMON_MODULE = new CommonModule();

		doc.COMMON_MODULE.log("Módulo Common Assets inicalizando...") ;
		await doc.COMMON_MODULE.startModule();



	});
	Hooks.once("onReadyCommonSocket", async () => {
		doc.COMMON_MODULE.debug("onReadyCommonSocket 20");
		 
		//configuration of socket
		commonSocket.register("helloEveryOne", showHelloMessageEveryOne);
 
		commonSocket.register("helloGM", showHelloMessageToGM);
		
		commonSocket.register("helloFromGM", showHelloMessageFromGM);
	


		doc.COMMON_MODULE.debug("Socketlib 20");
		commonSocket.register("add", add);
		doc.COMMON_MODULE.debug("Socketlib finish the register events");


		function showHelloMessageEveryOne(userName:string) {
			doc.COMMON_MODULE.debug(`User ${userName} says hello for everyone!`);
		}

		function showHelloMessageToGM(userName:string) {
			if(!game.user.isGM) return;
			doc.COMMON_MODULE.debug(`User ${userName} says hello to GM!`);
		}

		function showHelloMessageFromGM() {
			if(game.user.isGM) return;
			doc.COMMON_MODULE.debug(`GM say hello to you!`);
		}


		
		function add(a:number, b:number) {
			doc.COMMON_MODULE.debug("The addition is performed on a GM client.");
			return a + b;
		}  

		try{


		 
			if(commonSocket.isReadyToSendToGM())
			{ 
				commonSocket.executeForAll("helloEveryOne", "gand"); 
				if(game.user.isGM)
				{
					commonSocket.executeForAll("helloFromGM"); 
				}
				else{
					commonSocket.executeForAll("helloGM", "gand");
				}
				//testar erro, gm nao esta pronto
				const result = await commonSocket.executeAsGM("add", 5, 6);
				doc.COMMON_MODULE.log(`The GM client calculated: ${result}`);
			}
			else{
				doc.COMMON_MODULE.log("A minha implementacao notou que o gm nao foi carregado ainda 1");
			}
		}
		catch(e)
		{
			doc.COMMON_MODULE.log("Socketlib error gm nao carregado",e);
		}

		
	});
	
 
	Hooks.once("ready", async () => {
	
		if(!doc.COMMON_MODULE.version) {
			doc.COMMON_MODULE.error("Módulo Common Assets não está instalado ou não foi iniciado corretamente.");
			return;
		}

		if(game.user.isGM){ 
			doc.COMMON_MODULE.log("GM detected, adding isGM class to body");
			document.body.classList.add("isGM");
		}



		doc.COMMON_MODULE.log("Módulo Common Assets call all onReadyCommonModule.");

	

		doc.COMMON_MODULE.log("Módulo Common Assets sent the messages.");


		doc.COMMON_MODULE.log("Módulo Common Assets launched onReadyCommonModule.");

		doc.COMMON_MODULE.log(`Getting the old version with key:${COMMON_REGISTERED_NAMES.MODULE_VERSION}`) ;

		const instalatedVersion  = await doc.COMMON_MODULE.getSettings(COMMON_REGISTERED_NAMES.MODULE_VERSION);


		let nextVersionUpdated = "1.0.6";

		
		await doc.COMMON_MODULE.addReadyCommonAssetsChanges();


		Hooks.callAll("onReadyCommonModule", { });

 

		if (instalatedVersion === nextVersionUpdated) {
			doc.COMMON_MODULE.log(`Módulo Common Assets v.${nextVersionUpdated} carregado com sucesso!`) ;
			return;
		}
	
		
		await doc.COMMON_MODULE.updateVersions(instalatedVersion,nextVersionUpdated);

		//FIM DE ATUALIZAÇÃO DE VERSÃO
		doc.COMMON_MODULE.log(`Módulo Common Assets ${doc.COMMON_MODULE.version} carregado com sucesso!`); 

		
	});


}

startHooks();
