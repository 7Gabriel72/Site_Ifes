// Cria e exporta uma função para validar os dados de uma turma.
export function validarTurma({ semestre, letra, curso_id }) {
  // Cria uma lista vazia para guardar mensagens de erro.
  const erros = [];

  // Verifica se o semestre não foi informado ou possui menos de 4 caracteres.
  if (!semestre || String(semestre).trim().length < 4) {
    // Adiciona uma mensagem de erro sobre o semestre.
    erros.push("Semestre inválido");
  }

  // Verifica se a letra da turma não foi informada.
  if (!letra || String(letra).trim().length < 1) {
    // Adiciona uma mensagem de erro sobre a letra.
    erros.push("Letra da turma obrigatória");
  }

  // Verifica se o curso_id não foi informado ou é menor ou igual a zero.
  if (!curso_id || Number(curso_id) <= 0) {
    // Adiciona uma mensagem de erro sobre o curso.
    erros.push("Curso obrigatório");
  }

  // Retorna a lista de erros encontrados.
  return erros;
}
