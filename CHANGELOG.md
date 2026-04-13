# Changelog - common-scripts-dnd5ed

## [2.0.0] - 2026-04-13

### Compatibilidade
- Foundry VTT: v13
- Sistema: D&D 5e
- Dependencia: socketlib

### Novo
- Calculadora de Movimento em Voo - botao nos Token Controls que abre formulario com 3 campos (Eixo X, Eixo Y, Hipotenusa) e calcula o terceiro automaticamente pelo Teorema de Pitagoras
- Sistema de comunicacao entre clientes via Socket com suporte a SocketLib
- Gerenciamento de Hero Points com botoes de incremento/decremento na ficha do personagem
- Utilitario de regioes para manipulacao de regioes do Foundry
- Sistema de dialogos padronizado para interacoes no Foundry
- NPCs interativos com sistema de falas e retratos

### Alterado
- Configuracoes do modulo agora vem de arquivo centralizado em vez de valores fixos
- Chave de log separada para nao misturar com demais modulos

### Corrigido
- Corrigido envio de mensagens via socket entre GM e jogadores
- Corrigido mensagens de socket que apareciam indevidamente no chat do jogo
- Corrigido identificacao de itens nao reconhecidos (hideUnidentify)

### Removido
- Removido toggle de regioes do modulo principal (movido para submodule dedicado)
