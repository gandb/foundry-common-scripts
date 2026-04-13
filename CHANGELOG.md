# Changelog - common-scripts-dnd5ed

## [2.0.0] - 2026-04-13

### Compatibilidade
- Foundry VTT: v13
- Sistema: D&D 5e
- Dependencia: socketlib

### Novo
- Adicionado submodule FlightMovement - Calculadora de Movimento em Voo com Teorema de Pitagoras
- Adicionado sistema de Socket com Strategy Pattern (Dummy, Chat, SocketLib) para comunicacao entre clientes
- Adicionado submodule HeroPoints para gerenciamento de pontos heroicos com botoes +/- na ficha
- Adicionado submodule RegionUtils para manipulacao de regioes do Foundry
- Adicionado submodule DialogUtils para criacao padronizada de dialogos DialogV2
- Adicionado submodule NPCDialog com sistema de falas para NPCs (Minsc, Brizola)
- Adicionado submodule NPCPortraitDialog para exibicao de retratos de NPCs
- Adicionado sistema de injecao de dependencia via taulukko-commons (injectController)
- Adicionado modelo de testes com Vitest

### Alterado
- Migrado projeto inteiro de JavaScript para TypeScript com Vite como bundler
- Refatorado NPC Dialog para usar injectController e classes base (SubModuleBase)
- Atualizada skill readme-sync-enforcer para TypeScript
- Externalizado socket para nao ficar diretamente ligado a implementacao
- Compatibilizacao entre modulos (common-assets, common-scripts-dnd5ed, forgotten-realms)
- Parametros agora vem do config.json em vez de valores hard-coded
- Mudada chave do log common para nao misturar com demais modulos
- Icone do botao de voo alterado de aviao (fa-plane) para pomba (fa-dove) por coerencia medieval

### Corrigido
- Corrigido botao Calcular do FlightMovement que fechava o dialog ao clicar (botao movido para HTML content)
- Corrigido bug de loop infinito esperando resposta no socket
- Corrigido erro que ocorria no HeroPoints quando a ficha nao tinha o atributo
- Corrigido socket lib sendAsGM
- Corrigido bug onde mensagens de socket via chat eram exibidas no jogo
- Corrigido bug de timeout no onReadyCommonSocket vs onReadyCommonModule
- Corrigido erro que so funcionava no modulo local
- Corrigido hideUnidentify script
- Corrigido discrepancia de parametros na hora do envio de socket
- Corrigido uso de slice substituido por shift para remocao de pilha

### Removido
- Removido toggle de regioes do module common (passado para RegionUtils)
- Removidos comentarios desnecessarios

### Documentacao
- Documentado local correto para testes (src/tests/)
- Criados 9 agentes do OpenCode para o projeto (TASK 1)
- Criadas 8 skills especializadas para o OpenCode
