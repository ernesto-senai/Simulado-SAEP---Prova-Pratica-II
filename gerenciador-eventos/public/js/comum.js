// Funções compartilhadas entre as telas

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Evita que textos vindos do banco sejam interpretados como HTML
function esc(texto) {
  return String(texto ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Mostra (ou limpa) a mensagem de erro abaixo de um campo
function definirErro(campo, mensagem) {
  const span = document.getElementById(`erro-${campo.id}`);
  campo.classList.toggle('invalido', Boolean(mensagem));
  campo.setAttribute('aria-invalid', mensagem ? 'true' : 'false');
  if (span) span.textContent = mensagem || '';
}

// Verifica se todos os campos obrigatórios do formulário foram preenchidos
function validarObrigatorios(form) {
  let valido = true;
  let primeiroInvalido = null;

  form.querySelectorAll('[required]').forEach((campo) => {
    const estaVazio = campo.value.trim() === '';
    definirErro(campo, estaVazio ? 'Preencha este campo.' : '');
    if (estaVazio) {
      valido = false;
      primeiroInvalido = primeiroInvalido || campo;
    }
  });

  if (primeiroInvalido) primeiroInvalido.focus();
  return valido;
}

// Limpa o erro do campo assim que o usuário começa a corrigir
function limparErroAoDigitar(form) {
  form.addEventListener('input', (e) => definirErro(e.target, ''));
  form.addEventListener('change', (e) => definirErro(e.target, ''));
}

// Envia dados em JSON para a API e devolve a resposta
async function enviarJSON(url, metodo, dados) {
  const resposta = await fetch(url, {
    method: metodo,
    headers: { 'Content-Type': 'application/json' },
    body: dados ? JSON.stringify(dados) : undefined
  });
  const corpo = await resposta.json().catch(() => ({}));
  if (!resposta.ok) {
    throw new Error(corpo.mensagem || 'Não foi possível comunicar com o servidor.');
  }
  return corpo;
}
