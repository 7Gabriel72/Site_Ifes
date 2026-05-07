// Cria e exporta uma função para validar os dados de um aluno.
export function validarAluno({ nome, email }) {
  // Cria uma lista vazia para guardar mensagens de erro.
  const erros = [];

  // Verifica se o nome não foi informado ou possui menos de 3 caracteres.
  if (!nome || nome.trim().length < 3) {
    // Adiciona uma mensagem de erro sobre o nome.
    erros.push("Nome deve ter pelo menos 3 caracteres");
  }

  // Verifica se o e-mail não foi informado ou não possui o caractere @.
  if (!email || !email.includes("@")) {
    // Adiciona uma mensagem de erro sobre o e-mail.
    erros.push("Email inválido");
  }

  // Retorna a lista de erros encontrados.
  return erros;
}
