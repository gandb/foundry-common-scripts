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

# Sprint 4 - Screen to give XP by place
- Right a  spec about a new button. This button need be like flight-movement, open a Window  like a profissional screen game design, dnd rpg thematic. Below the main fields:
- Selector if is a Main Quest, Side Quest or Personal Quest
- Create a list of all PCs where the owner isnt the GM , each PC with a checkbox to allow select one by one - default is selected
- With a very cool style, put the maximum levels betwween selected characters in the right corner of screen. Eg if four  characrters level 3.4.6 and 6 level, so need show 6. This is the reference level or maximum level
- The calculated XP Gain is showed bellow in character selectors, big and cetered
- a button to cancel or aprove in the button of screen.
- The selected characters need gain the xp using the follow formule: Get the next maximum level (reference level +1) and search in table ./src/data/xp-progression.json the XP for the next level. 
  - Each selected char will gain :
    - 15% of this XP if is Main Quest selected
    - 10% of this XP if is Main Side Quest selected
    - 5% of this XP if is Personal Quest selected
  - Complete example scenary : Three characters, Raistlin, Conam and Rusty, levels 4,4 and 5 respectively. The maximum Level is 5 and next is 6, Cross from 5 to level 6 need 7500 xp. So the master open the screen, select Side Quest (10%) , only characters Raistin and Rusty, the maximul level is showed is 5 and XP 750 (10% ofm 7500) , after press button Rusty and Raistlung get 750 XP each and screen close and a blue info message show saying the xp was give with success.  
  


# Sprint 5 - Fix Socket Lib . PS: common-module.ts register the socket :
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

#  Sprint 6 - NPCDialog Improovements:
  - Switch configuration of which implementation to use depending on a setting. Change in messaging factory.
  - Fix createDialog to use options instead of depending on parameter order, create an interface for options and document the fields.
  - The last "back" should reopen the NPC choice screen, if this can be handled in base classes rather than by consumers of npcdialog.
  - Fix bug where opening two different NPC screens causes the first one to behave as the second — some global variable is being polluted, and the title must show the NPC name in question to help avoid confusion.
  - Verify that in project ../../../../forgotten-realms/scripts/ for NPCs where it says "action", "screen", "screen-context", create an enum in this project and document this, so projects using it make use of the enum instead of a string, to avoid typos


#  Sprint 7 - Injectcontroller
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
