# TASKS

Project task list. When the user requests "Do TASK X", the SCRUM_MASTER delivers the task one at a time following the agent flow.

# Pending and Completed Tasks
The task pattern is:
- ✅ Done task
- Next task, only finish when all child tasks ends
  - Child task
- Other task   

# Sprint 1  - Convert to English:
- ✅ Convert all md files to English
   - ✅ **Description:** Translate all 9 .md files from Portuguese to English, rename directories (relatorios → reports) and files (diario-de-bordo.md → journal-log.md), adjust internal links.
   - ✅ **Result:** All 9 files translated in-place. Directories renamed at both levels. Old paths updated in diary logs. ORACULO → ORACLE, USUÁRIO → USER, COOPERADOR → COORDINATOR terminology updated throughout AGENTS.md.
-  ✅ Convert the file ./temp/input.js to ./temp/output.js, turn more legeable, broke in multi linees, ident etc.

# Sprint 2 - Turn project more resilitent:
  - ✅ Audit all usages of `injectController.resolve` to use `injectController.has` before when unsure if the object is registered
    - ✅ **Description:** injectController throws an error on resolve() if the object doesn't exist. Should audit all usages of injectController.resolve in the project and add verification with injectController.has() before when there's no certainty the object is in the container. Follow the pattern already used in npc-dialog.ts and flight-movement.ts.


# Sprint 3 - bugs
- ✅ Fix lazy and force cpu, why? cooler turn on, why?
- ✅ an error in /media/gandb/extensao001/Programs/Instalados/Foundry/Data/modules/common-scripts-dnd5ed/scripts/src/common-module.ts "Fix CS [ERROR] 20260721213052 Menu privacy não encontrado"    

# Sprint 4 - Fix Socket Lib . PS: common-module.ts register the socket :
  - Test if messages only for players in socketlib works, manual test done by user
  - Test if a player calculating something in everyone in socketlib works, manual test done by user
  - Test if a player calculating something in gm in socketlib works, manual test done by user
  - Test for only one player in socketlib works, manual test done by user
  - Test for response coming from only one player in execin even when multiple are sent in socketlib works, manual test done by user 
  - Test non-existent event, error if not in socketlib works, manual test done by user 
  - Test eventPlayer always sends to gm even if filtered, test in chat implementation works, manual test done by user  
  - Test player always sends to gm even if filtered, test in socketlib implementation
    - Replace in npcTalkDialog.ts to use the new socket implementation using the initial chat interface
    - Replace in npcTalkDialog.ts to use the new socketlib interface implementation

#  Sprint 5 - NPCDialog Improovements:
  - Switch configuration of which implementation to use depending on a setting. Change in messaging factory.
  - Fix createDialog to use options instead of depending on parameter order, create an interface for options and document the fields.
  - The last "back" should reopen the NPC choice screen, if this can be handled in base classes rather than by consumers of npcdialog.
  - Fix bug where opening two different NPC screens causes the first one to behave as the second — some global variable is being polluted, and the title must show the NPC name in question to help avoid confusion.
  - Verify that in project ../../../../forgotten-realms/scripts/ for NPCs where it says "action", "screen", "screen-context", create an enum in this project and document this, so projects using it make use of the enum instead of a string, to avoid typos


#  Sprint 6 - Injectcontroller
  - If use annotation, can be reduce the verborragy of use of injector? 


NEXT 2027:
- Create a new enter in game, directly in private mode to not shame myself
- create a "build name script/screen" using IA to create pre fixed database names
- - human
- - elfs
- - dwarfs
- - tavern
- - places
- - vilons
- - itens
- - - weapons
- - - armors
- - - any
