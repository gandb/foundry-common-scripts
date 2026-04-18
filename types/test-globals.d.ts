// Global test types
/// <reference types="jest" />
/// <reference types="node" />

// Jest globals
declare var jest: jest.Jest;
declare var expect: jest.Expect;
declare var describe: jest.Describe;
declare var it: jest.It;
declare var test: jest.It;
declare var beforeAll: jest.Lifecycle;
declare var beforeEach: jest.Lifecycle;
declare var afterEach: jest.Lifecycle;
declare var afterAll: jest.Lifecycle;

// Node.js globals
declare var require: NodeRequire;
declare var module: NodeModule;
declare var global: NodeJS.Global;

// Foundry VTT globals (mocked in tests)
interface Game {
  users: Map<string, any>;
  user: any;
  modules: {
    get: (name: string) => any;
  };
}

interface SocketLibModule {
  registerModule: (name: string) => any;
}

interface Hooks {
  once: (event: string, callback: Function) => void;
  callAll: (event: string, data?: any) => void;
}

declare var game: Game;
declare var socketlib: SocketLibModule;
declare var Hooks: Hooks;
