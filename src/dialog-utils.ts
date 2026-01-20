
'use strict';
import { Button } from "./ui/button";

 export class DialogUtils{
	public constructor(){
		console.info("Dialog Utils loading");
	}
	public helpSubmit:string = `
			Submit need be a function:
			(action,label,defaultValue,callback)=>{
				return result => {
						if ( result === "minsc" ) console.log("User picked minsc options.");
						else console.log("User picked option:  ", rsult );
					}
			}
			`;	
   
	public createButton  (action:string,label:string,defaultValue:boolean=false,type:string="screen",callback:any):Button{
		return new Button(
				action,
				label,
				defaultValue,
				type,
				callback
		);
	}
	public createDialog   (title:string,style:string="",content:string,buttons:Array<any>,submit:Array<any>):foundry.applications.api.DialogV2{

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

	}
	
}
  
 
const docDialogUtils:FoundryDocument = document as FoundryDocument;


Hooks.on("onReadyCommonModule", async (data) => {
	docDialogUtils.COMMON_MODULE.debug("Dialog Utils loading on onReadyCommonModule");
	Hooks.callAll("onInitDialogUtils", { });
	docDialogUtils.COMMON_MODULE.DIALOG_UTILS = new DialogUtils();
	docDialogUtils.COMMON_MODULE.debug("Dialog Utils ready");
	Hooks.callAll("onReadyDialogUtils", { });
	
});

