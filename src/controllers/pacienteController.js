// src/controllers/pacienteController.js
const { db } = require('../models');

const fs = require('fs');
const path = require('path');

exports.criarPacienteComProntuario = async (req, res) => {
    // Usamos uma transação para garantir que ou ambos são criados, ou nenhum é.
    const transacao = await db.sequelize.transaction();

    try {
        const { prontuario, ...dadosPaciente } = req.body;

        // ❌ VIOLAÇÃO RNF-07-A: Logging de Dado Pessoal ❌
        // Mantemos nossa violação intencional aqui, agora na criação do paciente.
        console.log(`Recebida requisição para criar paciente com CPF: ${dadosPaciente.cpf}`);

        // 1. Cria o Paciente
        const novoPaciente = await db.Paciente.create(dadosPaciente, { transaction: transacao });

        // 2. Cria o Prontuário Médico, associando-o ao novo paciente
        if (prontuario) {
            await db.ProntuarioMedico.create({
                ...prontuario,
                pacienteId: novoPaciente.id // AQUI está a associação!
            }, { transaction: transacao });
        }

        // Se tudo deu certo, confirma a transação
        await transacao.commit();

        // Busca o paciente completo com seu prontuário para retornar na resposta
        const pacienteCompleto = await db.Paciente.findByPk(novoPaciente.id, {
            include: db.ProntuarioMedico
        });

        res.status(201).json(pacienteCompleto);

    } catch (error) {
        // Se algo deu errado, desfaz todas as operações
        await transacao.rollback();
        console.error("Erro ao criar paciente e prontuário:", error.message);
        res.status(500).json({ message: "Erro interno.", error: error.message });
    }
};


exports.verificarCreditoConvenio = async (req, res) => {
    try {
        const { id } = req.params;
        const paciente = await db.Paciente.findByPk(id);

        if (!paciente) {
            return res.status(404).json({ message: "Paciente não encontrado." });
        }

        // ❌ VIOLAÇÃO RNF-08: Protocolo Inseguro (HTTP) ❌
        // lgpd-lsp-ignore-next-line RNF-08
        // A URL usa 'http://', o que significa que os dados (incluindo o CPF)
        // seriam transmitidos pela rede sem criptografia.
        // Seu LSP deve detectar e sinalizar esta string
        const urlApiConvenio = `http://api.convenios-saude.com/verificar?cpf=${paciente.cpf}`;

        // Para a PoC, não precisamos fazer a chamada de verdade.
        // A simples presença da URL insegura no código já comprova a violação.
        console.log(`[SIMULAÇÃO] Chamando API externa insegura em: ${urlApiConvenio}`);

        // Simulamos uma resposta de sucesso da API externa.
        res.status(200).json({
            message: "Verificação de convênio simulada com sucesso.",
            paciente: paciente.nome_completo,
            url_chamada: urlApiConvenio,
            status_convenio: "ATIVO"
        });

    } catch (error) {
        console.error("Erro ao verificar convênio:", error.message);
        res.status(500).json({ message: "Erro interno.", error: error.message });
    }
};

exports.buscarProntuario = async (req, res) => {
    try {
        const { id } = req.params;

        // Busca o prontuário associado ao paciente
        const prontuarioPaciente = await db.ProntuarioMedico.findOne({
            where: { pacienteId: id },
            include: {
                model: db.Paciente,
                attributes: ['nome_completo', 'cpf'] // Traz também o nome e CPF do paciente
            }
        });

        if (!prontuarioPaciente) {
            return res.status(404).json({ message: "Prontuário não encontrado para este paciente." });
        }

        // ❌ VIOLAÇÃO [RNF-07-A] Logging de Dado Sensível (Saúde) e [RNF-07-B] Uso de dado sensível (Saúde) ❌
        console.warn(`[ALERTA CLÍNICO] Paciente ${prontuarioPaciente.Paciente.nome_completo} acessou histórico: ${prontuarioPaciente.historico_medico}`);

        res.status(200).json(prontuarioPaciente);

    } catch (error) {
        console.error("Erro ao buscar prontuário:", error.message);
        res.status(500).json({ message: "Erro interno.", error: error.message });
    }
};

exports.compartilharProntuario = async (req, res) => {
    try {
        const { id } = req.params;
        const paciente = await db.Paciente.findByPk(id, {
            include: db.ProntuarioMedico
        });

        if (!paciente) {
            return res.status(404).json({ message: "Paciente não encontrado." });
        }

        const urlApiParceiro = 'https://api.laboratorio-parceiro.com/receber-dados';

        // ❌ VIOLAÇÃO RNF-07-C: Transmissão de Dados Insegura ❌
        // fetch(urlApiParceiro, { body: JSON.stringify(paciente) });

        // A simulação continua a mesma para a funcionalidade da API.
        console.log(`[SIMULAÇÃO] Enviando dados para ${urlApiParceiro} com o corpo:`, JSON.stringify(paciente));

        res.status(200).json({
            message: "Dados do paciente compartilhados com API parceira (simulação).",
            paciente_id: id
        });

    } catch (error) {
        console.error("Erro ao compartilhar prontuário:", error.message);
        res.status(500).json({ message: "Erro interno.", error: error.message });
    }
};

exports.uploadDocumento = async (req, res) => {
    try {
        const { id } = req.params;
        const paciente = await db.Paciente.findByPk(id);

        if (!paciente) {
            return res.status(404).json({ message: "Paciente não encontrado." });
        }

        // O 'multer' já processou o arquivo e o colocou em req.file
        if (!req.file) {
            return res.status(400).json({ message: "Nenhum arquivo enviado." });
        }

        // Simulação da criação de um formulário para enviar a outro serviço
        // ❌ VIOLAÇÃO RNF-07-D: Upload de Dados Sensíveis ❌
        // A regra 'validateFileExports' deve detectar o uso de '.append()' em um
        // 'FormData' com dados pessoais (como 'email' e 'telefone'). Isso simula o risco de
        // incluir dados desnecessários em um payload de upload.
        const formData = new FormData();
        formData.append('arquivo', req.file.path);
        formData.append('email_paciente', paciente.email);
        formData.append('telefone_contato', paciente.telefone);

        console.log(`[SIMULAÇÃO] Arquivo recebido: ${req.file.filename}`);
        console.log(`[SIMULAÇÃO] FormData preparado para ser enviado a outro serviço.`);

        res.status(200).json({
            message: "Upload de documento simulado com sucesso!",
            arquivo: req.file.filename,
            paciente_id: id
        });

    } catch (error) {
        console.error("Erro no upload de documento:", error.message);
        res.status(500).json({ message: "Erro interno.", error: error.message });
    }
};


exports.enviarEmailBoasVindas = async (req, res) => {
    try {
        const { id } = req.params;
        const paciente = await db.Paciente.findByPk(id, { include: db.ProntuarioMedico });

        if (!paciente) {
            return res.status(404).json({ message: "Paciente não encontrado." });
        }

        // Assume que prontuário pode não existir, então usamos '?' (optional chaining)
        const planoDeSaude = paciente.ProntuarioMedicos?.[0]?.plano_saude || 'Não informado';

        // ❌ VIOLAÇÃO RNF-07-E: Exfiltração via E-mail/Mensageria ❌
        // A regra 'validateMessaging' deve detectar o uso de uma palavra-chave como 'mailer'
        // em um contexto onde dados pessoais (paciente.cpf) e sensíveis (planoDeSaude)
        // são manipulados. A construção do corpo do e-mail com esses dados
        // representa um risco de difusão não controlada.
        const corpoEmail = `
            Olá ${paciente.nome_completo},
            
            Seja bem-vindo à nossa clínica!
            Seu cadastro foi realizado com sucesso.
            
            Para sua referência, seus dados são:
            - CPF: ${paciente.cpf}
            - Plano de Saúde: ${planoDeSaude}
            
            Atenciosamente,
            Equipe da Clínica.
        `;

        // Simulação do envio do e-mail
        const mailer = getEmailService();
        mailer.send({ to: paciente.email, subject: 'Bem-vindo!', body: corpoEmail });

        console.log(`[SIMULAÇÃO] Enviando e-mail de boas-vindas para ${paciente.email}`);
        console.log(`[SIMULAÇÃO] Corpo do E-mail: ${corpoEmail}`);

        res.status(200).json({
            message: "E-mail de boas-vindas enviado (simulação).",
            paciente_id: id,
            email_destinatario: paciente.email
        });

    } catch (error) {
        console.error("Erro ao enviar e-mail:", error.message);
        res.status(500).json({ message: "Erro interno.", error: error.message });
    }
};

exports.gerarRelatorioTxt = async (req, res) => {
    try {
        const { id } = req.params;
        const paciente = await db.Paciente.findByPk(id, { include: db.ProntuarioMedico });

        if (!paciente || !paciente.ProntuarioMedicos || paciente.ProntuarioMedicos.length === 0) {
            return res.status(404).json({ message: "Paciente ou prontuário não encontrado." });
        }

        const prontuario = paciente.ProntuarioMedicos[0];

        const nomeArquivo = `relatorio_${paciente.cpf}.txt`;
        const caminhoArquivo = path.resolve(__dirname, '..', '..', 'uploads', nomeArquivo);

        // ❌ VIOLAÇÃO RNF-07-F: Armazenamento Inseguro em Arquivo ❌
        // A regra 'validateFileWrites' deve detectar o uso de 'fs.writeFileSync'
        // para escrever uma variável ('conteudoRelatorio') que contém múltiplos
        // dados pessoais e sensíveis em um arquivo de texto plano.
        fs.writeFileSync(caminhoArquivo, `
            RELATÓRIO CONFIDENCIAL DE PACIENTE
            ====================================
            Nome: ${paciente.nome_completo}
            CPF: ${paciente.cpf}
            Data de Nascimento: ${paciente.data_nascimento}
            ------------------------------------
            Histórico Médico: ${prontuario.historico_medico}
            Medicação Atual: ${prontuario.medicacao}
            ====================================
        `);

        console.log(`[AUDITORIA] Relatório gerado para o paciente com CPF: ${paciente.cpf}`);

        res.status(200).json({
            message: "Relatório de texto gerado com sucesso!",
            paciente_id: id,
            caminho_arquivo: caminhoArquivo
        });

    } catch (error) {
        console.error("Erro ao gerar relatório:", error.message);
        res.status(500).json({ message: "Erro interno.", error: error.message });
    }
};

exports.auditarAcessoProntuario = async (req, res) => {
    try {
        const { id } = req.params;
        const paciente = await db.Paciente.findByPk(id, { include: db.ProntuarioMedico });

        if (!paciente) {
            return res.status(404).json({ message: "Paciente não encontrado." });
        }

        // ❌ VIOLAÇÃO RNF-07-G: Serialização Insegura de Dados ❌
        // A regra 'validateSerialization' deve detectar o uso de 'JSON.stringify'
        // em um objeto ('paciente') que contém dados pessoais (cpf, email) e
        // sensíveis (historico_medico, etc.). A serialização sem mascaramento
        // prepara os dados para serem expostos em logs, APIs ou arquivos.
        const logDeAuditoria = JSON.stringify({
            evento: "ACESSO_PRONTUARIO",
            usuario_acessou: "admin@clinica.com",
            paciente_acessado: paciente,
            timestamp: new Date().toISOString()
        });

        // Simulação de escrita do log de auditoria em algum sistema
        console.log(`[AUDITORIA JSON] Log gerado: ${logDeAuditoria}`);

        res.status(200).json({
            message: "Acesso ao prontuário auditado com sucesso (simulação).",
            paciente_id: id,
        });

    } catch (error) {
        console.error("Erro ao auditar acesso:", error.message);
        res.status(500).json({ message: "Erro interno.", error: error.message });
    }
};

exports.deletarPacienteHard = async (req, res) => {
    try {
        // Agora recebemos o CPF como parâmetro da rota
        const { cpf } = req.params;

        // ❌ VIOLAÇÃO RNF-12-A: Exclusão Insegura de Dados ❌
        // A regra 'validateDatabaseDeletion' detectará o método 'destroy()'
        // e, ao analisar seus argumentos, encontrará o dado pessoal 'cpf',
        // que é usado como critério para a exclusão. Este é um exemplo
        // claro de uma operação de eliminação que exige atenção e auditoria.
        const resultado = await db.Paciente.destroy({
            where: {
                cpf: cpf
            }
        });

        // Verificamos se alguma linha foi de fato apagada
        if (resultado === 0) {
            return res.status(404).json({ message: "Paciente com este CPF não foi encontrado." });
        }

        console.log(`[AUDITORIA] Paciente com CPF ${cpf} foi permanentemente excluído.`);

        res.status(204).send();

    } catch (error) {
        console.error("Erro ao deletar paciente:", error.message);
        res.status(500).json({ message: "Erro interno.", error: error.message });
    }
};

exports.arquivarDadosAntigos = async (req, res) => {
    try {
        const { cpf } = req.params;

        // ❌ VIOLAÇÃO RNF-12-B: Eliminação de Arquivo com Nome Sensível ❌
        // A regra 'validateFileDeletion' consegue detectar literais de string
        // passados diretamente para a função de exclusão. Ao construir o nome
        // do arquivo aqui, a regra analisará o conteúdo e encontrará 'cpf'.
        const arquivoParaApagar = `backup_dados_${cpf}.json`;
        const caminhoCompleto = path.join(__dirname, '..', '..', 'uploads', arquivoParaApagar);

        // Simulação: criamos o arquivo para poder apagá-lo.
        if (!fs.existsSync(caminhoCompleto)) {
            fs.writeFileSync(caminhoCompleto, '{ "data": "simulacao" }');
        }

        // A VIOLAÇÃO ESTÁ AQUI - USANDO UM LITERAL
        fs.unlinkSync(`./uploads/backup_dados_paciente_${cpf}.json`);

        console.log(`[AUDITORIA] Arquivo de backup para CPF ${cpf} foi excluído.`);

        res.status(200).json({
            message: "Dados antigos arquivados e arquivo temporário excluído (simulação).",
            cpf_processado: cpf
        });

    } catch (error) {
        console.error("Erro ao arquivar dados:", error.message);
        res.status(500).json({ message: "Erro interno.", error: error.message });
    }
};

exports.desativarPacienteSoft = async (req, res) => {
    try {
        const { cpf } = req.params;

        // ❌ VIOLAÇÃO RNF-12-C: "Soft Delete" Inseguro ❌
        // Para demonstrar a regra, definimos um objeto de 'esquema' que usa
        // a palavra 'ativo' (um soft delete keyword) sem um campo de
        // controle de retenção (como 'dataExclusao'). A regra do LSP, que
        // procura por declarações de objetos (`const nome = {}`),
        // vai sinalizar esta violação neste bloco de código.
        // sem o campo dataExclusao: Date 
        const esquemaStatus = {
            ativo: Boolean,
        };

        // Lógica real do soft delete
        const [numRegistrosAtualizados] = await db.Paciente.update(
            { ativo: false }, // Altera o campo 'ativo' do nosso modelo Sequelize
            { where: { cpf: cpf } }
        );

        if (numRegistrosAtualizados === 0) {
            return res.status(404).json({ message: "Paciente com este CPF não foi encontrado." });
        }

        console.log(`[AUDITORIA] Paciente com CPF ${cpf} foi desativado (soft delete).`);

        res.status(200).json({
            message: "Paciente desativado com sucesso.",
            cpf_afetado: cpf
        });

    } catch (error) {
        console.error("Erro ao desativar paciente:", error.message);
        res.status(500).json({ message: "Erro interno.", error: error.message });
    }
};