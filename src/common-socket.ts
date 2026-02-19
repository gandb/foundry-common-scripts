

export interface Socket{
    isReady():boolean;
    executeToGM(eventName:string,...data:any):Promise<any>;
    executeAsGM(eventName:string,...data:any):Promise<any>;
    executeForAll(eventName:string,...data:any):Promise<any>;
    register(eventName:string,callback:any):Promise<void>;
    isReadyToSendToGM(): boolean;
}
 