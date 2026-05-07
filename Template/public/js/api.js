// Cria uma função para buscar dados da API e converter a resposta em JSON.
async function buscarJSON(url, opcoes = {}) {
  // Faz a requisição para a URL recebida.
  const resposta = await fetch(url, opcoes);

  // Lê o corpo da resposta como texto.
  const texto = await resposta.text();

  // Converte o texto para JSON quando existe conteúdo.
  const dados = texto ? JSON.parse(texto) : null;

  // Verifica se a resposta da API não foi bem-sucedida.
  if (!resposta.ok) {
    // Lança um erro com a mensagem retornada pela API.
    throw new Error(dados?.erro || "Erro na requisição");
  }

  // Retorna os dados convertidos.
  return dados;
}

// Cria uma função para mostrar mensagens na tela.
function mostrarMensagem(id, texto, tipo = "sucesso") {
  // Busca o elemento HTML pelo id.
  const elemento = document.getElementById(id);

  // Encerra a função se o elemento não existir.
  if (!elemento) return;

  // Define o texto da mensagem.
  elemento.textContent = texto;

  // Define a classe CSS da mensagem.
  elemento.className = `mensagem ${tipo}`;
}

// Cria uma função para mostrar JSON formatado na tela.
function mostrarPre(id, dados) {
  // Busca o elemento HTML pelo id.
  const elemento = document.getElementById(id);

  // Encerra a função se o elemento não existir.
  if (!elemento) return;

  // Mostra os dados em formato JSON com indentação.
  elemento.textContent = JSON.stringify(dados, null, 2);
}
