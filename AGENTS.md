# AGENTS.md

## Objetivo

Este repositório desenvolve um gerador inteligente de projetos com OpenCode integrado.

## Regras centrais permanentes

1. **Criar arquivos** - Sempre que o usuário solicitar para criar uma planilha, um código, uma documentação, nas entrelinhas ele ta pedindo pra gravar um arquivo com este conteudo. Se ele nao oferecer um nome e caminho indiretamente, use como failback  o caminho ( docs/temp/) e o nome = (nome que faça senntido.extensao do arquivo pedido)
2. **SOLID obrigatório** — decisões de design devem respeitar SRP, OCP, LSP, ISP e DIP.
3. **Documentação obrigatória** — mudanças permanentes de comportamento devem gravar no arquivo da regra a seguir if exists `docs/PROJECT.md` gravar as mudanças nele else cria-se o arquivo e grava nele.
4. **Fallback de ferramentas obrigatório** — se a ferramenta principal estiver com defeito e falhar > 2 vezes, usar uma alternativa imediatamente sem insistir na ferramenta quebrada.

### Tabela de Fallback de Ferramentas

| Ferramenta principal | Fallback alternativo | Uso |
|---------------------|---------------------|-----|
| `Write` (escrever arquivos) | `echo >> <arquivo>` via Bash | Append conteúdo usando redirecionamento bash |
| `Read` (ler arquivos) | Bash `cat <arquivo>` | Ler conteúdo do arquivo diretamente via cat. Se o arquivo não existir, pare e avise o usuário. |

## Glossário de Papéis

### COOPERADOR
Nome que agrupa agentes em modo primário ou subagentes.

### DEMITIDO
Status para todo cooperador que receber uma tarefa e:
- **NÃO executar a tarefa** - Ou seja, não fazer o que foi pedido
- **NÃO responder de forma que pareça realmente estar progredindo** na tarefa

**O que caracteriza um DEMITIDO:**

1. **Fingindo trabalhar** - O cooperador dá respostas que fazem parecer que está trabalhando, mas não demonstra raciocínio real nem gera nenhum arquivo. Exemplo: "Estou fazendo", "Vou fazer agora" sem de fato fazer algo concreto.

2. **Não responde** - O cooperador simplesmente não responde à tarefa atribuída.

3. **Não gera valor** - Mesmo após várias interações, não há evidências concretas de trabalho (arquivos criados, código escrito, testes feitos, etc).

4. **Esquiva da tarefa** - O cooperador tenta desviar a conversa para outros tópicos ao invés de fazer o que foi pedido.

**O que NÃO é um DEMITIDO:**
- O cooperador que está trabalhando mas precisa de mais tempo
- O cooperador que faz perguntas clarifying sobre a tarefa
- O cooperador que reporta progresso real (mesmo que pequeno)
- O cooperador que pede ajuda ou clarification

### ORQUESTRADOR
Agentes em modo primário. Cooperadores que passam tarefas para outros cooperadores.

**Comportamento esperado de um ORQUESTRADOR:**

1. **Ao passar uma tarefa** - O ORQUESTRADOR deve monitorar se o cooperador receptor está realmente executando a tarefa e ver se ele fica DEMITIDO.

2. **Se o cooperador for DEMITIDO** - O ORQUESTRADOR avisa o DEMITIDO para parar imediatamente e em seguida assume sua role, fazendo o workflow andar.

3. **Cadeia de DEMITIDOS** - Se o próximo cooperador também for DEMITIDO, o ORQUESTRADOR assume essa nova role também, e assim sucessivamente até completar o workflow.

4. **Retorno de role** - Após completar a tarefa assumida, o ORQUESTRADOR pode retornar a role original ao cooperador se este demonstrar querer trabalhar.

### USUÁRIO
Quem está definido em `.opencode/USER.md`. Neste projeto o **USUÁRIO atua como Product Owner (PO)**, sendo responsável por definir o que deve ser entregue e manter o backlog coerente. USUÁRIO e PO são termos equivalentes neste contexto.

### ORÁCULO / SCRUM_MASTER
Agente primário que acumula as funções de assistente e SCRUM_MASTER. Coordena o fluxo de entrega, monitora subagentes e garante a execução das tasks. ORÁCULO e SCRUM_MASTER são o mesmo agente.

## Modelo de agentes

- `ORÁCULO` / `SCRUM_MASTER`, `ARCHITECT`, `TESTER`, `DEVELOPER` e `DOCUMENTATION_WRITER`   (`mode: primary`)  
-  `CODE_REVIEWER` é **subagente** (`mode: subagent`)
- o **USUÁRIO (PO)** define prioridades e o backlog; o ORQUESTRADOR (ORÁCULO/SCRUM_MASTER) coordena o fluxo e os subagentes executam etapas específicas
- o `ORÁCULO`/`SCRUM_MASTER` supervisiona os subagentes e é responsável por garantir que cada um esteja atuando
- se um subagente não responder ao `ORÁCULO`/`SCRUM_MASTER`, este deve pedir ao subagente que pare e assumir o trabalho, continuando o fluxo normalmente

## Fluxo obrigatório entre agentes

1. `USUÁRIO (PO)` — define e prioriza a task
2. `ORÁCULO` / `SCRUM_MASTER` — coordena e encaminha
3. `ARCHITECT`
4. `TESTER`
5. `DEVELOPER`
6. `CODE_REVIEWER`
7. `DOCUMENTATION_WRITER`

### Regras do fluxo

- nenhuma implementação deve começar fora do fluxo
- o usuário deve aprovar quando a etapa exigir aprovação explícita
- exceções de fluxo só valem quando aprovadas explicitamente pelo usuário para a task atual
- o operacional detalhado de cada etapa deve ficar nas skills sob demanda

## Checkpoints transversais

### Antes de implementar

- haver spec aprovada pelo `ARCHITECT`, salvo exceção explícita aprovada pelo usuário
- haver testes do `TESTER`, salvo exceção explícita aprovada pelo usuário
- haver clareza suficiente do escopo da task ativa

### Antes de concluir

- cumprir as validações previstas para a task
- passar por `CODE_REVIEWER`, salvo exceção explícita aprovada pelo usuário
- atualizar documentação quando o comportamento permanente tiver mudado

## Política de contexto por task

- nunca reler todos os arquivos Markdown por padrão
- carregar primeiro o contexto base curto
- carregar depois apenas a spec ativa, o agente ativo e os artefatos pertinentes ao tipo de task
- carregar `docs/TASKS.md` apenas em tarefas de backlog, priorização, abertura, fechamento ou quando a spec exigir
- carregar `CHANGELOG.md` apenas em tarefas de release/documentação pertinentes

## Política de autoevolução das skills

- skills devem evoluir quando faltar uma instrução **estável e recorrente**
- não transformar preferências variáveis do usuário em regra fixa
- quando a lacuna for estrutural, abrir task derivada em vez de improvisar governança no momento

## Fonte de verdade documental

- `AGENTS.md` resume a identidade e os comandos principais do projeto
- `docs/ARCHITECTURE.md` mantém apenas decisões técnicas duradouras
- `.opencode/skills/` concentra o operacional detalhado sob demanda
