export interface IFoundryAPI {
  hooks: {
    on(event: string, callback: Function): void;
    once(event: string, callback: Function): void;
    callAll(event: string, data: any): void;
  };
  createChatMessage(payload: any): Promise<any>;
}
