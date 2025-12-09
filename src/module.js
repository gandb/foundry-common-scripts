//alert(`TODO: `);

const commonModule = {
	name:"common-assets",
	properties:{version:"version"},
	version:"",
	startVersion:"",
	prefix:"CA",
	debugMode:false,
  
	async addReadyCommonAssetsChanges (){
		this.log("Criando botão de ajuda de rolagem");
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
		this.log("Botão de ajuda de rolagem criado");
	  
	},
	registerNewSettings(){
		this.log("registerNewSettings:10,module_name:",this.name,",version=",this.version);
		game.settings.register(this.name,this.version,{ 
		  scope: 'world',   
		  config: false,      
		  type: String,
		  default: "",
		});
		this.log("registerNewSettings:20,module_name:",this.name,",version=",this.version);

	},


	async addInitCommonAssetsChanges (){
		this.log("addInitCommonAssetsChanges:10.1");
		this.registerNewSettings(); 
		this.log("addInitCommonAssetsChanges:20");
	},

	async updateVersions (instalatedVersion,nextVersionUpdated) {
	 
	  if(instalatedVersion!==nextVersionUpdated) 
	  { 
		this.warnAboutUpdate(nextVersionUpdated);
		
		//code...
		 
		instalatedVersion=nextVersionUpdated;
		game.settings.set(this.name,this.version,instalatedVersion); 
	  }

	 
	/*
	  nextVersionUpdated = "1.0.7";
	  if(instalatedVersion!=nextVersionUpdated) 
	  {
		warnAboutUpdate(nextVersionUpdated);
		
		//code...
		 
		instalatedVersion=nextVersionUpdated;
		game.settings.set(this.name,this.version,instalatedVersion); 
	  } 

	  */

	},
 
	async  warnAboutUpdate (lastVersion){
	  this.log(`Atualizando para a versão ${lastVersion}`);
	},

	async startModule (modulo) {
	   if (!modulo) {
		return false;
	  }
		
	  this.version = modulo.version; 
	  this.log(`Common Assets versão: ${this.version}`); 
	},

	async endModuleAfterUpdate (){
	  await game.settings.set(this.name, this.properties.version,this.version);  
	 
	  this.log(`Módulo Common Assets ${this.version} carregado com sucesso!`); 
	},
	debugMode(debugLog){
		commonModule.debugMode =debugLog ||false;
	},
	logPrefix(newPrefixValue){
		commonModule.prefix = newPrefixValue || "CA:";
	},
	log (...args)  {
		console.log(commonModule.prefix,...args);
	},
	error  (...args){
		console.error(commonModule.prefix,...args);
	},
	warn (...args) {
		console.warn(commonModule.prefix,...args);
	},
	debug (...args) {
		if(!commonModule.debugMode) return;
		console.debug(commonModule.prefix,...args);
	} 
};

 

Hooks.once("init", async () => {
	/*
	commonModule.log("Módulo Common Assets inicalizando...") ;
	const modulo = game.modules.get(commonModule.name);
	await commonModule.startModule(modulo);
	await commonModule.addInitCommonAssetsChanges();
	*/
});

Hooks.once("ready", async () => {
   
  if(!commonModule.version) {
    commonModule.error("Módulo Common Assets não está instalado ou não foi iniciado corretamente.");
    return;
  }

  //ATUALIZAÇÃO DE VERSÃO 
  const instalatedVersion  = game.settings.get(commonModule.name,commonModule.version);


  let nextVersionUpdated = "0.0.5";
  
  await commonModule.addReadyCommonAssetsChanges();

 
  if (instalatedVersion === nextVersionUpdated) {
    commonModule.log(`Módulo Common Assets v.${nextVersionUpdated} carregado com sucesso!`) ;
    return;
  }
  
  
  
  await commonModule.updateVersions(instalatedVersion,nextVersionUpdated);

  //FIM DE ATUALIZAÇÃO DE VERSÃO

  if(!await commonModule.endModuleAfterUpdate()){
      commonModule.error("Módulo Common Assets não finalizou corretamente ver logs anteriores.");
      return;
  }
});
