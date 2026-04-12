---
name: socket-strategy-validator
description: Valida que as 3 implementacoes de socket (Dummy, Chat, SocketLib) estao consistentes entre si e que toda mensagem esta implementada nas 3 estrategias
---

## O que esta skill faz

Verifica a consistencia entre as 3 implementacoes do Strategy Pattern de socket do projeto:
- `DummySocket` (`src/sockets/implementations/common-socket-dummy.ts`) - implementacao atual em producao
- `ChatSocket` (`src/sockets/implementations/common-socket-chatmessage.ts`) - via ChatMessage do Foundry
- `SocketLibSocket` (`src/sockets/implementations/common-socket-socketlib.ts`) - via foundryvtt-socketlib

Todas devem implementar a interface `Socket` definida em `src/sockets/common-socket.ts`.

## Interface de referencia

```typescript
// src/sockets/common-socket.ts
export interface Socket {
    isReady(): boolean;
    executeToGM(eventName: string, ...data: any): Promise<any>;
    executeAsGM(eventName: string, ...data: any): Promise<any>;
    executeForAll(eventName: string, ...data: any): Promise<any>;
    executeIn(eventName: string, users: Array<string>, ...data: any): Promise<any>;
    register(eventName: string, callback: any): Promise<void>;
    isReadyToSendToGM(): boolean;
}
```

## Procedimento

### 1. Verificar interface Socket

Ler `src/sockets/common-socket.ts` e listar todos os metodos da interface:
- Nome do metodo
- Parametros (tipos)
- Retorno

### 2. Verificar cada implementacao

Para cada arquivo em `src/sockets/implementations/`:

**a) Verificar que implementa `Socket`:**
- Classe deve ter `implements Socket` (ou equivalente)
- Todos os metodos da interface devem estar presentes

**b) Verificar assinaturas:**
- Parametros devem ter os mesmos tipos da interface
- Retorno deve ser compativel

**c) Verificar comportamento minimo:**
- `isReady()` deve retornar `boolean`
- `executeToGM` / `executeAsGM` / `executeForAll` / `executeIn` devem retornar `Promise`
- `register` deve aceitar callback

### 3. Cruzar metodos entre implementacoes

Construir tabela de compatibilidade:

```
Metodo              | DummySocket | ChatSocket | SocketLibSocket
--------------------|-------------|------------|----------------
isReady()           | OK          | OK         | OK
executeToGM()       | OK          | OK         | FALTANDO
executeAsGM()       | OK          | OK         | OK
executeForAll()     | OK          | FALTANDO   | OK
executeIn()         | OK          | OK         | OK
register()          | OK          | OK         | OK
isReadyToSendToGM() | OK          | OK         | OK
```

### 4. Verificar registro no DI container

Em `src/common-module.ts`, verificar:
- Qual implementacao esta registrada como `"Socket"` no `injectController`
- Se ha mecanismo para trocar a estrategia (configuracao, flag, etc.)

### 5. Verificar testes de socket

Ler `src/sockets/common-socket-test.ts` e verificar:
- Se testa todas as 3 implementacoes
- Se testa todos os metodos da interface
- Se ha mock adequado para Foundry globals

## Formato de saida

```
=== VALIDACAO SOCKET STRATEGY ===

--- Interface Socket ---
Metodos definidos: 7
Constante CALLBACK_FUNCTION_EVENT_NAME: definida

--- DummySocket ---
[OK]    Implementa interface Socket
[OK]    Todos os 7 metodos presentes
[OK]    Assinaturas compativeis

--- ChatSocket ---
[OK]    Implementa interface Socket
[ERRO]  Metodo executeForAll() nao implementado
[WARN]  Metodo register() tem parametro extra nao previsto na interface

--- SocketLibSocket ---
[OK]    Implementa interface Socket
[ERRO]  Metodo executeToGM() faltando
[OK]    Demais metodos presentes

--- Registro DI ---
[OK]    DummySocket registrado como "Socket" em CommonModule.loadSubModules()
[WARN]  Nao ha mecanismo de troca de estrategia via configuracao

--- Testes ---
[WARN]  common-socket-test.ts encontrado mas pode estar desatualizado
```

### 6. Sugerir correcoes

Para cada `[ERRO]`:
- Gerar o metodo faltante com implementacao minima compativel
- Indicar o arquivo e local exato onde inserir

Para cada `[WARN]`:
- Explicar o risco e sugerir acao

## Quando usar esta skill

- Apos adicionar novo metodo na interface `Socket`
- Apos modificar qualquer implementacao de socket
- Ao trocar a estrategia de socket ativa
- Em revisoes de codigo que envolvam sockets
- Na etapa CODE_REVIEWER do fluxo de agentes
