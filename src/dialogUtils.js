
'use strict'; 
 

function createDialogUtils(){

	document.COMMON_MODULE.DIALOG_UTILS= {} ;

	console.log("CA: Dialog Utils loading");


	document.COMMON_MODULE.DIALOG_UTILS.helpSubmit = `
	Submit need be a function:
	(action,label,defaultValue,callback)=>{
		return result => {
				if ( result === "minsc" ) console.log("User picked minsc options.");
				else console.log("User picked option:  ", rsult );
			}
	}
	`;


	document.COMMON_MODULE.DIALOG_UTILS.createButton = (action,label,defaultValue=false,type="screen",callback)=>{
		return {
				action,
				label,
				defaultValue,
				type,
				callback
			};
	};

	document.COMMON_MODULE.DIALOG_UTILS.createDialog = (title,style="",content,buttons,submit)=>{

		if(!buttons || !buttons.length || buttons.length===0)
		{
			throw new Error("DIALOG_UTILS.createDialog: buttons array must have at least one button");
		}

		const options = {
			window: { title },
			content:  `<style>${style}</style>	
					<div>${content}</div>`,
			buttons,
			submit
			};

		const ret =  new foundry.applications.api.DialogV2(options);
		ret.render({ force: true });
		return ret;

	};


}

Hooks.on("onInitCommonModule", async (data) => {
	createDialogUtils();
	document.COMMON_MODULE.log("Dialog Utils loaded");
	Hooks.callAll("onInitDialogUtils", { });
	
});

Hooks.on("onInitCommonModule", async (data) => { 
	Hooks.callAll("onReadyDialogUtils", { });
	
});

Hooks.once("init", async () => {	 
	 
});


Hooks.once("ready", async () => {	 
	
});