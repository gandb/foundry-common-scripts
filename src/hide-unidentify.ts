
'use strict'; 
 
const docHideUnidentify:FoundryDocument = document as FoundryDocument;



function createHideUnidentify(){

 

  docHideUnidentify.COMMON_MODULE.HIDE_UNIDENTIFY = {
    removeButtonsFromItemContext: (item:any,buttons:Array<any>)=>
    {
        docHideUnidentify.COMMON_MODULE.debug("removeButtonsFromItemContext called");
        if (game.user.isGM) {
          if(docHideUnidentify.COMMON_MODULE.debugMode)
          {
            docHideUnidentify.COMMON_MODULE.debug("is GM - not removing Identify button from Item Sheet context menu");
          }
          return;
        }
        const identified = item.system.identified ;
        if (identified){
          docHideUnidentify.COMMON_MODULE.debug("Item:",item.name," - Item is identified - not removing Identify button from Item Sheet context menu");
          return;
        } 
        
        const needRemoveButtons = ["DND5E.Identify","DND5E.ContextMenuActionAttune"];
        
        needRemoveButtons.forEach( buttonName => {
          const index = buttons.findIndex(option => option.name === buttonName);
          if(index !== -1){
            docHideUnidentify.COMMON_MODULE.debug("Item:",item.name," - Removing",buttonName,"button from Item Sheet context menu at index",index);
            buttons.splice(index, 1);
          }
        });
    },
    removeItemSheetIdentifyInformations: (sheet:any, option:any|undefined)=>{
        //console.log("renderItemSheet5e");
      
        if (game.user.isGM) 
        {
          if(docHideUnidentify.COMMON_MODULE.debugMode)
          {
            docHideUnidentify.COMMON_MODULE.debug("removing Info from Item Sheet");
          
          }
          return;
        }
      
      
        const identified = sheet.item.system.identified ;
        if (identified){
          return;
        } 

        docHideUnidentify.querySelectorAll(".dnd5e.sheet.item .sheet-header .item-subtitle label:has(input:not([disabled]))").forEach(n => n.remove());
        docHideUnidentify.querySelectorAll(".toggle-identified").forEach(n=>n.remove()); 
        
  
  
    },
    removeCharacterSheetIdentifyInformation: (sheet:any|undefined)=>{
        //console.log("renderItemSheet5e");
      
        if (game.user.isGM) 
        {
          if(!docHideUnidentify.COMMON_MODULE.debugMode)
          {
            docHideUnidentify.COMMON_MODULE.debug("removing Info from Item Sheet");
            return;
          }
          docHideUnidentify.COMMON_MODULE.debug("is GM in debug mode - removing information from Item Sheet");
        } 
/*
        //remover o attune por linha?
        docHideUnidentify.COMMON_MODULE.HIDE_UNIDENTIFY.sheetTime = setInterval(()=>{
          
            docHideUnidentify.COMMON_MODULE.debug("sheet opened - removing identify information from Character Sheet");
            const allItens = docHideUnidentify.querySelectorAll(".item-list .item-row");
            
        },250); */
    },
    };


    Hooks.on("renderItemSheet5e", (sheet:any|undefined, options:any|undefined) => {
      docHideUnidentify.COMMON_MODULE.debug("dnd5e.renderItemSheet5e called");
      docHideUnidentify.COMMON_MODULE.HIDE_UNIDENTIFY.removeItemSheetIdentifyInformations(sheet,options);
    });

    /*
     //remover o attune por linha?
    Hooks.on("closeCharacterActorSheet", (sheet) => {
      docHideUnidentify.COMMON_MODULE.debug("dnd5e.closeCharacterActorSheet called"); 
      clearInterval(docHideUnidentify.COMMON_MODULE.HIDE_UNIDENTIFY.sheetTime);
      docHideUnidentify.COMMON_MODULE.debug("timer desligado"); 
      docHideUnidentify.COMMON_MODULE.HIDE_UNIDENTIFY.sheetTime = null;
    });

    Hooks.on("renderActorSheet5eCharacter", (sheet, [html]) => {
      docHideUnidentify.COMMON_MODULE.debug("dnd5e.renderActorSheet5eCharacter called"); 
    });


    */



    // Remove Identify button from Item Context menu on Actor Sheet
    Hooks.on("dnd5e.getItemContextOptions", (item, buttons) => {
        docHideUnidentify.COMMON_MODULE.debug("dnd5e.getItemContextOptions called");
        docHideUnidentify.COMMON_MODULE.HIDE_UNIDENTIFY.removeButtonsFromItemContext(item,buttons);
    });


    Hooks.on("renderDocumentSheetV2", (sheet) => { 
      docHideUnidentify.COMMON_MODULE.debug("renderDocumentSheetV2 called with parameters:",sheet);
      docHideUnidentify.COMMON_MODULE.HIDE_UNIDENTIFY.removeCharacterSheetIdentifyInformation(sheet);
    });


}
 

Hooks.on("onReadyCommonModule", ( ) => { 
  docHideUnidentify.COMMON_MODULE.debug("onReadyCommonModule called"); 
  createHideUnidentify();
});
 