//alert(`TODO: `);
const COMMON_REGISTERED_NAMES = {
	MODULE_NAME : "common-assets",
	MODULE_VERSION : "common-assets-version",
	TOOGLE_VISIBILITY :  "common-assets-toogle-visibility-regions"
};
const COMMON_MODULE = {
	name:"common-assets",
	version:"0.0.0",
	startVersion:"",
	prefix:"CA:",
	_debugMode:false,
  
	async addReadyCommonAssetsChanges (){
		this.debug("Criando botão de ajuda de rolagem");
		const el = document.getElementById("roll-privacy");
		
		if(!el){
			this.error("Menu privacy não encontrado");
			return;
		}

		const botao = document.createElement("button");
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
	  
	},
	registerNewSettings(){
		this.debug("registerNewSettings:10,module_name:",this.name,",version=",this.version);
		game.settings.register(COMMON_REGISTERED_NAMES.MODULE_NAME,COMMON_REGISTERED_NAMES.MODULE_VERSION,{ 
		  scope: 'world',   
		  config: false,      
		  type: String,
		  default: "",
		});
		this.debug("registerNewSettings:20,module_name:",this.name,",version=",this.version);

	},


	async addInitCommonAssetsChanges (){
		this.debug("addInitCommonAssetsChanges:10.1");
		this.registerNewSettings(); 
		this.debug("addInitCommonAssetsChanges:20");
	},

	async updateVersions (instalatedVersion,nextVersionUpdated) {
	 
	  if(instalatedVersion!==nextVersionUpdated) 
	  { 
		this.warnAboutUpdate(nextVersionUpdated);
		
		//code...
		 
		instalatedVersion=nextVersionUpdated;
		game.settings.set(COMMON_REGISTERED_NAMES.MODULE_VERSION,instalatedVersion); 
	  }

	 
	/*
	  nextVersionUpdated = "1.0.7";
	  if(instalatedVersion!=nextVersionUpdated) 
	  {
		warnAboutUpdate(nextVersionUpdated);
		
		//code...
		 
		instalatedVersion=nextVersionUpdated;
		game.settings.set(COMMON_REGISTERED_NAMES.MODULE_VERSION,instalatedVersion); 
	  } 

	  */

	},
 
	async  warnAboutUpdate (lastVersion){
	  this.log(`Atualizando para a versão ${lastVersion}`);
	},

	async toggleVisibilityRegions(){
		document.COMMON_MODULE.debug("toggleVisibilityRegions called");
		const activeScene = game.scenes.current;
		if(!activeScene)
		{
			document.COMMON_MODULE.log("No scene active");
			return;
		}

		
		activeScene.regions.forEach((region)=>{

				document.COMMON_MODULE.debug("region",region);
				
				region.update({
					visibility: !region.visibility  
				});
			
		});

	},

	async registerKeybindings(modulo){
		game.keybindings.register(COMMON_REGISTERED_NAMES.MODULE_NAME,COMMON_REGISTERED_NAMES.TOOGLE_VISIBILITY, {
			name: "Alternar visão das regiões da cena",
			hint: "Liga/desliga visibilidade das regiões da cena atual.",
			editable: [
			{
				key: "KeyG",
				modifiers: ["Shift"]
			}
			],
			onDown: async () => {
				document.COMMON_MODULE.debug("onDown will be called");
	
				document.COMMON_MODULE.toggleVisibilityRegions(); 
			},
			restricted: true,   // true = só GM
			reservedModifiers: [], // normalmente vazio
			precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
		}); 

	},

	async startModule (modulo) {
	   if (!modulo) {
		return false;
	  }
		
	  this.version = modulo.version; 
	  this.log(`Common Assets versão: ${this.version}`); 
	  await this.registerKeybindings(modulo);
	
	},

	async endModuleAfterUpdate (){
	  await game.settings.set(COMMON_REGISTERED_NAMES.MODULE_VERSION,this.version);  
	 
	  this.log(`Módulo Common Assets ${this.version} carregado com sucesso!`); 
	},
	debugMode(debugLog){
		if(debugLog===undefined)
		{
			return COMMON_MODULE._debugMode;
		}
		COMMON_MODULE._debugMode =debugLog ||false;
	},
	logPrefix(newPrefixValue){
		COMMON_MODULE.prefix = newPrefixValue || "CA:";
	},
	log (...args)  {
		console.log(COMMON_MODULE.prefix,...args);
	},
	info (...args)  {
		console.info(COMMON_MODULE.prefix,...args);
	},
	error  (...args){
		console.error(COMMON_MODULE.prefix,...args);
	},
	warn (...args) {
		console.warn(COMMON_MODULE.prefix,...args);
	},
	debug (...args) {
		if(!COMMON_MODULE.debugMode()) return;
		console.debug(COMMON_MODULE.prefix,...args);
	} 
};

 

Hooks.once("init", async () => {
	COMMON_MODULE.log("Módulo Common Assets inicalizando...") ;
	const modulo = game.modules.get(COMMON_MODULE.name);
	await COMMON_MODULE.startModule(modulo);
	await COMMON_MODULE.addInitCommonAssetsChanges();
	document.COMMON_MODULE = COMMON_MODULE;
	Hooks.callAll("onInitCommonModule", { });


});

Hooks.once("ready", async () => {
   
	if(!COMMON_MODULE.version) {
	COMMON_MODULE.error("Módulo Common Assets não está instalado ou não foi iniciado corretamente.");
	return;
	}


	Hooks.callAll("onReadyCommonModule", { });

	//ATUALIZAÇÃO DE VERSÃO 
	const instalatedVersion  = game.settings.get(COMMON_REGISTERED_NAMES.MODULE_VERSION,COMMON_MODULE.version);


	let nextVersionUpdated = "0.0.5";

	await COMMON_MODULE.addReadyCommonAssetsChanges();



	if (instalatedVersion === nextVersionUpdated) {
	COMMON_MODULE.log(`Módulo Common Assets v.${nextVersionUpdated} carregado com sucesso!`) ;
	return;
	}



	await COMMON_MODULE.updateVersions(instalatedVersion,nextVersionUpdated);

	//FIM DE ATUALIZAÇÃO DE VERSÃO

	if(!await COMMON_MODULE.endModuleAfterUpdate()){
		COMMON_MODULE.error("Módulo Common Assets não finalizou corretamente ver logs anteriores.");
		return;
	}


});

