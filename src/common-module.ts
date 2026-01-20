import { DialogUtils } from "./dialog-utils";


let socket:any;

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
	}

	public info (...args:Array<any>)  {
		console.info(doc.COMMON_MODULE.prefix,...args);
	}

	public error  (...args:Array<any>){
		console.error(doc.COMMON_MODULE.prefix,...args);
	}

	public warn (...args:Array<any>) {
		console.warn(doc.COMMON_MODULE.prefix,...args);
	}

	public debug (...args:Array<any>) { 
		if(!doc.COMMON_MODULE.debugMode()) return;
		console.debug(doc.COMMON_MODULE.prefix,...args);
	} 
}


doc = document as FoundryDocument;
doc.COMMON_MODULE = new CommonModule();

 

Hooks.once("init", async () => {
	const doc = document as FoundryDocument;
	doc.COMMON_MODULE = new CommonModule();

	doc.COMMON_MODULE.log("Módulo Common Assets inicalizando...") ;
	await doc.COMMON_MODULE.startModule();

});


Hooks.once("socketlib.ready", () => {

	doc.COMMON_MODULE.log("Socketlib ready");

	const moduleName = COMMON_REGISTERED_NAMES.MODULE_NAME;
	const module = game.modules.get(moduleName);
	if (!module?.active) {
		console.error(`socketlib | Someone tried to register module '${moduleName}', but no module with that name is active. As a result the registration request has been ignored.`);
		return undefined;
	}

	//enable use of sockets
	module.socket = true;
	
	socket = socketlib.registerModule(moduleName);
	if(socket==undefined)
	{
		throw new Error("socket not loaded");
	}
	doc.COMMON_MODULE.log("Socketlib 10",socket);
	socket.register("hello", showHelloMessage1);
	doc.COMMON_MODULE.log("Socketlib 20");
	socket.register("add", add);
	doc.COMMON_MODULE.log("Socketlib finish the register events");


	function showHelloMessage1(userName:string) {
		console.log(`User ${userName} says hello 1!`);
	}

	
	function add(a:number, b:number) {
		console.log("The addition is performed on a GM client.");
		return a + b;
	}
});


Hooks.once("ready", async () => {
   
	if(!doc.COMMON_MODULE.version) {
		doc.COMMON_MODULE.error("Módulo Common Assets não está instalado ou não foi iniciado corretamente.");
		return;
	}


	//configuration of socket




	doc.COMMON_MODULE.log("Módulo Common Assets call all onReadyCommonModule.");

	const showHelloMessage2 = function(userName:string) {
		console.log(`User ${userName} says hello 1!`);
	};



	doc.COMMON_MODULE.log("Socketlib sending",socket);

	try{

		// Let's send a greeting to all other connected users.
		// Functions can either be called by their given name...
		socket.executeForEveryone("hello", game.user.name);
		// ...or by passing in the function that you'd like to call.
		/* envio de funcao nao funcionou em nenhuma tentativa que fiz, mas nao precisamos disso
		socket.executeForEveryone((userName:string)=>{
			console.log(`User ${userName} says hello 1!`);
		}, game.user.name);
		*/
		// The following function will be executed on a GM client.
		// The return value will be sent back to us.
		const result = await socket.executeAsGM("add", 5, 3);
		console.log(`The GM client calculated: ${result}`);
	
	}
	catch(e)
	{
		doc.COMMON_MODULE.log("Socketlib error",e);
	}

	doc.COMMON_MODULE.log("Módulo Common Assets sent the messages.");

	Hooks.callAll("onReadyCommonModule", { });

	doc.COMMON_MODULE.log("Módulo Common Assets launched onReadyCommonModule.");

	doc.COMMON_MODULE.log(`Getting the old version with key:${COMMON_REGISTERED_NAMES.MODULE_VERSION}`) ;

	const instalatedVersion  = await doc.COMMON_MODULE.getSettings(COMMON_REGISTERED_NAMES.MODULE_VERSION);


	let nextVersionUpdated = "1.0.6";

	await doc.COMMON_MODULE.addReadyCommonAssetsChanges();



	if (instalatedVersion === nextVersionUpdated) {
		doc.COMMON_MODULE.log(`Módulo Common Assets v.${nextVersionUpdated} carregado com sucesso!`) ;
		return;
	}
 
	await doc.COMMON_MODULE.updateVersions(instalatedVersion,nextVersionUpdated);

	//FIM DE ATUALIZAÇÃO DE VERSÃO
  	doc.COMMON_MODULE.log(`Módulo Common Assets ${doc.COMMON_MODULE.version} carregado com sucesso!`); 

	
});

