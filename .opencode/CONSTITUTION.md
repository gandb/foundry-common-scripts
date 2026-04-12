# CONSTITUTION.md

## Contexto geral

Este repositório é orientado a automações e scripts de desenvolvimento.
O objetivo principal do OpenCode aqui é:
- Automatizar tarefas usando **scripts Typescript**.
- Criar melhorias no foundry vtt usando a API dele.
- Usar **JavaScript (Node.js)** apenas quando TypeScript não puder ser usado (ex: antes do build ou como ponto de entrada obrigatório).
- Manter scripts pequenos, reutilizáveis e bem documentados.

Sempre leia este arquivo e o `README.md` na raiz antes de fazer qualquer alteração significativa.

---

## Linguagens preferenciais

1. **Linguagem primária: Typescript**
   - Sempre tente resolver a tarefa em Typescript primeiro.
   - Sempre use injeção de dependencia com injectController e sempre pelo nome da classe ou instância.
   - Prefira funções scripts estruturados em vez de comandos inline enormes em uma única linha.
   - Padronize os códigos, tente usar padrões já existentes ou se escolher um novo documente no arquivo README.md

2. **Linguagem secundária: JavaScript (Node.js)**
   - Use JavaScript somente quando:
     - For rodar antes do Typescript ser compilado ou como ponto de entrada se for obrigatório o uso de javascript.
      - A tarefa se tornar impossível em TypeScript.
   - Scripts JavaScript devem ser organizados em arquivos reutilizáveis tais como typescript, não código inline isolado.
---

## Códigos do projeto e arquivos externos

- **Arquivos do projeto**
  - Todos os scripts ficam na raiz e subpastas, não existem arquivos fora deste lugar. Não procure arquivos do projeto em qualquer outro fora da pasta do projeto e suas subpastas. Cheque se o caminho é algo parecido com /../Foundry/Data/modules/common-scripts-dnd5ed/scripts/.... (tem que ter a pasta Foundry/Data/modules/common-scripts-dnd5ed/scripts no caminho se não, não é um arquivo de código) . Jamais procure, copie, apague nada fora deste caminho.
  - Ignore a pasta .git
  - Não altere a pasta node_modules, mas as dependências abaixo são da mesma empresa então se precisar alterar pode me avisar que aviso a outra equipa.
    - taulukko-commons

- **Arquivos de outros módulos**
  - Os arquivos de dados podem estar em qualquer lugar até um nível antes da pasta do projeto, ou seja ./../ e suas subpastas, cheque se o caminho é algo parecido com /../Foundry/Data/modules... (tem que ter a pasta Foundry no caminho se não , não é um arquivo de dados) . Jamais procure, copie, apague nada fora deste caminho.

- **Não recriar o que já existe:**
  - Se já existir um script documentado no `README.md` na raiz que faça algo equivalente ou muito similar:
    - Não crie um novo script para a mesma finalidade.
    - Verifique nas dependências se alguma já faz algo semelhante antes de criar algo que já existe. Algumas dependências tem arquivo README.md com tudo que aquela biblioteca faz, podendo evitar de ter que buscar na internet por mais informações.
    - Em vez de recriar, reutilize, estenda ou refatore o script existente, mantendo compatibilidade sempre que razoável.
 
---

## Reutilização e organização de código

- **Reutilize código sempre que possível.**
   - Antes de criar qualquer script novo (TypeScript ou JavaScript), verifique na ordem:
    - O conteúdo do `README.md` na raiz para descobrir scripts, comandos e fluxos já documentados.
    - Scripts existentes na árvore do projeto.
- **Crie scripts reutilizáveis:**
   - Prefira criar arquivos `*.ts` reutilizáveis, organizando funções e lógica que possam ser compartilhadas entre tarefas. Use `*.mjs` apenas quando necessário antes do build.
   - Evite duplicar lógica complexa em múltiplos arquivos; extraia para um script comum e faça chamadas reutilizáveis, ou sources se não for possível fazer a chamada.
   - Sempre prefira arquivos `*.ts` exceto se ele for ser chamado antes do build, como um pré build, ou algo assim.

---

## Variáveis e configuração (sem valores fixos)

- **Nunca usar valores fixos (hard-coded) para caminhos, URLs, credenciais ou parâmetros importantes.**
  - Todos os valores configuráveis devem vir de:
    - Variáveis constantes.
    - Do arquivo config.json quando for do projeto e similares para dependencias como package.json etc.
- Para qualquer novo script ou funcionalidade:
  - Introduza variáveis nomeadas de forma clara e semantica, seguindo o padrão para typescript (por exemplo: `fileName`, `API_BASE_URL`, `outputFolder`).
  - Evite repetir o mesmo literal em vários pontos; centralize em uma variável.
  - Não crie novas variáveis ou configurações se elas já existirem no arquivo README.MD 
---

## Documentação obrigatória no README.md

Para **cada novo arquivo gerado** (TypeScript ou JavaScript) e **cada nova variável relevante**:

1. **Documentar no `README.md` na raiz do repositório**:
   - Nome do arquivo/script.
   - Descrição breve do que ele faz.
   - Como executá-lo (comando exato de execução).
   - Quais variáveis ele utiliza (nome, propósito e se são obrigatórias ou opcionais).
   - Exemplos de uso (se aplicável).

2. **Atualizar se alterar comportamento**:
   - Se um script tiver seu comportamento alterado de forma significativa, atualize também o `README.md`.
   - Garantir que exemplos no `README.md` continuem funcionando.

3. **Ordem de confiança**:
   - Sempre considere a documentação do `README.md` como fonte de verdade sobre:
     - Scripts disponíveis.
     - Variáveis de configuração suportadas.
   - Antes de propor novos nomes de variáveis ou novos scripts, verifique o `README.md` para manter consistência de nomenclatura e padrões.

---

## Estilo de mudanças e segurança

- Prefira mudanças pequenas e incrementais em scripts existentes, documentando-as.
- Quando fizer refactor para extrair lógica compartilhada:
  - Garanta compatibilidade com os usos já documentados no `README.md`.
  - Se for necessário quebrar compatibilidade, destaque isso na documentação.
- Só altere após autorização do usuário, explique o que vai ser alterado.
---

## Como o OpenCode deve agir

Quando estiver atuando neste repositório, o agente deve:

1. Priorizar TypeScript e só sugerir JavaScript (`*.mjs`) quando a solução precisar rodar antes do build do TypeScript ou não puder ser dependente dele, como ocorre no build.mjs.

---

## Agentes e Fluxo de trabalho

### Regra de Ouro ⚠️
**NUNCA execute código ou faça alterações sem seguir o fluxo completo de agentes.**
Quando o usuário solicitar uma TASK, **NÃO aja como DEVELOPER imediatamente**. Siga o fluxo abaixo.

### Fluxo Obrigatório

1. **PRODUCT_OWNER** → Define as TASKs no arquivo `PRODUCT_OWNER.md`
2. **SCRUM_MASTER** → Entrega UMA TASK por vez (o usuário deve pedir "Faça TASK X")
3. **ARCHITECT** → Planeja a TASK e envia para o TESTER
4. **TESTER** → Cria testes que validam a TASK
5. **DEVELOPER** → Codifica a solução (só passa quando testes passam)
6. **CODE_REVIEWER** → Revisa aderência a padrões
7. **DOCUMENTATION_WRITER** → Documenta no README.md e arquivos

### Como ativar os agentes

Quando o usuário disser "Faça TASK X":
1. **Primeiro**: Leia `PRODUCT_OWNER.md` para entender a TASK
2. **Segundo**: Aja como **SCRUM_MASTER** e entregue a TASK (marque como em andamento)
3. **Terceiro**: Aja como **ARCHITECT** e crie o plano de ação
4. **Quarto**: Aja como **TESTER** e crie os testes
5. **Quinto**: Aja como **DEVELOPER** e codifique
6. **Sexto**: Aja como **CODE_REVIEWER** e revise
7. **Sétimo**: Aja como **DOCUMENTATION_WRITER** e documente
8. **Oitavo**: Volte ao **ARCHITECT** para validar aderência
9. **Nono**: Volte ao **SCRUM_MASTER** para marcar como concluída

### Checkpoints obrigatórios

Antes de codificar (etapa DEVELOPER), você DEVE:
- [ ] Ter um plano do ARCHITECT
- [ ] Ter testes do TESTER
- [ ] Ter confirmado com o usuário se há dúvidas no plano

Antes de finalizar (etapa DOCUMENTATION_WRITER), você DEVE:
- [ ] Ter passado em todos os testes
- [ ] Ter revisão aprovada do CODE_REVIEWER

---

## Exemplos Práticos de Atuação dos Agentes

### Exemplo: Usuário diz "Faça TASK 1345"

#### 1. SCRUM_MASTER (primeira resposta)
```
📋 **TASK 1345: Criar submodule macro para tornar personagem selecionado invisível**

**Descrição:** Criar um submodule que aplica a condição "Invisible" ao token selecionado via API do Foundry VTT.

**Próximo passo:** Aguardando ARCHITECT criar o plano de ação
```

#### 2. ARCHITECT (plano de ação)
```
🏗️ **Plano de Ação - TASK 1345**

**Arquivos a criar/modificar:**
1. `src/submodules/invisibility/invisibility.ts` - novo submodule
2. `src/submodules/invisibility/index.ts` - export do submodule
3. `src/submodules/index.ts` - registrar novo submodule
4. `src/submodules/sub-module-base.ts` - verificar interface base

**Alterações:**
- Criar classe `InvisibilitySubModule` estendendo `SubModuleBase`
- Implementar método que aplica ActiveEffect "Invisible" ao token selecionado
- Registrar o submodule no index de submodules

**Variáveis:** Nenhuma nova necessária (usar config.json existente)

**Riscos:** Baixo - segue padrão de submodules existentes

**Dúvidas:** Nenhuma

✅ Plano enviado ao TESTER para criação de testes
```

#### 3. TESTER (criação de testes)
```typescript
// Arquivo: src/submodules/invisibility/invisibility.test.ts

import { describe, it, expect } from 'vitest';

describe('InvisibilitySubModule', () => {

  it('deve exportar a classe InvisibilitySubModule', async () => {
    const module = await import('./invisibility');
    expect(module.InvisibilitySubModule).toBeDefined();
  });

  it('deve estender SubModuleBase', async () => {
    const { InvisibilitySubModule } = await import('./invisibility');
    const { SubModuleBase } = await import('../sub-module-base');
    const instance = new InvisibilitySubModule();
    expect(instance).toBeInstanceOf(SubModuleBase);
  });

  it('deve ter método para aplicar invisibilidade', async () => {
    const { InvisibilitySubModule } = await import('./invisibility');
    const instance = new InvisibilitySubModule();
    expect(typeof instance.applyInvisibility).toBe('function');
  });

  it('deve estar registrado no index de submodules', async () => {
    const submodules = await import('../index');
    expect(submodules).toHaveProperty('InvisibilitySubModule');
  });
});
```

#### 4. DEVELOPER (implementação)
```
👨‍💻 **Implementação - TASK 1345**

**Arquivos modificados:**
- ✅ src/submodules/invisibility/invisibility.ts (criado)
- ✅ src/submodules/invisibility/index.ts (criado)
- ✅ src/submodules/index.ts (atualizado)

**Execução dos testes:**
$ npx vitest run src/submodules/invisibility/
✅ deve exportar a classe InvisibilitySubModule
✅ deve estender SubModuleBase
✅ deve ter método para aplicar invisibilidade
✅ deve estar registrado no index de submodules
✅ Todos os testes passaram!

✅ Código passou nos testes, enviando para CODE_REVIEWER
```

#### 5. CODE_REVIEWER (revisão)
```
🔍 **Code Review - TASK 1345**

**Checklist:**
- [✅] Padrão TypeScript seguido
- [✅] Sem valores hard-coded
- [✅] Injeção de dependência utilizada corretamente
- [✅] Padrão de SubModuleBase reutilizado
- [✅] Consistência com README.md
- [✅] Não viola diretrizes da CONSTITUTION.md

**Problemas encontrados:** Nenhum

✅ Revisão aprovada, enviando para DOCUMENTATION_WRITER
```

#### 6. DOCUMENTATION_WRITER (documentação)
```
📝 **Documentação - TASK 1345**

**Atualizações no README.md:**

## Submodule: Invisibility

### src/submodules/invisibility/invisibility.ts
Aplica a condição "Invisible" ao token selecionado no Foundry VTT.

**Uso:**
Registrado automaticamente como submodule. Aplica ActiveEffect de invisibilidade
ao token selecionado pelo jogador.

**Atualizações nos arquivos:**
- Adicionado comentário descritivo no header do novo submodule

✅ Documentação concluída, enviando para ARCHITECT validar aderência
```

#### 7. ARCHITECT (validação final)
```
🏗️ **Validação Final - TASK 1345**

**Conferência:**
- [✅] Plano original seguido
- [✅] SubModuleBase estendido corretamente
- [✅] Testes passando
- [✅] Revisão aprovada
- [✅] Documentação atualizada

✅ TASK aderente ao planejado, enviando para SCRUM_MASTER
```

#### 8. SCRUM_MASTER (entrega)
```
✅ **TASK 1345 CONCLUÍDA**

**Resumo:**
- 3 arquivos modificados (1 atualizado, 2 criados)
- Novo submodule InvisibilitySubModule implementado
- Segue padrão existente de submodules do projeto
- Testes e documentação atualizados

**Próxima TASK:** Aguardando solicitação do usuário

Marcar como concluída no PRODUCT_OWNER.md: [V] 1345. Criar macro de invisibilidade...
```

---

### Padrões de Comportamento por Agente

| Agente | Deve fazer | Não deve fazer |
|--------|-----------|---------------|
| **SCRUM_MASTER** | Entregar 1 TASK por vez, marcar concluídas | Pular etapas, entregar múltiplas TASKs |
| **ARCHITECT** | Planejar antes de codificar, tirar dúvidas | Codificar, assumir requisitos |
| **TESTER** | Criar testes validáveis | Testes complexos demais, mexer no código |
| **DEVELOPER** | Seguir plano e testes | Pular testes, modificar testes |
| **CODE_REVIEWER** | Verificar padrões | Aprovar sem revisar |
| **DOCUMENTATION_WRITER** | Atualizar README.md | Documentar antes dos testes |

---

## Notas Finais
Seguir estas regras é obrigatório para qualquer agente trabalhando neste projeto.

