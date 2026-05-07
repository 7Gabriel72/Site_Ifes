// Importa o Express para criar as rotas.
import express from "express";

// Importa alunos, cursos, turmas e matrículas do banco de dados em memória.
import { alunos, cursos, turmas, matriculas } from "../db/data.js";

// Importa funções auxiliares para respostas HTTP.
import { http } from "../utils/http.js";

// Cria e exporta o roteador de matrículas.
export const router = express.Router();

// Cria uma função auxiliar para montar a matrícula com dados completos.
function montarMatriculaCompleta(matricula) {
  // Procura o aluno vinculado à matrícula.
  const aluno = alunos.find((item) => item.id === matricula.aluno_id);

  // Procura a turma vinculada à matrícula.
  const turma = turmas.find((item) => item.id === matricula.turma_id);

  // Procura o curso vinculado à turma.
  const curso = turma ? cursos.find((item) => item.id === turma.curso_id) : null;

  // Retorna a matrícula com dados do aluno, da turma e do curso.
  return {
    id: matricula.id,
    aluno_id: matricula.aluno_id,
    aluno: aluno ? aluno.nome : "Aluno não encontrado",
    turma_id: matricula.turma_id,
    turma: turma ? `${turma.semestre} - ${turma.letra}` : "Turma não encontrada",
    curso: curso ? curso.titulo : "Curso não encontrado"
  };
}

// Cria a rota GET /matriculas-turma para listar ou buscar matrículas.
router.get("/matriculas-turma", (req, res) => {
  // Captura o parâmetro q da URL, usado para busca.
  const { q } = req.query;

  // Monta a lista de matrículas com dados completos.
  let lista = matriculas.map(montarMatriculaCompleta);

  // Verifica se existe termo de busca.
  if (q) {
    // Converte o termo para letras minúsculas.
    const termo = String(q).toLowerCase();

    // Filtra por nome do aluno, turma ou curso.
    lista = lista.filter((matricula) =>
      (matricula.aluno + " " + matricula.turma + " " + matricula.curso).toLowerCase().includes(termo)
    );
  }

  // Retorna a lista.
  return http.ok(res, lista);
});

// Cria a rota GET /matriculas-turma/:id para buscar matrícula pelo id.
router.get("/matriculas-turma/:id", (req, res) => {
  // Converte o id da URL para número.
  const id = Number(req.params.id);

  // Procura a matrícula pelo id.
  const matricula = matriculas.find((item) => item.id === id);

  // Verifica se a matrícula não foi encontrada.
  if (!matricula) {
    // Retorna erro 404.
    return http.notFound(res, "Matrícula não encontrada");
  }

  // Retorna a matrícula com dados completos.
  return http.ok(res, montarMatriculaCompleta(matricula));
});

// Cria a rota GET /alunos/:id/turmas para listar matrículas de um aluno.
router.get("/alunos/:id/turmas", (req, res) => {
  // Converte o id do aluno recebido na URL para número.
  const alunoId = Number(req.params.id);

  // Verifica se o aluno existe.
  const alunoExiste = alunos.some((item) => item.id === alunoId);

  // Verifica se o aluno não existe.
  if (!alunoExiste) {
    // Retorna erro 404.
    return http.notFound(res, "Aluno não encontrado");
  }

  // Filtra as matrículas do aluno e monta os dados completos.
  const lista = matriculas
    .filter((item) => item.aluno_id === alunoId)
    .map(montarMatriculaCompleta);

  // Retorna a lista.
  return http.ok(res, lista);
});

// Cria a rota POST /matriculas-turma para cadastrar matrícula.
router.post("/matriculas-turma", (req, res) => {
  // Extrai aluno_id e turma_id do corpo da requisição.
  const { aluno_id, turma_id } = req.body || {};

  // Verifica se os campos obrigatórios foram enviados.
  if (!aluno_id || !turma_id) {
    // Retorna erro 400.
    return http.badRequest(res, "Campos obrigatórios: aluno_id e turma_id");
  }

  // Converte aluno_id para número.
  const alunoIdNumero = Number(aluno_id);

  // Converte turma_id para número.
  const turmaIdNumero = Number(turma_id);

  // Verifica se o aluno existe.
  const okAluno = alunos.some((item) => item.id === alunoIdNumero);

  // Verifica se a turma existe.
  const okTurma = turmas.some((item) => item.id === turmaIdNumero);

  // Verifica se aluno ou turma não existem.
  if (!okAluno || !okTurma) {
    // Retorna erro 404.
    return http.notFound(res, "Aluno ou turma inexistente");
  }

  // Verifica se a matrícula já existe.
  const duplicada = matriculas.some(
    (item) => item.aluno_id === alunoIdNumero && item.turma_id === turmaIdNumero
  );

  // Verifica se houve matrícula duplicada.
  if (duplicada) {
    // Retorna erro 409.
    return http.conflict(res, "Matrícula duplicada");
  }

  // Gera um novo id maior que o maior id atual.
  const id = matriculas.length ? Math.max(...matriculas.map((item) => item.id)) + 1 : 1;

  // Cria a nova matrícula.
  const novaMatricula = {
    id,
    aluno_id: alunoIdNumero,
    turma_id: turmaIdNumero
  };

  // Adiciona a nova matrícula ao array.
  matriculas.push(novaMatricula);

  // Retorna a matrícula criada com dados completos.
  return http.created(res, montarMatriculaCompleta(novaMatricula));
});

// Cria a rota PUT /matriculas-turma/:id para editar matrícula.
router.put("/matriculas-turma/:id", (req, res) => {
  // Converte o id da URL para número.
  const id = Number(req.params.id);

  // Procura a posição da matrícula no array.
  const index = matriculas.findIndex((item) => item.id === id);

  // Verifica se a matrícula não foi encontrada.
  if (index === -1) {
    // Retorna erro 404.
    return http.notFound(res, "Matrícula não encontrada");
  }

  // Extrai aluno_id e turma_id do corpo da requisição.
  const { aluno_id, turma_id } = req.body || {};

  // Verifica se os campos obrigatórios foram enviados.
  if (!aluno_id || !turma_id) {
    // Retorna erro 400.
    return http.badRequest(res, "Campos obrigatórios: aluno_id e turma_id");
  }

  // Converte aluno_id para número.
  const alunoIdNumero = Number(aluno_id);

  // Converte turma_id para número.
  const turmaIdNumero = Number(turma_id);

  // Verifica se o aluno existe.
  const okAluno = alunos.some((item) => item.id === alunoIdNumero);

  // Verifica se a turma existe.
  const okTurma = turmas.some((item) => item.id === turmaIdNumero);

  // Verifica se aluno ou turma não existem.
  if (!okAluno || !okTurma) {
    // Retorna erro 404.
    return http.notFound(res, "Aluno ou turma inexistente");
  }

  // Verifica se já existe outra matrícula igual.
  const duplicada = matriculas.some(
    (item) =>
      item.aluno_id === alunoIdNumero &&
      item.turma_id === turmaIdNumero &&
      item.id !== id
  );

  // Verifica se a matrícula está duplicada.
  if (duplicada) {
    // Retorna erro 409.
    return http.conflict(res, "Matrícula duplicada");
  }

  // Atualiza a matrícula no array.
  matriculas[index] = {
    id,
    aluno_id: alunoIdNumero,
    turma_id: turmaIdNumero
  };

  // Retorna a matrícula atualizada com dados completos.
  return http.ok(res, montarMatriculaCompleta(matriculas[index]));
});

// Cria a rota DELETE /matriculas-turma/:id para excluir matrícula.
router.delete("/matriculas-turma/:id", (req, res) => {
  // Converte o id da URL para número.
  const id = Number(req.params.id);

  // Procura a posição da matrícula no array.
  const index = matriculas.findIndex((item) => item.id === id);

  // Verifica se a matrícula não foi encontrada.
  if (index === -1) {
    // Retorna erro 404.
    return http.notFound(res, "Matrícula não encontrada");
  }

  // Remove a matrícula do array.
  matriculas.splice(index, 1);

  // Retorna status 204, sem conteúdo.
  return http.noContent(res);
});
