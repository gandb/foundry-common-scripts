export interface IGameContext {
  name: string;
  user: { isGM: boolean; id: string } | null;
  users: any;
  scenes: any;
  modules: any;
  socket: any;
  settings: any;
  journal: any;
  keybindings: any;
}
