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
    create( chatInfo: any,options:any|undefined=undefined);
    getSpeaker( speakerInfo:SpeakerInfo):any;
};

declare const game:Game = new Game();

declare const ui:any|Ui = new Ui();

declare const AudioHelper:{
    preloadSound(path:string):Promise<void>;
    play(playInfo:PlayInfo,autoplay:boolean):void;
};

private class Game{
    users:Array<User>;
    user:User;
    modules:Map<string,Module>;
    journal:Journal;
    settings:Settings;
    scenes:SceneList
    keybindings:RegisterKeyBinding;
    actors:Array<Actor>;
}

declare class RegisterKeyBinding implements Register{
    public register(key:string,value:any,options:any);

}

private interface Register
{
    public register(key:string,value:any,options:any);
}

private class Ui{
}

private class SceneList extends Array{
    current
}

private class Journal{
    getName(value:string):Journal;
    sheet:Sheet;
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

declare  class Sheet{
    actor:Actor;
    render(value:boolean);
}

   
declare  class Actor{
    type:string;
    img:string;
    prototypeToken:PrototypeToken;
    update(actor:any);
    name:string;
}

declare class PrototypeToken{
    texture?:Texture;
    name:string;
}
   

declare  class Texture{
    src:string; 
}

declare  class User{
    id:string;
    isGM:boolean;
}
 

declare class RegionUtils{}
   
 
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

declare class Module{
    name:string;
    active:?boolean;
}
  
 
private class Screen{
    public name:string;
    public type:string;
    public callback:any;
}
 
  