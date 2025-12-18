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


declare const ChatMessage:{
    create( chatInfo: ChatInfo);
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

// Declara o valor global que o Foundry injeta em runtime
declare const Hooks: {
  on(event: string, callback: (...args: unknown[]) => void): number;
  once(event: string, callback: (...args: unknown[]) => void): number;
  off(event: string, callback: (...args: unknown[]) => void): number;
  call(event: string, ...args: unknown[]): unknown;
};

declare const ChatMessage:{
    create( chatInfo: ChatInfo);
    getSpeaker( speakerInfo:SpeakerInfo):any;
};

declare const game:any|Game = new Game();



declare const ui:any|Ui = new Ui();

declare const AudioHelper:{
    preloadSound(path:string):Promise<void>;
    play(playInfo:PlayInfo,autoplay:boolean):void;
}; 

declare class FoundryDocument extends Document{
    COMMON_MODULE:CommonModule;

}


declare class NPCDialog {

    npcSelected:NPC|any;
    activeNPC:NPC|any;
    npcs:Map<string,NPC>=new Map();


    async addNPCButtons (controls:any) ;

    async showNPCChooseDialog ();

    async callMinsc (frmModule:Module);

    async warnAboutUpdate  (lastVersion:any);

}  



declare const docs:any|FoundryDocument ;

declare class Module{}
  
 
private class Screen{
    public name:string;
    public type:string;
    public callback:any;
}

private class DialogUtils{
    public helpSubmit:string;
    public createDialog(title:string,style:string,content:string,buttons:Array<any>, callback:any=undefined);
    public createButton (action:string,label:string,defaultValue:boolean,type:"screen"|"screen-context"|"action",callback:any=undefined);

}
 



private class Game{
}

p
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
