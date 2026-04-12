---
name: readme-sync-enforcer
description: Verifica se todos os scripts e variaveis do projeto estao documentados no README.md e se a documentacao reflete o comportamento atual
---

## O que esta skill faz

Garante que o `README.md` na raiz do projeto esta sincronizado com a realidade do codigo. Isso inclui:
- Todo script `.sh` documentado
- Toda variavel `FOUNDRY_*` documentada
- Descricoes de comportamento atualizadas
- Comandos de execucao corretos

Esta skill complementa o script `src/verificar-readme.sh` que ja existe no projeto (que valida datas de deploy nos worlds).

## Procedimento

### 1. Listar todos os scripts do projeto

Buscar todos os `.sh` nas pastas do projeto (excluindo `bkp/`, `.git/`, `node_modules/`):

```bash
find . -name "*.sh" -not -path "./bkp/*" -not -path "./.git/*" | sort
```

**Locais esperados:**
- Raiz: `backup.sh`, `backup-dev.sh`, `backup-prod.sh`, `deploy.sh`
- `src/`: scripts de suporte ao deploy e backup
- `src-prod/`: scripts que rodam no servidor remoto
- `src/tests/`: scripts de teste
- `dev-key/`: scripts de chave SSH
- `util/`: utilitarios

### 2. Verificar presenca no README.md

Para cada script encontrado, verificar se ha uma entrada correspondente no `README.md`. O README deve conter:

- **Nome do script** (nome do arquivo)
- **Descricao** do que faz
- **Comando de execucao** (como rodar)
- **Variaveis usadas** (se aplicavel)

### 3. Verificar variaveis documentadas

Cruzar as variaveis `FOUNDRY_*` mencionadas no README com as realmente usadas nos scripts:
- Variaveis usadas mas nao documentadas -> `[ERRO]`
- Variaveis documentadas mas nao usadas -> `[WARN]`

### 4. Verificar comportamento documentado vs real

Para scripts ja documentados, comparar:
- O comportamento descrito no README (ex: "emite warning e continua") com o codigo real
- Parametros aceitos pelo script vs documentados
- Listas de modulos mencionadas no README vs listas no codigo

### 5. Verificar scripts de teste

Todo script em `src/tests/` deve estar documentado na secao "Testes" do README.md com:
- Nome do teste
- O que testa
- Comando de execucao

## Formato de saida

```
=== SINCRONIZACAO README.md ===

--- Scripts ---
[OK]    deploy.sh                              | Documentado
[OK]    backup.sh                              | Documentado
[ERRO]  src/deploy-mount-space.sh              | NAO documentado no README
[ERRO]  src/folder_compact.sh                  | NAO documentado no README
[WARN]  src-prod/start.sh                      | Documentacao incompleta (falta comando de execucao)

--- Variaveis ---
[OK]    FOUNDRY_PATH                           | Documentada e usada
[WARN]  FOUNDRY_LOCAL_USER                     | Documentada mas nao usada em scripts

--- Comportamento ---
[OK]    deploy-copy-remote-modules.sh          | Warning para modulos novos documentado corretamente
[WARN]  backup-modules.sh                      | Lista de modulos no README difere da lista no script
```

### 6. Sugerir correcoes

Para cada `[ERRO]`, gerar um bloco markdown pronto para ser inserido no README.md seguindo o formato existente:

```markdown
## nome-do-script.sh
Descricao breve do que faz.

**Execucao:** `./caminho/nome-do-script.sh`
```

## Quando usar esta skill

- Apos criar ou modificar qualquer script
- Antes de commits que alteram scripts
- Em revisoes de codigo (etapa CODE_REVIEWER do fluxo de agentes)
- Na etapa DOCUMENTATION_WRITER do fluxo de agentes
- Periodicamente para manter a documentacao saudavel
