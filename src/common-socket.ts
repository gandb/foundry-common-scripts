

export interface CommonSocketInterface{
    isReady():boolean;
    executeAsGM(eventName:string,...data:any):Promise<any>;
    executeForAll(eventName:string,...data:any):Promise<any>;
    register(eventName:string,callback:any):Promise<void>;
    isReadyToSendToGM(): boolean;
}

export  {commonSocket} from "./common-socket-socketlib";
