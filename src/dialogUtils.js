
'use strict'; 
 

const dialogUtilsV1_0_0 = {} ;

console.log("CA: Dialog Utils loading");


dialogUtilsV1_0_0.helpSubmit = `
Submit need be a function:
 (action,label,defaultValue,callback)=>{
	return result => {
			if ( result === "minsc" ) console.log("User picked minsc options.");
			else console.log("User picked option:  ", rsult );
		}
}
`;


dialogUtilsV1_0_0.createButton = (action,label,defaultValue=false,type="screen",callback)=>{
	return {
			action,
			label,
			defaultValue,
			type,
			callback
		};
};

dialogUtilsV1_0_0.createDialog = (title,style="",content,buttons,submit)=>{

	if(!buttons || !buttons.length || buttons.length===0)
	{
		throw new Error("dialogUtilsV1_0_0.createDialog: buttons array must have at least one button");
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


Hooks.once("init", async () => {	
	game.dialogUtils=dialogUtilsV1_0_0;
	console.log("CA: Dialog Utils loaded");
});