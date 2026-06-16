# Changelog - common-scripts-dnd5ed

## [2.0.1] - 2026-05-28

### Fixed
- "NPC Portrait Event" messages hidden from Foundry VTT chat: `NPC.speak()` now uses `type: CONST.CHAT_MESSAGE_TYPES.OTHER` and `content: ""`, preventing rendering in the chat while keeping the `createChatMessage` hook functional for `NPCPortraitDialog` to open normally on all clients.

## [2.0.0] - 2026-04-13

### Compatibility
- Foundry VTT: v13
- System: D&D 5e
- Dependency: socketlib

### New
- Flight Movement Calculator — button in Token Controls that opens a form with 3 fields (X Axis, Y Axis, Hypotenuse) and calculates the third automatically via Pythagorean Theorem
- Client-to-client communication system via Socket with SocketLib support
- Hero Points management with increment/decrement buttons on character sheets
- Region utility for manipulating Foundry regions
- Standardized dialog system for Foundry interactions
- Interactive NPCs with speech and portrait system

### Changed
- Module configurations now come from centralized file instead of hardcoded values
- Log key separated to avoid mixing with other modules

### Fixed
- Fixed socket message sending between GM and players
- Fixed socket messages appearing unduly in game chat
- Fixed unidentified item identification (hideUnidentify)

### Removed
- Removed region toggle from main module (moved to dedicated submodule)
