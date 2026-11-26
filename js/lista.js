document.addEventListener('DOMContentLoaded', carregarLista);

let pontos = [];

const corpoTabela = document.getElementById('tabela-pontos');
const campoFiltro = document.getElementById('filtro');
const mensagem = document.getElementById('mensagem');
const contador = document.getElementById('total-pontos');
const resultadoFiltro = document.getElementById('resultado-filtro');

async function carregarLista() {

    mostrarMensagem(mensagem, 'Carregando pontos...', 'info');

    try {

        pontos = await listarPontos();

        if (!Array.isArray(pontos)) {
            throw new Error('A API não retornou uma lista válida.');
        }

        ocultarMensagem(mensagem);
        renderizarPontos();

    } catch (erro) {

        mostrarMensagem(
            mensagem,
            'Não foi possível carregar os pontos. ' + erro.message,
            'error'
        );

        corpoTabela.replaceChildren();

    }

}

function renderizarPontos() {

    const termo = campoFiltro.value.trim().toLowerCase();

    const filtrados = pontos.filter(ponto =>
        String(ponto.name || '').toLowerCase().includes(termo) ||
        String(ponto.description || '').toLowerCase().includes(termo)
    );

    contador.textContent = pontos.length + ' pontos';

    corpoTabela.replaceChildren();

    if (filtrados.length === 0) {

        const linha = document.createElement('tr');
        const celula = document.createElement('td');

        celula.colSpan = 5;

        celula.textContent = pontos.length
            ? 'Nenhum ponto encontrado para esta busca.'
            : 'Nenhum ponto cadastrado.';

        linha.append(celula);
        corpoTabela.append(linha);

        resultadoFiltro.textContent = '';

        return;
    }

    filtrados.forEach(ponto => {

        const linha = document.createElement('tr');

        const nome = document.createElement('td');
        const linkNome = document.createElement('a');

        linkNome.className = 'point-name';
        linkNome.href = 'ponto.html?id=' + encodeURIComponent(ponto.id);
        linkNome.textContent = ponto.name;

        nome.append(linkNome);

        const descricao = document.createElement('td');
        descricao.textContent = ponto.description || '—';

        const latitude = document.createElement('td');
        latitude.textContent = formatarCoordenada(ponto.latitude);

        const longitude = document.createElement('td');
        longitude.textContent = formatarCoordenada(ponto.longitude);

        const acoes = document.createElement('td');
        const grupo = document.createElement('div');

        grupo.className = 'actions';

        const ver = document.createElement('a');
        ver.className = 'action-link';
        ver.href = linkNome.href;
        ver.textContent = 'Ver';

        const editar = document.createElement('a');
        editar.className = 'action-link';
        editar.href = 'formulario.html?id=' + encodeURIComponent(ponto.id);
        editar.textContent = 'Editar';

        grupo.append(
            ver,
            editar,
            criarBotaoAcao('Excluir', 'delete', () => excluirDaLista(ponto))
        );

        acoes.append(grupo);

        linha.append(
            nome,
            descricao,
            latitude,
            longitude,
            acoes
        );

        corpoTabela.append(linha);

    });

    resultadoFiltro.textContent =
        'Exibindo ' + filtrados.length + ' de ' + pontos.length + ' registros.';

}

async function excluirDaLista(ponto) {

    if (!confirm('Deseja realmente excluir "' + ponto.name + '"?')) {
        return;
    }

    try {

        await excluirPonto(ponto.id);

        pontos = pontos.filter(item => item.id !== ponto.id);

        renderizarPontos();

        mostrarMensagem(
            mensagem,
            'Ponto excluído com sucesso.',
            'success'
        );

    } catch (erro) {

        mostrarMensagem(
            mensagem,
            'Não foi possível excluir o ponto. ' + erro.message,
            'error'
        );

    }

}

campoFiltro.addEventListener('input', renderizarPontos);