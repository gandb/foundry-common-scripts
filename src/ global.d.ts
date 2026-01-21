// Declara o valor global que o Foundry injeta em runtime
declare const Hooks: {
  on(event: string, callback: (...args: unknown[]) => void): number;
  once(event: string, callback: (...args: unknown[]) => void): number;
  off(event: string, callback: (...args: unknown[]) => void): number;
  call(event: string, ...args: unknown[]): unknown;
  callAll(event:string, ...args: unknown[]): unknown;
};
 
declare const CONFIG = {
    debug:{
        hooks:boolean
    }
};

namespace CONST{
    namespace KEYBINDING_PRECEDENCE{
        var NORMAL:any;
    }
};

namespace foundry {
    namespace applications {
      namespace api {
        class DialogV2 {
          constructor(options?: DialogV2Options);
          public render(options:any);
        
        }
        interface DialogV2Options {
          // tipos das opções
        }
      }
    }
  }

declare const ChatMessage:{
    create( chatInfo: ChatInfo,options:any|undefined=undefined);
    getSpeaker( speakerInfo:SpeakerInfo):any;
};

declare const game:any|Game = new Game();

declare const ui:any|Ui = new Ui();

declare const AudioHelper:{
    preloadSound(path:string):Promise<void>;
    play(playInfo:PlayInfo,autoplay:boolean):void;
};

private class Game{
}
private class Ui{
}

private class ChatInfo{
    content:string;
    speaker:Speaker;
};

private class SpeakerInfo{
    alias:string;
};

private class Speaker{
    
};

private  class PlayInfo{
    src:string;
    autoplay:boolean;
}

   
 
declare const AudioHelper:{
    preloadSound(path:string):Promise<void>;
    play(playInfo:PlayInfo,autoplay:boolean):void;
}; 

declare class FoundryDocument extends Document{
    COMMON_MODULE:CommonModule;
    private startHooks();

}

 
declare const socketlib;  

declare class NPCDialog {

    npcSelected:NPC|any;
    activeNPC:NPC|any;
    npcs:Map<string,NPC>=new Map();


    async addNPCButtons (controls:any) ;

    async showNPCChooseDialog ();

    async callMinsc (frmModule:Module);

    async callBrizola (frmModule:Module);
 

}  

declare const docs:any|FoundryDocument ;

declare class Module{}
  
 
private class Screen{
    public name:string;
    public type:string;
    public callback:any;
}
 
  