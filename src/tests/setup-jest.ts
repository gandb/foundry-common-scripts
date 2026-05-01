// Jest setup for DI audit tests
// This file populates the injectController container with mock objects
// that represent what the module would register at runtime in Foundry VTT

import { injectController } from "taulukko-commons";

// Register mock objects that represent what the module registers at runtime
// These match the registrations in module.ts and common-module.ts

const mockLogguer: any = {
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  level: jest.fn(),
};

const mockCommonModule: any = {
  name: "common-scripts-dnd5ed",
  version: "2.0.1",
  init: jest.fn(),
};

const mockGame: any = {
  users: new Map(),
  user: { id: "gm1", isGM: true },
  modules: new Map([["common-scripts-dnd5ed", { active: true }]]),
  messages: {
    create: jest.fn().mockResolvedValue({}),
  },
};

const mockFoundryAPI: any = {
  hooks: {
    on: jest.fn(),
    once: jest.fn(),
    callAll: jest.fn(),
  },
  createChatMessage: jest.fn().mockResolvedValue({}),
};

const mockSocket: any = {
  executeForAll: jest.fn(),
  executeAsGM: jest.fn(),
  executeToGM: jest.fn(),
};

const mockReturnsControl: any = {
  add: jest.fn(),
  get: jest.fn(),
  has: jest.fn(() => false),
  delete: jest.fn(),
};

// Register all objects that should be available in the container
// Note: document only exists in browser environments, not in Node.js
if (typeof document !== "undefined") {
  injectController.registerByName("FoundryDocument", document);
}
injectController.registerByName("CommonModule", mockCommonModule);
injectController.registerByName("CommonLogguer", mockLogguer);
injectController.registerByName("GameContext", mockGame);
injectController.registerByName("FoundryAPI", mockFoundryAPI);
injectController.registerByName("Socket", mockSocket);
injectController.registerByName("ReturnsControl", mockReturnsControl);

// Note: IGameContext and IFoundryAPI are interfaces, not registered
// They are used as type annotations, not runtime values
