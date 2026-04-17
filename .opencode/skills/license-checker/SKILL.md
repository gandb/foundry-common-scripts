---
name: license-checker
description: Verifica licencas das dependencias do projeto e identifica as que nao sao compatíveis com uso comercial (GPL, AGPL, LGPL restritivo, etc.)
---

## O que esta skill faz

Analisa as dependencias do `package.json` e verifica se alguma possui licenca incompativel com uso comercial. Identifica pacotes com licencas copyleft fortes como GPL, AGPL, BSL, SSPL, e outras que impõem restricoes ao uso comercial.

## Classificacao de Licencas

### Licencas COMPATIVEIS com uso comercial
- **Permissivas**: MIT, BSD, Apache 2.0, ISC, Unlicense, CC0, 0BSD, WTFPL
- **Weak copyleft** (com excecoes): LGPL (versoes menos restritivas), MPL, CDDL, EPL
- **Proprietarias**: Licencas comercias especificas

### Licencas INCOMPATIVEIS com uso comercial (copyleft forte)
- **GPL-2.0, GPL-3.0**: Requer que obras derivadas sejam tambem GPL
- **AGPL-3.0**: GPL + exigencia de codigo fonte para uso em rede
- **LGPL-2.1, LGPL-3.0**: Copyleft limitado (unicamente para librarias), mas ainda problematico para alguns casos
- **BSL-1.0, BSL-1.1**: Business Source License - proibido uso comercial
- **SSPL**: Server Side Public License - proibido uso comercial
- **EUPL-1.2**: Similar a GPL com excecoes EU
- **OFL-1.0, OFL-1.1**: Open Font License - requerence obrigatoria para fontes
- **CC-BY-SA, CC-BY-NC**: Creative Commons com ShareAlike ou NonCommercial

## Procedimento

### 1. Ler package.json

Extrair todas as dependencias:
- `dependencies`
- `devDependencies`
- `peerDependencies`

### 2. Verificar licencas

Para cada dependencia, verificar a licenca atraves de:
1. Campo `license` no `package.json` da dependencia (se disponivel localmente em `node_modules/`)
2. Busca no registry npm (usando `npm view <package> license`)
3. Consulta direta no site do pacote ou no repositorio GitHub

### 3. Identificar dependencias problemáticas

Classificar cada dependencia:
- `[OK]` - Licenca compativel (MIT, Apache, BSD, ISC, etc.)
- `[WARN]` - Licenca com copyleft fraco (LGPL, MPL, CDDL, EPL)
- `[ERRO]` - Licenca incompativel com uso comercial (GPL, AGPL, BSL, SSPL, etc.)

### 4. Verificar licenca do proprio projeto

Exibir a licenca declarada no `package.json` do projeto em analise.

## Formato de saida

```
=== AUDITORIA DE LICENCAS ===

--- Licenca do Projeto ---
Proprietaria (MIT)

--- Dependencias (n=XX) ---

[OK]    axios@1.6.0            | MIT
[OK]    express@4.18.2        | MIT
[WARN]  mocha@10.2.0          | MIT
[OK]    typescript@5.3.3      | Apache-2.0

--- DevDependencies (n=XX) ---

[OK]    jest@29.7.0           | MIT
[OK]    @types/node@20.10.0   | MIT

--- peerDependencies (n=XX) ---

[N/A]   Nenhuma

--- Resumo ---
Compatibilidade: PARCIAL
  - Total de dependencias: 5
  - Compatíveis: 4 (80%)
  - Com advertência: 1 (20%)
  - Incompatíveis: 0 (0%)

--- Licenças Incompatíveis Detectadas ---
Nenhuma dependencia com licenca incompativel encontrada.

--- Recomendacoes ---
• LGPL e copyleft fraco: Funciona para maioria dos casos, mas consultoria
  juridica é recomendada se houver duvidas.
• Para projetos puramente comerciais, prefira licencas permissivas (MIT, BSD, Apache).
```

## Dependencias criticas (incompatibilidade alta)

Se detectado algum pacote com licenca incompativel:
1. Listar explicitamente a dependencia
2. Explicar o risco
3. Sugerir alternativas (se conhecidas)

## Quando usar esta skill

- Antes de lançar um produto comercial
- Ao adicionar novas dependencias ao projeto
- Em revisoes de codigo (etapa CODE_REVIEWER)
- Ao auditar compliance de licencas
- Na etapa ARCHITECT ao validar a arquitetura
