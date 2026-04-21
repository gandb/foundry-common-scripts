export interface IGameSettings {
  register(
    module: string,
    key: string,
    config: { type: unknown },
  ): Promise<void>;
  set(module: string, key: string, value: unknown): Promise<void>;
  get(module: string, key: string): Promise<unknown>;
}

export interface IGameJournalSheet {
  render(show: boolean): void;
}

export interface IGameJournalEntry {
  sheet: IGameJournalSheet;
}

export interface IGameJournal {
  getName(name: string): IGameJournalEntry | null;
}

export interface IGameContext {
  name: string;
  user: { isGM: boolean; id: string } | null;
  users: any;
  scenes: any;
  actors: any;
  modules: { get(name: string): { active: boolean } | undefined };
  socket: any;
  settings: IGameSettings;
  journal: IGameJournal;
  keybindings: any;
}
