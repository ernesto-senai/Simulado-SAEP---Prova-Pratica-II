// Tela: Cadastro de evento (também usada para editar um evento)

const formEvento = document.getElementById('form-evento');
const tituloPagina = document.getElementById('titulo-pagina');
const campoNome = document.getElementById('nome');
const campoDescricao = document.getElementById('descricao');
const campoLocal = document.getElementById('local');
const campoPalestrante = document.getElementById('palestrante');

// Se a URL tiver ?id=5, a tela está em modo de edição do evento 5
const idEvento = new URLSearchParams(window.location.search).get('id');

limparErroAoDigitar(formEvento);

// Busca os palestrantes cadastrados no banco e monta o <select>
async function carregarPalestrantes() {
  const resposta = await fetch('/api/palestrantes');
  if (!resposta.ok) throw new Error('Não foi possível carregar os palestrantes.');
  const palestrantes = await resposta.json();

  campoPalestrante.innerHTML = '';

  const opcaoInicial = document.createElement('option');
  opcaoInicial.value = '';
  opcaoInicial.textContent = palestrantes.length
    ? 'Selecione um palestrante'
    : 'Nenhum palestrante cadastrado';
  campoPalestrante.appendChild(opcaoInicial);

  palestrantes.forEach((p) => {
    const opcao = document.createElement('option');
    opcao.value = p.id_palestrante;
    opcao.textContent = p.nome;
    campoPalestrante.appendChild(opcao);
  });
}

// Preenche o formulário com os dados do evento que será editado
async function carregarEvento(id) {
  const resposta = await fetch(`/api/eventos/${encodeURIComponent(id)}`);
  if (!resposta.ok) throw new Error('Evento não encontrado.');
  const evento = await resposta.json();

  campoNome.value = evento.nome;
  campoDescricao.value = evento.descricao;
  campoLocal.value = evento.local_evento;
  campoPalestrante.value = String(evento.id_palestrante);

  tituloPagina.textContent = 'Editar evento';
  document.title = 'Editar evento | Gerenciador de eventos';
}

async function iniciar() {
  try {
    await carregarPalestrantes();
    if (idEvento) await carregarEvento(idEvento);
  } catch (erro) {
    alert(erro.message);
    if (idEvento) window.location.href = 'index.html';
  }
}

formEvento.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!validarObrigatorios(formEvento)) return;

  const dados = {
    nome: campoNome.value.trim(),
    descricao: campoDescricao.value.trim(),
    local_evento: campoLocal.value.trim(),
    id_palestrante: Number(campoPalestrante.value)
  };

  const botao = formEvento.querySelector('button[type="submit"]');
  botao.disabled = true;

  try {
    if (idEvento) {
      // Edição: atualiza o mesmo registro (UPDATE), não cria um novo
      await enviarJSON(`/api/eventos/${encodeURIComponent(idEvento)}`, 'PUT', dados);
      alert('Evento atualizado com sucesso');
      window.location.href = 'index.html';
    } else {
      // Novo cadastro (INSERT)
      await enviarJSON('/api/eventos', 'POST', dados);
      alert('Cadastro concluído com sucesso');
      formEvento.reset();
      campoNome.focus();
    }
  } catch (erro) {
    alert(erro.message);
  } finally {
    botao.disabled = false;
  }
});

iniciar();
