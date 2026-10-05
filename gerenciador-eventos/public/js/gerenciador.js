// Tela: Gerenciador de evento (primeira tela da aplicação)

const listaEventos = document.getElementById('lista-eventos');
const aviso = document.getElementById('aviso');

function mostrarAviso(texto) {
  aviso.textContent = texto;
  aviso.hidden = !texto;
}

// Busca os eventos no banco e monta um card para cada um
async function carregarEventos() {
  try {
    const resposta = await fetch('/api/eventos');
    if (!resposta.ok) throw new Error();
    const eventos = await resposta.json();

    listaEventos.innerHTML = '';
    mostrarAviso(eventos.length ? '' : 'Nenhum evento cadastrado. Use o menu "Cadastro de evento" para criar o primeiro.');

    eventos.forEach((evento) => {
      const card = document.createElement('article');
      card.className = 'card-evento';
      card.innerHTML = `
        <p><strong>nome:</strong> ${esc(evento.nome)}</p>
        <p><strong>descrição:</strong> ${esc(evento.descricao)}</p>
        <p><strong>local:</strong> ${esc(evento.local_evento)}</p>
        <p><strong>palestrante:</strong> ${esc(evento.palestrante)}</p>
        <div class="acoes">
          <button type="button" class="btn btn-acao" data-acao="editar">Editar</button>
          <button type="button" class="btn btn-acao" data-acao="excluir">Excluir</button>
        </div>
      `;

      // Editar: abre o cadastro de evento já preenchido
      card.querySelector('[data-acao="editar"]').addEventListener('click', () => {
        window.location.href = `cadastro-evento.html?id=${evento.id_evento}`;
      });

      // Excluir: pede confirmação antes de apagar do banco
      card.querySelector('[data-acao="excluir"]').addEventListener('click', () => {
        excluirEvento(evento);
      });

      listaEventos.appendChild(card);
    });
  } catch (erro) {
    mostrarAviso('Não foi possível carregar os eventos. Verifique se o servidor e o MySQL estão rodando.');
  }
}

async function excluirEvento(evento) {
  const confirmou = confirm(`Deseja realmente excluir o evento "${evento.nome}"?`);
  if (!confirmou) return;

  try {
    const resposta = await enviarJSON(`/api/eventos/${evento.id_evento}`, 'DELETE');
    alert(resposta.mensagem);
    carregarEventos();
  } catch (erro) {
    alert(erro.message);
  }
}

carregarEventos();
