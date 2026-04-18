export interface IGameSettings {
  register(
    module: string,
    key: string,
    config: { type: unknown; default?: unknown },
  ): Promise<void>;
  set(module: string, key: string, value: unknown): Promise<void>;
  get(module: string, key: string): Promise<unknown>;
}

export interface IGameContext {
  name: string;
  user: { isGM: boolean; id: string } | null;
  users: any;
  scenes: any;
  modules: { get(name: string): { active: boolean } | undefined };
  socket: any;
  settings: IGameSettings;
  journal: { getName(name: string): unknown | null };
  keybindings: any;
}
