// Cria e exporta a lista de alunos usada como banco de dados em memória.
export const alunos = [
  // Primeiro aluno inicial do sistema.
  {
    id: 1,
    nome: "Ana Souza",
    email: "ana.souza@email.com"
  },

  // Segundo aluno inicial do sistema.
  {
    id: 2,
    nome: "Carlos Lima",
    email: "carlos.lima@email.com"
  },

  // Terceiro aluno inicial do sistema.
  {
    id: 3,
    nome: "Mariana Alves",
    email: "mariana.alves@email.com"
  },
  {
    id: 4,
    nome: "Teste",
    email: "Teste@email.com"
  },
  {
    id: 5,
    nome: "revre",
    email: "vrevreve@email.com"
  }
];

// Cria e exporta a lista de cursos usada como banco de dados em memória.
export const cursos = [
  // Primeiro curso inicial.
  {
    id: 1,
    titulo: "Programação I",
    codigo: "PROG1"
  },

  // Segundo curso inicial.
  {
    id: 2,
    titulo: "Desenvolvimento Web II",
    codigo: "DW2"
  },

  // Terceiro curso inicial.
  {
    id: 3,
    titulo: "Banco de Dados",
    codigo: "BD"
  }
];

// Cria e exporta a lista de turmas usada como banco de dados em memória.
export const turmas = [
  // Primeira turma, vinculada ao curso de id 1.
  {
    id: 1,
    semestre: "2026/1",
    letra: "A",
    curso_id: 1
  },

  // Segunda turma, vinculada ao curso de id 2.
  {
    id: 2,
    semestre: "2026/1",
    letra: "B",
    curso_id: 2
  },

  // Terceira turma, vinculada ao curso de id 3.
  {
    id: 3,
    semestre: "2026/1",
    letra: "C",
    curso_id: 3
  }
];

// Cria e exporta a lista de matrículas usada como banco de dados em memória.
export const matriculas = [
  // Matrícula que relaciona o aluno 1 com a turma 1.
  {
    id: 1,
    aluno_id: 1,
    turma_id: 1
  },

  // Matrícula que relaciona o aluno 2 com a turma 2.
  {
    id: 2,
    aluno_id: 2,
    turma_id: 2
  }
];
