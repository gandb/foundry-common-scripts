# TASKS

Project task list. When the user requests "Do TASK X", the SCRUM_MASTER delivers the task one at a time following the agent flow.



## Pending and Completed Tasks
The task pattern is: 
- ✅ Improve isReadyToSendToGM() validation
    - **Description:** The isReadyToSendToGM() function currently returns (game.user as any) || (game.users as any) which always returns true if objects exist. Should be improved to check game.user?.isGM and ensure the current user is GM before allowing message sending as GM.
    - **Result:** Tested in `common-socket-chatmessage.test.ts` with GM and non-GM user cases. Validation implemented with `game.user?.isGM`.
- ✅ Fix all cases where the class tries to resolve itself via injectController, like in players-tools.ts at line 12 where PlayersTools tries to resolve itself. These cases must be treated as exceptions — since it's a singleton, there can be a global variable called className e.g., var playerTools: PlayerTools | undefined = undefined; and in the constructor, as soon as it enters the class, it should populate this variable for its own use. At the end of init, remove the waitFor in this case since it will always be ready — Note: only used in injectors that try to resolve their own class.
- ✅ Hide "NPC Portrait Event" message from Foundry chat (spec: docs/spec/npc-portrait-event-ocultar-spec.md):
- ✅ Fix bugs in src/submodules/npc/index.ts as there are currently some issues but I think they're few
- ✅ Convert all md files to English
    - ✅ **Description:** Translate all 9 .md files from Portuguese to English, rename directories (relatorios → reports) and files (diario-de-bordo.md → journal-log.md), adjust internal links.
    - ✅ **Result:** All 9 files translated in-place. Directories renamed at both levels. Old paths updated in diary logs. ORACULO → ORACLE, USUÁRIO → USER, COOPERADOR → COORDINATOR terminology updated throughout AGENTS.md.
- Fix typing to facilitate auto-complete:
 - **Description:** fix existing cases and document in PROJECT.md that when declaring ALL variables, use the pattern (<let|const|var> variableName:<expected type>=value; ). If you need to put any because the variable uses null, undefined or any other type, declare both types to allow autocomplete, e.g.: const age:number|any = (isNaN(getAge())?null|getAge();
- Test if messages only for players in socketlib works, manual test done by user
- Test if a player calculating something in everyone in socketlib works, manual test done by user
- Test if a player calculating something in gm in socketlib works, manual test done by user
- Test for only one player in socketlib works, manual test done by user
- Test for response coming from only one player in execin even when multiple are sent in socketlib works, manual test done by user 
- Test non-existent event, error if not in socketlib works, manual test done by user 
- Test eventPlayer always sends to gm even if filtered, test in chat implementation works, manual test done by user  
- Test player always sends to gm even if filtered, test in socketlib implementation
- Switch configuration of which implementation to use depending on a setting. Change in messaging factory.
- Fix createDialog to use options instead of depending on parameter order, create an interface for options and document the fields.
- The last "back" should reopen the NPC choice screen, if this can be handled in base classes rather than by consumers of npcdialog.
- Fix bug where opening two different NPC screens causes the first one to behave as the second — some global variable is being polluted, and the title must show the NPC name in question to help avoid confusion.
- Replace in npcTalkDialog.ts to use the new socket implementation using the initial chat interface
- Replace in npcTalkDialog.ts to use the new socketlib interface implementation  
- Verify that in project ../../../../forgotten-realms/scripts/ for NPCs where it says "action", "screen", "screen-context", create an enum in this project and document this, so projects using it make use of the enum instead of a string, to avoid typos
- Audit all usages of `injectController.resolve` to use `injectController.has` before when unsure if the object is registered
- **Description:** injectController throws an error on resolve() if the object doesn't exist. Should audit all 161 usages of injectController.resolve in the project and add verification with injectController.has() before when there's no certainty the object is in the container. Follow the pattern already used in npc-dialog.ts and flight-movement.ts.