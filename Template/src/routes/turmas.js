// Importa o Express para criar as rotas.
import express from "express";

// Importa turmas, cursos e matrículas do banco de dados em memória.
import { turmas, cursos, matriculas } from "../db/data.js";

// Importa funções auxiliares para respostas HTTP.
import { http } from "../utils/http.js";

// Importa a função que valida dados de turmas.
import { validarTurma } from "../validators/turmas.js";

// Cria e exporta o roteador de turmas.
export const router = express.Router();

// Cria uma função auxiliar para montar uma turma com dados do curso.
function montarTurmaCompleta(turma) {
  // Procura o curso vinculado à turma.
  const curso = cursos.find((item) => item.id === turma.curso_id);

  // Retorna um objeto com dados da turma e do curso.
  return {
    id: turma.id,
    semestre: turma.semestre,
    letra: turma.letra,
    curso_id: turma.curso_id,
    curso: curso ? curso.titulo : "Curso não encontrado",
    codigo: curso ? curso.codigo : "-"
  };
}

// Cria a rota GET /turmas para listar ou buscar turmas.
router.get("/", (req, res) => {
  // Captura o parâmetro q da URL, usado para busca.
  const { q } = req.query;

  // Monta uma lista de turmas com dados completos.
  let lista = turmas.map(montarTurmaCompleta);

  // Verifica se existe termo de busca.
  if (q) {
    // Converte o termo para letras minúsculas.
    const termo = String(q).toLowerCase();

    // Filtra por semestre, letra ou nome do curso.
    lista = lista.filter((turma) =>
      (turma.semestre + " " + turma.letra + " " + turma.curso).toLowerCase().includes(termo)
    );
  }

  // Retorna a lista.
  return http.ok(res, lista);
});

// Cria a rota GET /turmas/:id para buscar uma turma pelo id.
router.get("/:id", (req, res) => {
  // Converte o id da URL para número.
  const id = Number(req.params.id);

  // Procura a turma pelo id.
  const turma = turmas.find((item) => item.id === id);

  // Verifica se a turma não foi encontrada.
  if (!turma) {
    // Retorna erro 404.
    return http.notFound(res, "Turma não encontrada");
  }

  // Retorna a turma com dados completos.
  return http.ok(res, montarTurmaCompleta(turma));
});

// Cria a rota POST /turmas para cadastrar uma turma.
router.post("/", (req, res) => {
  // Extrai semestre, letra e curso_id do corpo da requisição.
  const { semestre, letra, curso_id } = req.body || {};

  // Valida os dados recebidos.
  const erros = validarTurma({ semestre, letra, curso_id });

  // Verifica se houve erro de validação.
  if (erros.length) {
    // Retorna erro 400.
    return http.badRequest(res, erros.join("; "));
  }

  // Converte curso_id para número.
  const cursoIdNumero = Number(curso_id);

  // Verifica se o curso informado existe.
  const cursoExiste = cursos.some((item) => item.id === cursoIdNumero);

  // Verifica se o curso não existe.
  if (!cursoExiste) {
    // Retorna erro 404.
    return http.notFound(res, "Curso não encontrado");
  }

  // Verifica se já existe turma igual para o mesmo curso.
  const duplicada = turmas.some(
    (item) => item.semestre === semestre && item.letra === letra && item.curso_id === cursoIdNumero
  );

  // Verifica se a turma está duplicada.
  if (duplicada) {
    // Retorna erro 409.
    return http.conflict(res, "Turma já cadastrada para este curso");
  }

  // Gera um novo id maior que o maior id atual.
  const id = turmas.length ? Math.max(...turmas.map((item) => item.id)) + 1 : 1;

  // Cria a nova turma.
  const novaTurma = {
    id,
    semestre,
    letra,
    curso_id: cursoIdNumero
  };

  // Adiciona a nova turma ao array.
  turmas.push(novaTurma);

  // Retorna a turma criada com dados completos.
  return http.created(res, montarTurmaCompleta(novaTurma));
});

// Cria a rota PUT /turmas/:id para editar uma turma.
router.put("/:id", (req, res) => {
  // Converte o id da URL para número.
  const id = Number(req.params.id);

  // Procura a posição da turma no array.
  const index = turmas.findIndex((item) => item.id === id);

  // Verifica se a turma não foi encontrada.
  if (index === -1) {
    // Retorna erro 404.
    return http.notFound(res, "Turma não encontrada");
  }

  // Extrai semestre, letra e curso_id do corpo da requisição.
  const { semestre, letra, curso_id } = req.body || {};

  // Valida os dados recebidos.
  const erros = validarTurma({ semestre, letra, curso_id });

  // Verifica se houve erro de validação.
  if (erros.length) {
    // Retorna erro 400.
    return http.badRequest(res, erros.join("; "));
  }

  // Converte curso_id para número.
  const cursoIdNumero = Number(curso_id);

  // Verifica se o curso informado existe.
  const cursoExiste = cursos.some((item) => item.id === cursoIdNumero);

  // Verifica se o curso não existe.
  if (!cursoExiste) {
    // Retorna erro 404.
    return http.notFound(res, "Curso não encontrado");
  }

  // Atualiza a turma no array.
  turmas[index] = {
    id,
    semestre,
    letra,
    curso_id: cursoIdNumero
  };

  // Retorna a turma atualizada com dados completos.
  return http.ok(res, montarTurmaCompleta(turmas[index]));
});

// Cria a rota DELETE /turmas/:id para excluir uma turma.
router.delete("/:id", (req, res) => {
  // Converte o id da URL para número.
  const id = Number(req.params.id);

  // Procura a posição da turma no array.
  const index = turmas.findIndex((item) => item.id === id);

  // Verifica se a turma não foi encontrada.
  if (index === -1) {
    // Retorna erro 404.
    return http.notFound(res, "Turma não encontrada");
  }

  // Verifica se a turma possui matrícula ativa.
  const turmaTemMatricula = matriculas.some((item) => item.turma_id === id);

  // Impede excluir turma que possui matrícula.
  if (turmaTemMatricula) {
    // Retorna erro 409.
    return http.conflict(res, "Não é possível excluir turma com matrícula ativa");
  }

  // Remove a turma do array.
  turmas.splice(index, 1);

  // Retorna status 204, sem conteúdo.
  return http.noContent(res);
});
