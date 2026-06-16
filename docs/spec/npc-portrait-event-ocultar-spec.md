# Spec: Hide "NPC Portrait Event" message from chat

## Objective

Prevent the placeholder message "NPC Portrait Event" from appearing in Foundry VTT chat when an NPC speaks, while keeping the event bus functionality that synchronizes the `NPCPortraitDialog` window across all clients.

## Files

| Path | Action |
|---------|------|
| `Data/modules/common-scripts-dnd5ed/scripts/src/submodules/npc/npc.ts` | Modify `ChatMessage.create` |
| `Data/modules/common-scripts-dnd5ed/scripts/src/submodules/npc/npc-dialog.ts` | Verify hook (no change expected) |
| `CHANGELOG.md` | Register fix |
| `log/journal-npc-portrait-chat-fix.md` | Task journal entry |

## Functions

### `NPC.speak()` — `npc.ts:331`

**Change:** Replace the object passed to `ChatMessage.create()` to use `type: CONST.CHAT_MESSAGE_TYPES.OTHER` (constant `4`), which does not render the message in the chat message list but still triggers the `createChatMessage` hook.

**Before:**
```ts
await ChatMessage.create({
  content: "NPC Portrait Event", // Invisible to most
  whisper: Array.from(...).map(u => u.id),
  flags: { ... }
});
```

**After:**
```ts
await ChatMessage.create({
  type: CONST.CHAT_MESSAGE_TYPES.OTHER,
  content: "",
  flags: {
    "npc-talk": {
      type: "npcDialogOnTalk",
      payload: {
        imageUrl: npcDialog.npcSelected.imageUrl,
        npcName: npcDialog.npcSelected.name,
        dialogText: line,
      },
    },
  },
});
```

### Structure changes

1. `type: CONST.CHAT_MESSAGE_TYPES.OTHER` — "system/other" type message, does not appear in rendered chat log.
2. `content: ""` — removes the textual placeholder (now unnecessary).
3. Remove `whisper` — `OTHER` type messages don't use recipient lists.

## Variables

No new variables. Removes `whisper` from the object passed to `ChatMessage.create()`.

## Expected tests

1. Hook `createChatMessage` in `npc-dialog.ts` continues receiving the message and opening `NPCPortraitDialog`.
2. No "NPC Portrait Event" messages appear in any user's chat.
3. NPC Portrait overlay window opens normally for GM and players.
4. NPC sound continues to play.

## Docs update

- `CHANGELOG.md` — fix registration.

## Closed scope

- Only the `npc.ts` file will be modified.
- No changes to dialog logic, hooks, sockets or templates.
- No changes to other modules (forgotten-realms, common-assets, etc).
- The change is, at first, only in the **dev** environment. For production validation, it should be replicated in `deploy-client/dev/` and bundles recompiled.

## Approved flow exceptions

*None so far.*
