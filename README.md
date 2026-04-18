
# Specific for opencode: Before any action, read:
- `./docs/CONSTITUTION.md`
- `.opencode/USER.md`
- Everything below `.opencode/`
- Available skills at `.opencode/skills/` (loaded automatically on demand)

---

# taulukko-common-scripts-dnd5ed

Common Scripts for Foundry VTT D&D 5e - Modulo TypeScript com submodules, sockets e utilitarios para o Foundry VTT.

- **Versao:** 1.11.60
- **Autor:** Edson Vicente Carli Junior
- **Licenca:** MIT
- **Linguagem primaria:** TypeScript
- **Linguagem secundaria:** JavaScript (`*.mjs`) - apenas para scripts pre-build

---

## Stack e Versões

| Ferramenta | Versão |
|------------|--------|
| OpenCode | 1.4.3 |
| Node | v22.18.0 |
| npm | 10.9.3 |
| TypeScript | ^5.9.2 |

---

## Estrutura do Projeto

```
scripts/
├── build.mjs                        # Pre-build: auto-incrementa versao patch
├── config.json                      # Configuracao de logging (prefix, level)
├── package.json                     # Dependencias e scripts npm
├── tsconfig.json                    # Configuracao TypeScript (ES2022, strict)
├── vitest.config.ts                 # Configuracao de testes Vitest
├── vite.config.ts                   # Build Vite (IIFE, terser, dts)
├── styles/
│   └── module.css                   # Estilos do modulo (hero points, socket, NPC)
├── templates/
│   └── npc-talk.hbs                 # Template Handlebars do retrato NPC
├── types/
│   └── foundry-api.d.ts             # Tipagens minimas da API Foundry
├── dist/                            # Output do build (IIFE bundle)
└── src/
    ├── global.d.ts                  # Declaracoes globais do Foundry VTT
    ├── index.ts                     # Barrel exports (API publica da lib)
    ├── module.ts                    # Entry point IIFE (bootstrap runtime)
    ├── common-module.ts             # CommonModule - orquestrador principal
    ├── common/
    │   ├── index.ts                 # Barrel: CacheReturnControl, SubModuleBase, ModuleBase
    │   ├── module-base.ts           # Classe abstrata ModuleBase
    │   ├── cache-returns-control.ts # Cache generico K,V com capacidade
    │   └── script-helpers/
    │       └── url-fix.ts           # Utilitario para corrigir URLs de imagens NPC
    ├── submodules/
    │   ├── index.ts                 # Barrel: todos os submodules
    │   ├── sub-module-base.ts       # Classe abstrata SubModuleBase extends ModuleBase
    │   ├── npc/                     # Sistema de NPC (dialogo, retrato, botoes)
    │   ├── dialog-utils/            # Fabrica de dialogos Foundry
    │   ├── hero-points/             # Sistema de Hero Points (substitui Honor)
    │   ├── hide-unindentify/        # Esconde UI de identificacao de itens
    │   ├── flight-movement/         # Calculadora de movimento em voo (Pitagoras)
    │   ├── playertools/             # Ferramentas de jogador (placeholder)
    │   └── region-utils/            # Toggle de visibilidade de regioes
    └── sockets/
        ├── index.ts                 # Barrel: Socket, DummySocket, ChatSocket, SocketLib
        ├── common-socket.ts         # Interface Socket
        ├── common-socket-test.ts    # Harness de testes de socket
        └── implementations/
            ├── common-socket-dummy.ts       # DummySocket (no-op)
            ├── common-socket-chatmessage.ts # ChatSocket (via ChatMessage flags)
            └── common-socket-socketlib.ts   # SocketLib (via foundryvtt-socketlib)
```

---

## Build e Execucao

### Scripts npm

| Comando | Descricao |
|---------|-----------|
| `npm run build` | Executa `build.mjs` (incrementa versao) + `tsc` (compila TS) + `vite build` (bundle IIFE) |
| `npm run prepublishOnly` | Alias para `npm run build` |
| `npm test` | Executa testes unitarios via Jest (`npx jest`) |
| `npm run test:watch` | Executa testes em modo watch |
| `npm run test:coverage` | Executa testes com cobertura |
| `npm run vite-version` | Exibe versao do Vite |

### Processo de build

1. **`build.mjs`** (JavaScript pre-build) - Incrementa automaticamente a versao patch no `package.json`
2. **`tsc`** - Compila TypeScript para JavaScript
3. **`vite build`** - Empacota como IIFE com nome global `CommonScripts`, gera `.d.ts` via `vite-plugin-dts`, minifica com `terser`

### Output

- `dist/taulukko-common-scripts-dnd5ed.iife.js` - Bundle principal carregado pelo Foundry
- `dist/index.d.ts` - Tipagens para consumo como dependencia

---

## Dependencias

| Pacote | Versao | Descricao |
|--------|--------|-----------|
| `taulukko-commons` | ^1.3.0 | Biblioteca interna: `Log`, `LogGenericImpl`, `injectController`, `Level` |
| `typescript` | ^5.9.2 | Compilador TypeScript (dev) |
| `vite` | ^7.3.0 | Bundler (dev) |
| `vite-plugin-dts` | ^4.5.4 | Geracao de `.d.ts` (dev) |
| `terser` | ^5.46.1 | Minificador JS (dev) |
| `vitest` | ^4.1.4 | Framework de testes unitarios (dev) |

---

## Configuracao

### `config.json`

Configuracao de logging carregada em runtime pelo `CommonModule`:

```json
{
  "log": {
    "format": "",
    "prefix": "CS",
    "hasDate": true,
    "hasLevel": true,
    "level": "INFO"
  }
}
```

| Campo | Descricao | Valores |
|-------|-----------|---------|
| `log.format` | Formato customizado das mensagens | String |
| `log.prefix` | Prefixo das mensagens de log | String (ex: `"CS"`) |
| `log.hasDate` | Exibir data/hora no log | `true` / `false` |
| `log.hasLevel` | Exibir nivel no log | `true` / `false` |
| `log.level` | Nivel minimo de log | `"DEBUG"`, `"INFO"`, `"WARN"`, `"ERROR"` |

---

## Arquitetura

### Padroes principais

1. **Injecao de Dependencia** - Usa `injectController` do `taulukko-commons` para resolucao de singletons por nome ou classe
2. **Lifecycle por Hooks** - Todos os modulos seguem `initHooks()` -> `waitReady()` -> ready, encadeados via `Hooks` do Foundry
3. **Polling Async** - `whaitFor()` para espera de dependencias entre modulos (timeout de 5 min)
4. **Strategy Pattern (Sockets)** - Interface `Socket` com 3 implementacoes intercambiaveis
5. **Bundle IIFE** - Script unico carregado pelo Foundry, expoe `window.TaulukkoCommon` e `window.CommonScripts`

### Entry Points

#### `src/module.ts` - Bootstrap IIFE

Ponto de entrada principal do runtime:
- Cria instancia de `CommonModule`
- Registra globais em `window.TaulukkoCommon`: NPC, NPCDialog, DialogUtils, FlightMovement, ModuleBase, SubModuleBase, LogGenericImpl, injectController, Level
- Busca `config.json` para configuracao de log
- Registra singletons DI: `"FoundryDocument"`, `"CommonModule"`, `"CommonLogguer"`
- Chama `commonModule.init()`

#### `src/index.ts` - Barrel de exports

Exporta toda a API publica da biblioteca para consumo como dependencia npm.

#### `src/common-module.ts` - Orquestrador principal

- Nome do modulo: `"common-scripts-dnd5ed"`, versao: `"1.0.6"`
- `initHooks()`: Carrega todos os submodules, cria DummySocket, registra hooks `"init"` e `"ready"` do Foundry
- `waitReady()`: Aguarda hooks carregarem, dispara hook `"onReadyCommonModule"`
- Hook `"init"`: Registra settings
- Hook `"ready"`: Verifica GM, adiciona classe CSS `isGM`, trata migracao de versao, cria botao de ajuda "?" linkado ao journal "Como Rolar Dados"

---

## Common Layer (`src/common/`)

### `module-base.ts` - ModuleBase (abstrata)

Classe base para todos os modulos:
- `init()`: chama `initHooks()` e depois `waitReady()`, marca `#ready = true`
- `whaitFor(test, timeout, sleep)`: utilitario de espera async baseado em polling
- Metodos abstratos: `initHooks()`, `waitReady()`

### `cache-returns-control.ts` - CacheReturnControl<K, V>

Cache generico com capacidade configuravel (default 1000):
- Dual maps: `_cache` (index -> valor) e `_indexKey` (chave -> index)
- Evicao FIFO quando capacidade excedida
- Limpeza lazy quando index map excede 2x capacidade

### `script-helpers/url-fix.ts` - Utilitario de correcao de URLs

Script standalone (nao importado por padrao):
- Quando `FIX_NPCs = true`, atualiza em massa URLs de imagens de atores NPC para novo caminho base
- Preserva nomes de arquivo originais

---

## Submodules (`src/submodules/`)

### `sub-module-base.ts` - SubModuleBase (abstrata)

Estende `ModuleBase`, serve como marcador de tipo para submodules.

---

### NPC System (`npc/`)

Sistema completo de dialogo com NPCs.

#### `npc/button.ts` - Button

Classe para botoes de dialogo:
- Propriedades: `action`, `label`, `defaultValue`, `type` ("screen"/"action"/"screen-context"), `callback`

#### `npc/npc.ts` - NPC (abstrata)

Classe base para NPCs:
- Propriedades: `name`, `imageUrl`, `formatSound`, `groups` (Set), `screens` (Array)
- Metodos abstratos: `groupToLines`, `lines`
- `init()`: aguarda NPCDialog e DialogUtils via DI, empilha tela inicial
- `createDialog()`: cria dropdown com opcoes + botoes Send/Back/Cancel
- `speak(lineIndex)`: envia evento de retrato NPC via ChatMessage flags (`npc-talk`), toca audio de `modules/forgotten-realms/sounds/npcs/{name}/{index}/`
- `send()`: resolve combinacoes de grupos para selecionar linha aleatoria, chama `speak()`, navega telas
- `getCombinations()`: gera combinacoes de chaves de grupo (separadas por `;`)

#### `npc/npc-dialog.ts` - NPCDialog (SubModuleBase)

Gerencia UI de selecao de NPC e botoes de controle de cena:
- `initHooks()`: escuta `createChatMessage` (renderiza retrato NPC no flag `npc-talk`) e `getSceneControlButtons` (adiciona botao NPC para GM)
- `showNPCChooseDialog()`: cria dialogo com um botao por NPC registrado
- `callNPC(npc)`: define NPC selecionado e inicia sua tela

#### `npc/npc-portrait-dialog.ts` - NPCPortraitDialog (Application)

Aplicacao Foundry para overlay de retrato NPC em tela cheia:
- Template: `modules/common-scripts-dnd5ed/scripts/templates/npc-talk.hbs`
- `renderTalk(data)`: factory estatica para instanciar e renderizar
- `showToAllPlayers()`: renderiza localmente + emite socket para jogadores remotos

---

### Dialog Utils (`dialog-utils/dialog-utils.ts`) - DialogUtils (SubModuleBase)

Fabrica de dialogos Foundry:
- `createButton()`: factory para objetos `Button`
- `createDialog(title, style, content, buttons, submit, left, top, width, height)`: wrapper para `foundry.applications.api.DialogV2` com injecao de conteudo/estilo customizado

---

### Hero Points (`hero-points/hero-points.ts`) - HeroPoints (SubModuleBase)

Substitui o ability score "Honor" do D&D 5e por um sistema customizado de "Hero Points":
- `initializeHabilityHero()`: hook em `renderDocumentSheetV2`
- Para fichas de NPC: remove o div `hon` completamente
- Para fichas de personagem: substitui HTML com label "hero" customizado + operadores incremento/decremento
- `addEditButtonsToHeroPoints()`: botoes +/- somente para GM (+ adiciona 1, - divide por 2 e arredonda)
- `createDialog()`: clique no label "hero" exibe dialogo explicativo das regras de Hero Points

---

### Hide Unidentify (`hide-unindentify/hide-unidentify.ts`) - HideUnidentify (SubModuleBase)

Esconde UI de identificacao de itens para jogadores (nao-GM):
- `initHooks()`: hooks em `renderItemSheet5e` e `dnd5e.getItemContextOptions`
- `removeButtonsFromItemContext()`: remove opcoes "Identify" e "Attune" do menu de contexto para itens nao identificados
- `removeItemSheetIdentifyInformations()`: remove labels editaveis de subtitulo e elementos toggle-identified das fichas de item

---

### Players Tools (`playertools/players-tool.ts`) - PlayersTools (SubModuleBase)

Placeholder para ferramentas de jogador:
- `initializeFlyMeasure()`: registrado mas sem implementacao (apenas log)
- Aguarda CommonModule estar pronto antes de inicializar

---

### Region Utils (`region-utils/region-utils.ts`) - RegionUtils (SubModuleBase)

Toggle de visibilidade de regioes:
- `registerKeybindings()`: registra atalho `Shift+G` (somente GM) para alternar visibilidade
- `toggleVisibilityRegions()`: itera todas as regioes da cena atual e alterna `visibility`
- `stop(event)`: utilitario para encaixar token no centro de uma forma de regiao

---

### Flight Movement (`flight-movement/`) - FlightMovement (SubModuleBase)

Calculadora de movimento em voo baseada no Teorema de Pitagoras (D&D 5e).

Adiciona um botao em **Token Controls** visivel para **todos os jogadores** (nao requer GM). Ao clicar, abre um dialogo com 3 campos numericos:

- **Eixo X** - Movimento horizontal (feet)
- **Eixo Y** - Movimento vertical (feet)
- **Hipotenusa** - Movimento total em voo (feet)

O usuario preenche 2 dos 3 campos e clica "Calcular". O terceiro campo e calculado automaticamente via `a² + b² = c²`. Todos os valores devem ser >= 0.

#### Arquivos

| Arquivo | Descricao |
|---------|-----------|
| `flight-movement/flight-movement.ts` | Classe `FlightMovement` - hook `getSceneControlButtons`, botao e dialogo |
| `flight-movement/flight-movement-calc.ts` | Funcoes puras: `calcHypotenuse(x, y)` e `calcCathetus(hypotenuse, otherCathetus)` |
| `flight-movement/index.ts` | Barrel export |

#### Funcoes de calculo (`flight-movement-calc.ts`)

| Funcao | Parametros | Retorno |
|--------|-----------|---------|
| `calcHypotenuse(x, y)` | Catetos X e Y (>= 0) | Hipotenusa arredondada a 2 casas decimais |
| `calcCathetus(hypotenuse, otherCathetus)` | Hipotenusa e cateto conhecido (>= 0) | Cateto calculado arredondado a 2 casas decimais |

Valores negativos retornam 0. Hipotenusa menor que cateto retorna 0 (triangulo impossivel).

#### Testes

20 testes unitarios via Jest em `src/tests/submodules/flight-movement/flight-movement-calc.test.ts`:
- Triangulos pitagoricos classicos (3-4-5, 5-12-13)
- Valores zero
- Valores negativos
- Decimais e arredondamento
- Triangulo impossivel (hipotenusa < cateto)
- Valores tipicos de D&D 5e (30ft, 60ft)

### Testes de Socket

4 testes unitarios via Jest em `src/tests/sockets/implementations/common-socket-socketlib.test.ts`:
- executeForAll, executeAsGM (toGM flag), registro de callbacks

**Total: 24 testes** - Executar com `npm test`

---

## Sockets (`src/sockets/`)

### `common-socket.ts` - Interface Socket

Metodos: `isReady()`, `executeToGM()`, `executeAsGM()`, `executeForAll()`, `executeIn()`, `register()`, `isReadyToSendToGM()`

Constante: `CALLBACK_FUNCTION_EVENT_NAME = "onReadyCommonSocket"`

### Implementacoes

| Implementacao | Arquivo | Descricao |
|---------------|---------|-----------|
| **DummySocket** | `common-socket-dummy.ts` | No-op, usado em producao atualmente. Dispara hook `"onReadyCommonSocket"` |
| **ChatSocket** | `common-socket-chatmessage.ts` | Comunicacao via ChatMessage flags do Foundry. Suporta broadcast, GM-only, player-only, targeted. Request/response via `CacheReturnControl` |
| **SocketLib** | `common-socket-socketlib.ts` | Wrapper para modulo `foundryvtt-socketlib`. Espera hooks `"onReadyCommonModule"` e `"socketlib.ready"` |

### `common-socket-test.ts` - Test harness

Registra funcoes de teste (`showMessage`, `add`) e exercita `executeForAll`, `executeAsGM`, `executeToGM`, `executeIn`.

---

## Estilos (`styles/module.css`)

- Botao de ajuda de dados: `writing-mode: vertical-lr`
- `.socket-chat-event { display: none }` - esconde mensagens de socket no chat
- Estilizacao de Hero Points: `drop-shadow`, `text-transform: uppercase`, cursor pointer, botoes +/-
- Posicionamento de dialogos

---

## Templates (`templates/`)

### `npc-talk.hbs`

Template Handlebars para retrato de NPC: imagem + nome + texto de dialogo.

---

## Globais expostos

O bundle IIFE expoe dois globais no `window`:

### `window.TaulukkoCommon`

| Propriedade | Tipo |
|-------------|------|
| `NPC` | Classe abstrata NPC |
| `NPCDialog` | Instancia NPCDialog |
| `DialogUtils` | Instancia DialogUtils |
| `FlightMovement` | Instancia FlightMovement |
| `ModuleBase` | Classe abstrata ModuleBase |
| `SubModuleBase` | Classe abstrata SubModuleBase |
| `LogGenericImpl` | Implementacao de log (taulukko-commons) |
| `injectController` | Controller de injecao de dependencia |
| `Level` | Enum de niveis de log |

### `window.CommonScripts`

Todas as exports do barrel `src/index.ts`.

---

## Como Usar

### NPC System - Tutorial Completo

O sistema de NPCs permite criar personagens não-jogadores com dialogos contextuais. Cada NPC possui linhas de dialogo organizadas em grupos, e o sistema seleciona aleatoriamente uma linha baseada nos grupos ativos.

#### 1. Estrutura de Arquivos

Cada NPC deve ter pelo menos 2 arquivos:
- `{nome}.ts` - Classe do NPC extends NPC
- `{nome}-lines.ts` - Linhas de dialogo e mapeamento de grupos

#### 2. Definindo Linhas de Dialogo

No arquivo `{nome}-lines.ts`:

```typescript
// Linhas de dialogo indexadas por ID
export const npcLines: any = {
  1: "Primeira linha de dialogo",
  2: "Segunda linha de dialogo",
  3: "Terceira linha de dialogo",
  // ... mais linhas
};

// Mapeamento de grupos para linhas (separadas por ponto-e-virgula)
export const npcGroupToLines: Map<string, string> = new Map([
  ["1", "1"],                    // Grupo 1 usa linha 1
  ["2", "2;3;4"],                // Grupo 2 usa linhas 2, 3 ou 4
  ["1;2", "5;6"],                // Grupos 1 E 2 juntos usam linhas 5 ou 6
  ["999", "100;101;102"],        // Grupo especial para aleatorio
]);

// Constantes dos grupos
export const npcGroups = {
  GRUPO_1: "1",
  GRUPO_2: "2",
  GRUPO_COMBATE: "3",
  GRUPO_EXPLORACAO: "4",
  RANDOM: "999"                  // Obrigatorio para respostas aleatorias
} as const;
```

#### 3. Criando a Classe NPC

```typescript
import { joaoLines, joaoGroupToLines, joaoGroups } from "./joao-lines";
import { DialogUtils, NPC, NPCDialog } from "taulukko-common-scripts-dnd5ed";
import { injectController, Log } from "taulukko-commons";

export class JoaoNinguem extends NPC {
  // Opcional: CSS customizado para os dialogos
  readonly DEFAULT_STYLE: string = `
    <style>
      .select-action { padding: 20px; background: #222; color: #eee; }
      .select-action button { margin: 5px; padding: 5px 10px; }
    </style>
  `;

  // Mapeamentos obrigatorios
  groupToLines: Map<string, string> = joaoGroupToLines;
  lines: any = joaoLines;

  constructor() {
    // super(nome, imagemURL, formatoAudio)
    // Formato padrao: "ogg". Para usar MP3, passe "mp3" como terceiro parametro
    super("JoaoNinguem", "modules/meu-modulo/images/npcs/joao.webp", "mp3");
  }

  // Inicializacao - registra o NPC no sistema
  public async init() {
    const npcDialog = injectController.resolve<NPCDialog>("NPCDialog");
    npcDialog.npcSelected = this;

    if (!npcDialog.npcs) {
      npcDialog.npcs = new Map();
    }

    // Registrar com chave unica
    npcDialog.npcs.set("joao", this);
  }

  // Tela inicial - menu principal de acoes
  public async startScreen() {
    const npcDialog = injectController.resolve<NPCDialog>("NPCDialog");
    const dialogUtils: DialogUtils = injectController.resolve("DialogUtils");

    // Adicionar tela inicial para navegacao
    npcDialog.npcSelected.screens.push({ 
      name: "start-screen", 
      callback: npcDialog.npcSelected.startScreen, 
      type: "screen" 
    });

    const title = "Joao Ninguem: Escolha o que fazer";
    const content = `<div class="select-action"><H1>Escolha uma ação:</H1>`;

    // Criar botoes de acao
    const buttons = [
      // O TIPO DO BOTAO Define o comportamento, NAO a funcao callback:
      // - "screen": abre nova tela, NAO adiciona grupo ao enviar
      // - "action": executa e sai, adiciona grupo ao enviar
      // - "screen-context": abre nova tela E adiciona grupo ao enviar
      
      // Este botao e do tipo "screen-context" - leva pra nova tela E combina grupos
      dialogUtils.createButton(
        "joao-encontrando-alguem", 
        "Encontrando Alguém", 
        true, 
        "screen-context",    // <-- O TIPO DEFINE O COMPORTAMENTO
        async () => npcDialog.npcSelected.findSomeone()  // Callback apenas executado apos enviar
      ),

      // Este botao e do tipo "action" - executa e sai imediatamente
      dialogUtils.createButton(
        "joao-sobrecarga-peso", 
        "Sobrecarga de peso", 
        true, 
        "action",            // <-- O TIPO DEFINE O COMPORTAMENTO
        async () => npcDialog.npcSelected.overWeight()  // Callback executado apos enviar
      ),
    ];

    // Criar dialogo com dropdown de navegacao + botoes
    npcDialog.npcSelected.createDialog(title, content, buttons);
  }

  // Funcao chamada quando o botao "Encontrando Alguem" (screen-context) e selecionado
  // Note: a logica de grupo ja foi adicionada pelo tipo do botao ANTES de chamar esta funcao
  public async findSomeone() {
    const npcDialog = injectController.resolve<NPCDialog>("NPCDialog");
    const dialogUtils: DialogUtils = injectController.resolve("DialogUtils");

    const title = "Joao Ninguem: Encontrando alguém";
    const content = `<div class="select-action"><H1>Escolha uma ação:</H1>`;

    const buttons = [
      dialogUtils.createButton(
        "joao-vendo-alguem-conhecido",
        "Vendo alguém conhecido",
        true,
        "action",    // Agora usa action - executa e sai
        async () => npcDialog.npcSelected.seeingSomeoneFamiliar()
      ),
    ];

    npcDialog.npcSelected.createDialog(title, content, buttons);
  }

  // Funcao chamada quando o botao "Sobrecarga de peso" (action) e selecionado
  // O grupo ja foi adicionado pelo tipo do botao
  public async overWeight() {
    const npcDialog = injectController.resolve<NPCDialog>("NPCDialog");
    // O grupo joaoGroups.OVERWEIGHT ja foi adicionado pelo botao do tipo "action"
    // Apenas chama send() para selecionar e reproduzir a linha
    await npcDialog.npcSelected.send();
  }

  // Funcao chamada quando botao de action e pressionado na tela de findSomeone
  public async seeingSomeoneFamiliar() {
    const npcDialog = injectController.resolve<NPCDialog>("NPCDialog");
    // O grupo ja foi adicionado pelo tipo do botao
    await npcDialog.npcSelected.send();
  }
}
```

#### 4. Tipos de Botoes (IMPORTANTE: o comportamento e definido no tipo, nao na funcao)

| Tipo | Quando usar | O que acontece |
|------|-------------|----------------|
| `"screen"` | Para navegar entre telas sem mudar o contexto de dialogo | Abre nova tela, **nao adiciona** grupo ao enviar |
| `"action"` | Para executar uma acao e sair do dialogo | Executa callback, **adiciona** grupo, chama send() automaticamente |
| `"screen-context"` | Para criar submenus que combinam com o contexto atual | Abre nova tela, **adiciona** grupo ao enviar |

**A diferenca principais:**
- `action` = executa E sai do dialogo (adiciona grupo)
- `screen` ou `screen-context` = abre nova tela dentro do dialogo (apenas screen-context adiciona grupo)

#### Menu de Escolha (Dropdown)

O `createDialog()` automaticamente cria um **dropdown SELECT** com:
- Uma opção "Aleatório dado o contexto até aqui" (selecionada por padrão)
- Uma opção para cada botão criado

Quando o usuário clica em **"Enviar"**, o sistema executa a opção selecionada no dropdown, não o botão diretamente. Isso permite:
1. Usar os botões apenas como menu visual
2. Escolher a ação específica no dropdown antes de enviar
3. Escolher "Aleatório" para selecionar uma linha aleatória baseada nos grupos ativos

#### 5. Sistema de Grupos e Combinacoes

O sistema permite combinar multiplos grupos para gerar dialogos contextuais:

```typescript
// Adicionar multiplos grupos
npcDialog.npcSelected.groups.add(joaoGroups.ENTER_IN_BATTLE);  // "2"
npcDialog.npcSelected.groups.add(joaoGroups.GETTING_HURT);     // "3"

// O sistema procurar chaves:
// "2;3" (combinação exata)
// "2" e "3" (individuais)
```

#### 6. Áudio

**Formato Padrão:** OGF (ogg)

**Construtor do NPC:**
```typescript
// Formato padrao (ogg) - nao precisa passar o terceiro parametro
super("NomeNPC", "caminho/imagem.webp");

// Formato diferente (mp3) - passe o formato como terceiro parametro
super("NomeNPC", "caminho/imagem.webp", "mp3");
```

**Estrutura de arquivos de áudio:**
```
modules/{modulo}/sounds/npcs/{nomeNPC}/{indice}/{nomeNPC}{indice}.{formato}
```

Exemplo (formato padrão ogg):
```
modules/forgotten-realms/sounds/npcs/joao/001/joao001.ogg
```

Exemplo (formato mp3):
```
modules/meu-modulo/sounds/npcs/joao/001/joao001.mp3
```

**Observação:** O índice deve ser padding com 3 dígitos (001, 002, etc.)

#### 7. Registration no Module

No arquivo `module.ts` do seu modulo:

```typescript
// Importar seu NPC
import { JoaoNinguem } from "./src/joao";

// Criar instancia e inicializar
const joao = new JoaoNinguem();
await joao.init();
```

#### Exemplo Completo: Callback Dinamico

Quando voce precisa passar um grupo dinamico para o callback (em vez de usar o tipo do botao):

```typescript
// Funcao que cria um callback que adiciona grupo e envia
public createcallbackSend(group: number) {
  return async () => {
    const npcDialog = injectController.resolve<NPCDialog>("NPCDialog");
    npcDialog.npcSelected.groups.add(group);
    return npcDialog.npcSelected.send();
  };
}

// Uso com botao action
const callback: any = npcDialog.npcSelected.createcallbackSend;

const buttons = [
  dialogUtils.createButton("joao-exhausted", "Exaustão / Sono", true, "action", callback(joaoGroups.EXHAUSTED_AND_SLEEPY)),
  dialogUtils.createButton("joao-weight", "Sobrecarga de Peso", true, "action", callback(joaoGroups.EXCESS_WEIGHT)),
];
```

---

### Dialog Utils

#### Criando Botoes

```typescript
const dialogUtils: DialogUtils = injectController.resolve("DialogUtils");

const button = dialogUtils.createButton(
  "action-id",      // Identificador unico
  "Label do Botao",  // Texto exibido
  true,              // É default?
  "action",         // Tipo: "screen", "action", "screen-context"
  async () => {     // Callback
    console.log("Botao clicado!");
  }
);
```

#### Criando Dialogos

```typescript
dialogUtils.createDialog(
  "Titulo do Dialogo",
  "DEFAULT_STYLE ou CSS customizado",
  "Conteudo HTML",
  [botao1, botao2],
  submit,           // Funcao de submit (opcional)
  200,              // Posicao X (opcional)
  undefined,        // Posicao Y (opcional)
  400               // Largura (opcional)
);
```

---

## Skills do OpenCode

Skills sao instrucoes reutilizaveis que o OpenCode carrega sob demanda para executar tarefas especificas do projeto. Ficam em `.opencode/skills/<nome>/SKILL.md`.

**Como usar:** O OpenCode detecta as skills automaticamente. Ele pode carrega-las quando necessario ou voce pode pedir explicitamente (ex: "use a skill readme-sync-enforcer").

### readme-sync-enforcer

Verifica se todos os scripts `.ts` e `.mjs` e configuracoes do projeto estao documentados neste README e se a documentacao reflete o comportamento atual do codigo.

**Quando usar:** Apos criar ou modificar scripts, na etapa CODE_REVIEWER ou DOCUMENTATION_WRITER do fluxo de agentes.
