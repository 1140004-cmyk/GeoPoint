function mostrarMensagem(elemento, texto, tipo = 'info') {

    elemento.textContent = texto;
    elemento.className = 'message ' + tipo;

}

function ocultarMensagem(elemento) {

    elemento.textContent = '';
    elemento.className = 'message hidden';

}

function criarBotaoAcao(texto, classe, acao) {

    const botao = document.createElement('button');

    botao.type = 'button';
    botao.className = 'action-button ' + (classe || '');
    botao.textContent = texto;

    botao.addEventListener('click', acao);

    return botao;

}

function formatarCoordenada(valor) {

    return Number(valor).toFixed(5);

}
