
'use strict';
import { Button } from "./ui/button";


const docDialogUtils:FoundryDocument = document as FoundryDocument;

 export class DialogUtils{
	public constructor(){

	}
	public createButton  (action:string,label:string,defaultValue:boolean=false,type:string="screen",callback:any):Button{
		return new Button(
				action,
				label,
				defaultValue,
				type,
				callback
		);
	}
	public createDialog   (title:string,style:string="",content:string,buttons:Array<any>,submit:Array<any>,left:undefined|number=undefined,top:undefined|number=undefined, width:number|"auto",height:number|"auto"):foundry.applications.api.DialogV2{


		docDialogUtils.COMMON_MODULE.debug("Dialog Utils creating dialog width: ",width," height: ",height	);
		if(!buttons || !buttons.length || buttons.length===0)
		{
			throw new Error("DIALOG_UTILS.createDialog: buttons array must have at least one button");
		}

		const options = {
			window: { title ,resizable: true},
			content:  `<style>${style}</style>	
					<div>${content}</div>`,
			buttons,
			submit:submit,
			position:{width: width, height,left, top},
			};

		docDialogUtils.COMMON_MODULE.debug("Dialog Utils dialog options: ",options	);
		const ret =  new foundry.applications.api.DialogV2(options);
		ret.render({ force: true });
		return ret;

	}
	
}
  
 


Hooks.on("onReadyCommonModule", async (data) => {
	docDialogUtils.COMMON_MODULE.debug("Dialog Utils loading on onReadyCommonModule");
	Hooks.callAll("onInitDialogUtils", { });
	docDialogUtils.COMMON_MODULE.DIALOG_UTILS = new DialogUtils();
	docDialogUtils.COMMON_MODULE.debug("Dialog Utils ready");
	Hooks.callAll("onReadyDialogUtils", { });
	
});

