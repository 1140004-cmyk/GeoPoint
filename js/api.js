const API_BASE_URL = 'https://geopoint-6x4u.onrender.com'
async function tratarResposta(resposta) {
    if (resposta.status === 204) {
        return null;
    }

    const texto = await resposta.text();
    let dados = null;

    if (texto) {
        try {
            dados = JSON.parse(texto);
        } catch {
            dados = texto;
        }
    }

    if (!resposta.ok) {
        throw new Error(
            dados?.message ||
            dados?.error ||
            `Erro HTTP ${resposta.status}`
        );
    }

    return dados;
}

async function requisicao(url, opcoes = {}) {
    try {
        const resposta = await fetch(url, {
            ...opcoes,
            headers: {
                ...(opcoes.body
                    ? { 'Content-Type': 'application/json' }
                    : {}),
                ...opcoes.headers
            }
        });

        return await tratarResposta(resposta);

    } catch (erro) {
        console.error('Erro na API:', erro);

        if (erro instanceof TypeError) {
            throw new Error(
                'Não foi possível conectar ao servidor. Verifique se a API está ligada e se o CORS está configurado.'
            );
        }

        throw erro;
    }
}

// LISTAR PONTOS
async function listarPontos() {
    return requisicao(`${API_BASE_URL}/api/points`);
}

// BUSCAR PONTO
async function buscarPonto(id) {
    return requisicao(`${API_BASE_URL}/api/points/${id}`);
}

// CRIAR PONTO
async function criarPonto(ponto) {
    return requisicao(`${API_BASE_URL}/api/points`, {
        method: 'POST',
        body: JSON.stringify(ponto)
    });
}

// ATUALIZAR PONTO
async function atualizarPonto(id, ponto) {
    return requisicao(`${API_BASE_URL}/api/points/${id}`, {
        method: 'PUT',
        body: JSON.stringify(ponto)
    });
}

// EXCLUIR PONTO
async function excluirPonto(id) {
    return requisicao(`${API_BASE_URL}/api/points/${id}`, {
        method: 'DELETE'
    });
}