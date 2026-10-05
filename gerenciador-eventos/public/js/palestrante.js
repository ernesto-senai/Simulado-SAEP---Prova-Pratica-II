// Tela: Cadastro de palestrantes

const formPalestrante = document.getElementById('form-palestrante');
const inputNome = document.getElementById('nome');
const inputEmail = document.getElementById('email');

limparErroAoDigitar(formPalestrante);

formPalestrante.addEventListener('submit', async (e) => {
  e.preventDefault();

  // 1) Todos os campos preenchidos
  let valido = validarObrigatorios(formPalestrante);

  // 2) E-mail válido
  const email = inputEmail.value.trim();
  if (email !== '' && !EMAIL_REGEX.test(email)) {
    definirErro(inputEmail, 'Digite um e-mail válido, por exemplo: nome@dominio.com');
    if (valido) inputEmail.focus();
    valido = false;
  }

  if (!valido) return;

  const botao = formPalestrante.querySelector('button[type="submit"]');
  botao.disabled = true;

  try {
    await enviarJSON('/api/palestrantes', 'POST', {
      nome: inputNome.value.trim(),
      email
    });
    alert('Cadastro concluído com sucesso');
    formPalestrante.reset();
    inputNome.focus();
  } catch (erro) {
    alert(erro.message);
  } finally {
    botao.disabled = false;
  }
});
