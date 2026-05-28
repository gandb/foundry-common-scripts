# Spec: Ocultar mensagem "NPC Portrait Event" do chat

## Objetivo

Impedir que a mensagem placeholder "NPC Portrait Event" apareça no chat do Foundry VTT quando um NPC fala, mantendo o funcionamento do barramento de eventos que sincroniza a janela `NPCPortraitDialog` entre todos os clientes.

## Arquivos

| Caminho | Ação |
|---------|------|
| `Data/modules/common-scripts-dnd5ed/scripts/src/submodules/npc/npc.ts` | Alterar `ChatMessage.create` |
| `Data/modules/common-scripts-dnd5ed/scripts/src/submodules/npc/npc-dialog.ts` | Verificar hook (sem alteração esperada) |
| `CHANGELOG.md` | Registrar correção |
| `log/journal-npc-portrait-chat-fix.md` | Diário de bordo da task |

## Funções

### `NPC.speak()` — `npc.ts:331`

**Alteração:** Substituir o objeto passado para `ChatMessage.create()` para usar `type: CONST.CHAT_MESSAGE_TYPES.OTHER` (constante `4`), que não renderiza a mensagem na lista de mensagens do chat, mas ainda dispara o hook `createChatMessage`.

**Antes:**
```ts
await ChatMessage.create({
  content: "NPC Portrait Event", // Invisível pra maioria
  whisper: Array.from(...).map(u => u.id),
  flags: { ... }
});
```

**Depois:**
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

### Mudanças na estrutura

1. `type: CONST.CHAT_MESSAGE_TYPES.OTHER` — mensagem do tipo "sistema/outro", não aparece no chat log renderizado.
2. `content: ""` — remove o placeholder textual (agora desnecessário).
3. Remove `whisper` — mensagens do tipo `OTHER` não usam lista de destinatários.

## Variáveis

Nenhuma nova variável. Remove-se `whisper` do objeto passado ao `ChatMessage.create()`.

## Testes esperados

1. Hook `createChatMessage` em `npc-dialog.ts` continua recebendo a mensagem e abrindo o `NPCPortraitDialog`.
2. Nenhuma mensagem "NPC Portrait Event" aparece no chat de nenhum usuário.
3. Janela overlay do NPC Portrait abre normalmente para GM e jogadores.
4. Som do NPC continua sendo executado.

## Atualização docs

- `CHANGELOG.md` — registro da correção.

## Escopo fechado

- Apenas o arquivo `npc.ts` será alterado.
- Nenhuma mudança em lógica de diálogo, hooks, sockets ou templates.
- Nenhuma mudança em outros módulos (forgotten-realms, common-assets, etc.).
- A alteração é, a princípio, apenas no ambiente de **dev**. Para validação em produção, deverá ser replicado em `deploy-client/dev/` e os bundles recompilados.

## Exceções de fluxo aprovadas

*Nenhuma até o momento.*
