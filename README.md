
# ⚠️ Específico para o opencode : Antes de qualquer ação, leia:
- `.opencode/CONSTITUTION.md`
- `.opencode/USER.md`
- e depois tudo que estiver abaixo de .config/.opencode
- Skills disponíveis em `.opencode/skills/` (carregadas automaticamente sob demanda)


## Skills do OpenCode

Skills sao instrucoes reutilizaveis que o OpenCode carrega sob demanda para executar tarefas especificas do projeto. Ficam em `.opencode/skills/<nome>/SKILL.md`.

**Como usar:** O OpenCode detecta as skills automaticamente. Ele pode carrega-las quando necessario ou voce pode pedir explicitamente (ex: "use a skill backup-integrity-checker").

### readme-sync-enforcer

Verifica se todos os scripts `.ts` e `.mjs` e configurações do projeto estao documentados neste README e se a documentacao reflete o comportamento atual do codigo.  

**Quando usar:** Apos criar ou modificar scripts, na etapa CODE_REVIEWER ou DOCUMENTATION_WRITER do fluxo de agentes.
 

