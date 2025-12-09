 
commonModule.hideUnidentify = {
  removeButtonsFromItemContext: (item,buttons)=>
   {
      commonModule.debug("removeButtonsFromItemContext called");
       if (game.user.isGM) {
        if(!commonModule.debugMode)
        {
          commonModule.debug("is GM - not removing Identify button from Item Sheet context menu");
          return;
        }
        commonModule.debug("is GM in debug mode - removing Identify button from Item Sheet context menu");

      }
      const identified = item.system.identified ;
      if (identified){
        commonModule.debug("Item:",item.name," - Item is identified - not removing Identify button from Item Sheet context menu");
        return;
      } 
      
      const needRemoveButtons = ["DND5E.Identify","DND5E.ContextMenuActionAttune"];
      
      needRemoveButtons.forEach( buttonName => {
        const index = buttons.findIndex(option => option.name === buttonName);
        if(index !== -1){
          commonModule.debug("Item:",item.name," - Removing",buttonName,"button from Item Sheet context menu at index",index);
          buttons.splice(index, 1);
        }
      });
   },
   removeItemSheetIdentifyInformations: (sheet,[html])=>{
      //console.log("renderItemSheet5e");
    
      if (game.user.isGM) 
      {
        if(!commonModule.debugMode)
        {
          commonModule.debug("removing Info from Item Sheet");
          return;
        }
        commonModule.debug("is GM in debug mode - removing information from Item Sheet");
      }
    
    
      const identified = sheet.item.system.identified ;
      if (identified){
        return;
      } 

      document.querySelectorAll(".dnd5e.sheet.item .sheet-header .item-subtitle label:has(input:not([disabled]))").forEach(n => n.remove());
      document.querySelectorAll(".toggle-identified").forEach(n=>n.remove()); 
      
 
 
   },
   removeCharacterSheetIdentifyInformation: (sheet)=>{
      //console.log("renderItemSheet5e");
     
      if (game.user.isGM) 
      {
        if(!commonModule.debugMode)
        {
          commonModule.debug("removing Info from Item Sheet");
          return;
        }
        commonModule.debug("is GM in debug mode - removing information from Item Sheet");
      } 

      commonModule.hideUnidentify.sheetTime = setInterval(()=>{
        
          commonModule.debug("sheet opened - removing identify information from Character Sheet");
          const allItens = document.querySelectorAll(".item-list .item-row");
          
      },250); 
   },
  };


   
 
 //============HOOKS================== 
// for dnd5e version 3.3.0+
// Prevent Players from Identifying their items by hiding the buttons from them, only the GM will be able to Identify them
// Remove Identify button at top of Item Sheet
Hooks.on("renderItemSheet5e", (sheet, [html]) => {
  commonModule.debug("dnd5e.renderItemSheet5e called");
  commonModule.hideUnidentify.removeItemSheetIdentifyInformations(sheet, [html]);
});

Hooks.on("closeCharacterActorSheet", (sheet) => {
  commonModule.debug("dnd5e.closeCharacterActorSheet called"); 
  clearInterval(commonModule.hideUnidentify.sheetTime);
  commonModule.debug("timer desligado"); 
  commonModule.hideUnidentify.sheetTime = null;
});


Hooks.on("renderActorSheet5eCharacter", (sheet, [html]) => {
  commonModule.debug("dnd5e.renderActorSheet5eCharacter called"); 
});


// Remove Identify button from Item Context menu on Actor Sheet
Hooks.on("dnd5e.getItemContextOptions", (item, buttons) => {
     commonModule.debug("dnd5e.getItemContextOptions called");
     commonModule.hideUnidentify.removeButtonsFromItemContext(item,buttons);
});


Hooks.on("renderDocumentSheetV2", (sheet) => { 
  commonModule.debug("renderDocumentSheetV2 called with parameters:",sheet);
  commonModule.hideUnidentify.removeCharacterSheetIdentifyInformation(sheet);
});

/*
 
Hooks.on("init",   () => {
  console.log("init","ready teste");
  let item = game?.items?.find(item => item?.id == "Rj6fh9Sg59QTCHkm");
  console.log("x777","Item",item);
});
 
Hooks.on("ready",   () => {
  console.log("ready","ready teste");
  let item = game?.items?.find(item => item?.id == "Rj6fh9Sg59QTCHkm");
  console.log("ready","Item",item);
 });
 
 */
