document.addEventListener('DOMContentLoaded', iniciarFormulario);

const parametros = new URLSearchParams(window.location.search);
const idEdicao = parametros.get('id');

const formulario = document.getElementById('form-ponto');
const mensagemForm = document.getElementById('mensagem');
const botaoSalvar = document.getElementById('botao-salvar');

async function iniciarFormulario() {

    if (!idEdicao) return;

    document.getElementById('titulo-formulario').textContent =
        'Editar ponto';

    botaoSalvar.textContent = 'Salvar alterações';

    mostrarMensagem(
        mensagemForm,
        'Carregando dados do ponto...',
        'info'
    );

    try {

        const ponto = await buscarPonto(idEdicao);

        document.getElementById('name').value = ponto.name ?? '';
        document.getElementById('description').value = ponto.description ?? '';
        document.getElementById('latitude').value = ponto.latitude ?? '';
        document.getElementById('longitude').value = ponto.longitude ?? '';

        ocultarMensagem(mensagemForm);

    } catch (erro) {

        mostrarMensagem(
            mensagemForm,
            'Não foi possível carregar o ponto. ' + erro.message,
            'error'
        );

        botaoSalvar.disabled = true;

    }

}

formulario.addEventListener('submit', async evento => {

    evento.preventDefault();

    ocultarMensagem(mensagemForm);

    const nome = document.getElementById('name').value.trim();
    const descricao = document.getElementById('description').value.trim();

    const latitudeTexto = document.getElementById('latitude').value;
    const longitudeTexto = document.getElementById('longitude').value;

    const latitude = Number(latitudeTexto);
    const longitude = Number(longitudeTexto);

    if (!nome) {
        mostrarMensagem(mensagemForm, 'O nome é obrigatório.', 'error');
        return;
    }

    if (nome.length > 100) {
        mostrarMensagem(mensagemForm, 'O nome deve ter no máximo 100 caracteres.', 'error');
        return;
    }

    if (descricao.length > 255) {
        mostrarMensagem(mensagemForm, 'A descrição deve ter no máximo 255 caracteres.', 'error');
        return;
    }

    if (
        latitudeTexto === '' ||
        !Number.isFinite(latitude) ||
        latitude < -90 ||
        latitude > 90
    ) {
        mostrarMensagem(mensagemForm, 'Informe uma latitude válida.', 'error');
        return;
    }

    if (
        longitudeTexto === '' ||
        !Number.isFinite(longitude) ||
        longitude < -180 ||
        longitude > 180
    ) {
        mostrarMensagem(mensagemForm, 'Informe uma longitude válida.', 'error');
        return;
    }

    const ponto = {
        name: nome,
        description: descricao,
        latitude: latitude,
        longitude: longitude
    };

    botaoSalvar.disabled = true;
    botaoSalvar.textContent = 'Salvando...';

    try {

        if (idEdicao) {
            await atualizarPonto(idEdicao, ponto);
        } else {
            await criarPonto(ponto);
        }

        window.location.href = 'index.html';

    } catch (erro) {

        mostrarMensagem(
            mensagemForm,
            'Não foi possível salvar. ' + erro.message,
            'error'
        );

        botaoSalvar.disabled = false;

        botaoSalvar.textContent = idEdicao
            ? 'Salvar alterações'
            : 'Salvar ponto';

    }

});