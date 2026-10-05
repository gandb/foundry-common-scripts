import type { IFoundryAPI } from "./ifoundry-api";

/**
 * Concrete implementation of IFoundryAPI.
 * Abstraction over the Foundry VTT global API (Hooks, game, etc).
 *
 * **Registro DI:** `"FoundryAPI"` via `injectController.registerByName()`
 * **Dependency:** Requires `game` to be available (Foundry VTT runtime)
 *
 * @example
 * ```typescript
 * const foundryApi = injectController.resolve<IFoundryAPI>("FoundryAPI");
 * foundryApi.hooks.on("init", () => console.log("Init!"));
 * ```
 */
export class FoundryAPI implements IFoundryAPI {
  public hooks = {
    on: (event: string, callback: (...args: unknown[]) => void): void => {
      Hooks.on(event, callback);
    },
    once: (event: string, callback: (...args: unknown[]) => void): void => {
      Hooks.once(event, callback);
    },
    callAll: (event: string, data: unknown): void => {
      Hooks.callAll(event, data);
    },
  };

  /**
   * Creates a chat message on Foundry VTT.
   * @param payload - Message data (content, speaker, etc.)
   * @returns Promise with the created message
   */
  public async createChatMessage(payload: unknown): Promise<unknown> {
    return await (
      game as unknown as {
        messages: { create: (p: unknown) => Promise<unknown> };
      }
    ).messages.create(payload);
  }
}
