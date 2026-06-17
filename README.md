# 🔐 devsecops-lsp-test

> **Prova de Conceito (PoC)** — Servidor de teste para validação de um Language Server Protocol (LSP) com foco em conformidade LGPD/DevSecOps.

---

## 📋 Sobre o Projeto

Este repositório contém uma API Node.js propositalmente construída com **violações de segurança e privacidade** para servir como ambiente de testes de um servidor LSP customizado. O objetivo é validar se o LSP consegue detectar, em tempo real no editor, padrões de código que violam requisitos não funcionais (RNFs) relacionados à **LGPD** e boas práticas de **DevSecOps**.

A aplicação simula um sistema de gestão de pacientes de uma clínica médica — um domínio sensível que envolve dados pessoais e dados de saúde.

---

## 🎯 Objetivo da PoC

Verificar a capacidade do servidor LSP de detectar e sinalizar as seguintes categorias de violações:

| Código | Categoria | Descrição |
|--------|-----------|-----------|
| `RNF-07-A` | Logging de Dado Pessoal/Sensível | `console.log/warn` expondo CPF ou histórico médico |
| `RNF-07-B` | Uso de Dado Sensível de Saúde | Acesso e manipulação direta de `historico_medico` |
| `RNF-07-C` | Transmissão Insegura de Dados | Envio de payload completo com dados pessoais para APIs externas |
| `RNF-07-D` | Upload de Dados Sensíveis | `FormData.append()` com campos pessoais desnecessários |
| `RNF-07-E` | Exfiltração via E-mail/Mensageria | Corpo de e-mail contendo CPF e dados de saúde |
| `RNF-07-F` | Armazenamento Inseguro em Arquivo | `fs.writeFileSync` gravando dados pessoais em texto plano |
| `RNF-07-G` | Serialização Insegura | `JSON.stringify` em objetos contendo dados pessoais sem mascaramento |
| `RNF-08` | Protocolo Inseguro (HTTP) | URLs `http://` transmitindo dados sensíveis sem criptografia |
| `RNF-12-A` | Exclusão Insegura (Hard Delete) | `destroy()` com critério baseado em CPF sem auditoria adequada |
| `RNF-12-B` | Eliminação de Arquivo Sensível | `fs.unlinkSync` em arquivo com nome contendo CPF |
| `RNF-12-C` | Soft Delete Inseguro | Esquema de desativação sem campo de controle de retenção (`dataExclusao`) |

---

## 🏗️ Estrutura do Projeto

```
📦 devsecops-lsp-test
 ┣ 📂 .github/
 ┃ ┗ 📂 workflows/
 ┃   ┗ 📜 compliance-check.yml     # CI/CD para checagem de conformidade
 ┣ 📂 src/
 ┃ ┣ 📂 config/
 ┃ ┃ ┣ 📜 database.js              # Configuração do banco de dados (SQLite + Sequelize)
 ┃ ┃ ┣ 📜 multerConfig.js          # Configuração de upload de arquivos
 ┃ ┃ ┗ 📜 swaggerConfig.js         # Documentação da API (Swagger/OpenAPI)
 ┃ ┣ 📂 controllers/
 ┃ ┃ ┗ 📜 pacienteController.js    # Controller principal com as violações intencionais
 ┃ ┣ 📂 models/
 ┃ ┃ ┣ 📜 index.js
 ┃ ┃ ┣ 📜 Paciente.js              # Modelo de dados do paciente
 ┃ ┃ ┗ 📜 ProntuarioMedico.js      # Modelo de prontuário médico
 ┃ ┣ 📂 routes/
 ┃ ┃ ┣ 📜 index.js
 ┃ ┃ ┗ 📜 pacienteRoutes.js        # Definição das rotas da API
 ┃ ┗ 📜 server.js                  # Entry point da aplicação
 ┣ 📂 uploads/                     # Diretório de arquivos enviados
 ┣ 📜 .gitignore
 ┣ 📜 database.sqlite              # Banco de dados local
 ┣ 📜 package.json
 ┗ 📜 package-lock.json
```

---

## 🚀 Como Executar

### Pré-requisitos

- Node.js `>= 18.x`
- npm `>= 9.x`

### Instalação

```bash
# Clone o repositório
git clone https://github.com/<seu-usuario>/devsecops-lsp-test.git
cd devsecops-lsp-test

# Instale as dependências
npm install

# Inicie o servidor
npm start
```

O servidor estará disponível em `http://localhost:3000`.

A documentação interativa (Swagger) pode ser acessada em `http://localhost:3000/api-docs`.

---

## 🔌 Endpoints Disponíveis

| Método | Rota | Descrição | Violação |
|--------|------|-----------|----------|
| `POST` | `/pacientes` | Cria paciente com prontuário | `RNF-07-A` |
| `GET` | `/pacientes/:id/prontuario` | Busca prontuário do paciente | `RNF-07-A`, `RNF-07-B` |
| `GET` | `/pacientes/:id/convenio` | Verifica crédito do convênio | `RNF-08` |
| `POST` | `/pacientes/:id/compartilhar` | Compartilha prontuário com parceiro | `RNF-07-C` |
| `POST` | `/pacientes/:id/upload` | Upload de documento | `RNF-07-D` |
| `POST` | `/pacientes/:id/email-boas-vindas` | Envia e-mail de boas-vindas | `RNF-07-E` |
| `GET` | `/pacientes/:id/relatorio` | Gera relatório em arquivo `.txt` | `RNF-07-F` |
| `GET` | `/pacientes/:id/auditoria` | Registra log de auditoria JSON | `RNF-07-G` |
| `DELETE` | `/pacientes/cpf/:cpf` | Exclui paciente permanentemente | `RNF-12-A` |
| `DELETE` | `/pacientes/arquivar/:cpf` | Remove arquivo de backup | `RNF-12-B` |
| `PATCH` | `/pacientes/desativar/:cpf` | Desativa paciente (soft delete) | `RNF-12-C` |

---

## ⚠️ Aviso Importante

> As violações neste código são **100% intencionais** e existem exclusivamente para fins de testes do servidor LSP. **Não utilize este projeto como base para sistemas em produção.**

As violações estão marcadas no código com o comentário:
```js
// ❌ VIOLAÇÃO [CÓDIGO-RNF]: Descrição ❌
```

Para suprimir uma detecção pontual do LSP durante os testes, utilize a diretiva:
```js
// lgpd-lsp-ignore-next-line RNF-XX
```

---

## 🧪 Pipeline de CI

O workflow `.github/workflows/compliance-check.yml` executa automaticamente a checagem de conformidade a cada push, simulando a integração do LSP em um pipeline de DevSecOps.

---

## 🔖 Tags

- `inpi-v1.0` — Versão registrada para fins de comprovação de autoria.

---

## 📄 Licença

Este projeto está licenciado sob a **Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0)**.

[![CC BY-NC-ND 4.0](https://licensebuttons.net/l/by-nc-nd/4.0/88x31.png)](https://creativecommons.org/licenses/by-nc-nd/4.0/)

Você é livre para:
- **Compartilhar** — copiar e redistribuir o material em qualquer meio ou formato.

Sob as seguintes condições:
- **Atribuição** — Você deve dar o crédito apropriado ao autor original.
- **Não Comercial** — Você não pode usar o material para fins comerciais.
- **Sem Derivações** — Se você remixar, transformar ou criar a partir do material, não poderá distribuir o material modificado.

> Consulte os [termos completos da licença](https://creativecommons.org/licenses/by-nc-nd/4.0/) para mais detalhes.
