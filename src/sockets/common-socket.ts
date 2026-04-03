
export const CALLBACK_FUNCTION_EVENT_NAME: string = "onReadyCommonSocket";
export interface Socket {


    isReady(): boolean;
    executeToGM(eventName: string, ...data: any): Promise<any>;
    executeAsGM(eventName: string, ...data: any): Promise<any>;
    executeForAll(eventName: string, ...data: any): Promise<any>;
    executeIn(eventName: string, users: Array<string>, ...data: any): Promise<any>;
    register(eventName: string, callback: any): Promise<void>;
    isReadyToSendToGM(): boolean;
}
