document.addEventListener('DOMContentLoaded', carregarDetalhe);

async function carregarDetalhe() {

    const id = new URLSearchParams(window.location.search).get('id');

    const mensagem = document.getElementById('mensagem');
    const areaDetalhes = document.getElementById('detalhes');

    if (!id) {

        mostrarMensagem(
            mensagem,
            'Nenhum identificador de ponto foi informado.',
            'error'
        );

        return;
    }

    mostrarMensagem(
        mensagem,
        'Carregando informações...',
        'info'
    );

    try {

        const ponto = await buscarPonto(id);

        document.getElementById('detalhe-nome').textContent =
            ponto.name || 'Ponto sem nome';

        document.getElementById('detalhe-descricao').textContent =
            ponto.description || 'Sem descrição cadastrada.';

        document.getElementById('detalhe-latitude').textContent =
            formatarCoordenada(ponto.latitude);

        document.getElementById('detalhe-longitude').textContent =
            formatarCoordenada(ponto.longitude);

        document.getElementById('detalhe-id').textContent =
            ponto.id;

        document.getElementById('editar').href =
            'formulario.html?id=' + encodeURIComponent(id);

        document.getElementById('excluir').addEventListener(
            'click',
            async () => {

                if (!confirm('Deseja realmente excluir "' + ponto.name + '"?')) {
                    return;
                }

                try {

                    await excluirPonto(id);

                    window.location.href = 'index.html';

                } catch (erro) {

                    mostrarMensagem(
                        mensagem,
                        'Não foi possível excluir o ponto. ' + erro.message,
                        'error'
                    );

                }

            }
        );

        ocultarMensagem(mensagem);

        areaDetalhes.classList.remove('hidden');

    } catch (erro) {

        mostrarMensagem(
            mensagem,
            'Não foi possível carregar o ponto. ' + erro.message,
            'error'
        );

    }

}