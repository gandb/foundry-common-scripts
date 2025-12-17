


function createHideUnidentify(){

 

  document.COMMON_MODULE.HIDE_UNIDENTIFY = {
    removeButtonsFromItemContext: (item,buttons)=>
    {
        document.COMMON_MODULE.debug("removeButtonsFromItemContext called");
        if (game.user.isGM) {
          if(!document.COMMON_MODULE.debugMode)
          {
            document.COMMON_MODULE.debug("is GM - not removing Identify button from Item Sheet context menu");
            return;
          }
          document.COMMON_MODULE.debug("is GM in debug mode - removing Identify button from Item Sheet context menu");

        }
        const identified = item.system.identified ;
        if (identified){
          document.COMMON_MODULE.debug("Item:",item.name," - Item is identified - not removing Identify button from Item Sheet context menu");
          return;
        } 
        
        const needRemoveButtons = ["DND5E.Identify","DND5E.ContextMenuActionAttune"];
        
        needRemoveButtons.forEach( buttonName => {
          const index = buttons.findIndex(option => option.name === buttonName);
          if(index !== -1){
            document.COMMON_MODULE.debug("Item:",item.name," - Removing",buttonName,"button from Item Sheet context menu at index",index);
            buttons.splice(index, 1);
          }
        });
    },
    removeItemSheetIdentifyInformations: (sheet,[html])=>{
        //console.log("renderItemSheet5e");
      
        if (game.user.isGM) 
        {
          if(!document.COMMON_MODULE.debugMode)
          {
            document.COMMON_MODULE.debug("removing Info from Item Sheet");
            return;
          }
          document.COMMON_MODULE.debug("is GM in debug mode - removing information from Item Sheet");
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
          if(!document.COMMON_MODULE.debugMode)
          {
            document.COMMON_MODULE.debug("removing Info from Item Sheet");
            return;
          }
          document.COMMON_MODULE.debug("is GM in debug mode - removing information from Item Sheet");
        } 
/*
        //remover o attune por linha?
        document.COMMON_MODULE.HIDE_UNIDENTIFY.sheetTime = setInterval(()=>{
          
            document.COMMON_MODULE.debug("sheet opened - removing identify information from Character Sheet");
            const allItens = document.querySelectorAll(".item-list .item-row");
            
        },250); */
    },
    };


    Hooks.on("renderItemSheet5e", (sheet, [html]) => {
      document.COMMON_MODULE.debug("dnd5e.renderItemSheet5e called");
      document.COMMON_MODULE.HIDE_UNIDENTIFY.removeItemSheetIdentifyInformations(sheet, [html]);
    });

    /*
     //remover o attune por linha?
    Hooks.on("closeCharacterActorSheet", (sheet) => {
      document.COMMON_MODULE.debug("dnd5e.closeCharacterActorSheet called"); 
      clearInterval(document.COMMON_MODULE.HIDE_UNIDENTIFY.sheetTime);
      document.COMMON_MODULE.debug("timer desligado"); 
      document.COMMON_MODULE.HIDE_UNIDENTIFY.sheetTime = null;
    });

    Hooks.on("renderActorSheet5eCharacter", (sheet, [html]) => {
      document.COMMON_MODULE.debug("dnd5e.renderActorSheet5eCharacter called"); 
    });


    */



    // Remove Identify button from Item Context menu on Actor Sheet
    Hooks.on("dnd5e.getItemContextOptions", (item, buttons) => {
        document.COMMON_MODULE.debug("dnd5e.getItemContextOptions called");
        document.COMMON_MODULE.HIDE_UNIDENTIFY.removeButtonsFromItemContext(item,buttons);
    });


    Hooks.on("renderDocumentSheetV2", (sheet) => { 
      document.COMMON_MODULE.debug("renderDocumentSheetV2 called with parameters:",sheet);
      document.COMMON_MODULE.HIDE_UNIDENTIFY.removeCharacterSheetIdentifyInformation(sheet);
    });


}

console.log("teste 123");

Hooks.on("onReadyCommonModule", ( ) => { 
  document.COMMON_MODULE.debug("onReadyCommonModule called"); 
  createHideUnidentify();
});
 