// Cria e exporta uma função para validar os dados de um curso.
export function validarCurso({ titulo, codigo }) {
  // Cria uma lista vazia para guardar mensagens de erro.
  const erros = [];

  // Verifica se o título não foi informado ou possui menos de 2 caracteres.
  if (!titulo || String(titulo).trim().length < 2) {
    // Adiciona uma mensagem de erro sobre o título.
    erros.push("Título muito curto");
  }

  // Verifica se o código não foi informado ou possui menos de 2 caracteres.
  if (!codigo || String(codigo).trim().length < 2) {
    // Adiciona uma mensagem de erro sobre o código.
    erros.push("Código muito curto");
  }

  // Retorna a lista de erros encontrados.
  return erros;
}
