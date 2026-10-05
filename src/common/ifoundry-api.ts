/**
 * Interface for the Foundry VTT API abstraction.
 * Enables dependency injection and mocking in tests.
 */
export interface IFoundryAPI {
  /** Foundry Hooks manipulation methods */
  hooks: {
    /** Registra um callback para um evento de hook */
    on(event: string, callback: Function): void;
    /** Registra um callback que executa apenas uma vez */
    once(event: string, callback: Function): void;
    /** Dispara um hook para todos os listeners */
    callAll(event: string, data: any): void;
  };
  /** Creates a chat message on Foundry */
  createChatMessage(payload: any): Promise<any>;
}
