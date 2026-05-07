// Importa o Express para criar as rotas.
import express from "express";

// Importa cursos e turmas do banco de dados em memória.
import { cursos, turmas } from "../db/data.js";

// Importa funções auxiliares para respostas HTTP.
import { http } from "../utils/http.js";

// Importa a função que valida dados de cursos.
import { validarCurso } from "../validators/cursos.js";

// Cria e exporta o roteador de cursos.
export const router = express.Router();

// Cria a rota GET /cursos para listar ou buscar cursos.
router.get("/", (req, res) => {
  // Captura o parâmetro q da URL, usado para busca.
  const { q } = req.query;

  // Começa usando a lista completa de cursos.
  let lista = cursos;

  // Verifica se existe termo de busca.
  if (q) {
    // Converte o termo para letras minúsculas.
    const termo = String(q).toLowerCase();

    // Filtra cursos pelo título ou pelo código.
    lista = lista.filter((curso) =>
      (curso.titulo + " " + curso.codigo).toLowerCase().includes(termo)
    );
  }

  // Retorna a lista de cursos.
  return http.ok(res, lista);
});

// Cria a rota GET /cursos/:id para buscar um curso pelo id.
router.get("/:id", (req, res) => {
  // Converte o id da URL para número.
  const id = Number(req.params.id);

  // Procura o curso com o id informado.
  const curso = cursos.find((item) => item.id === id);

  // Verifica se o curso não foi encontrado.
  if (!curso) {
    // Retorna erro 404.
    return http.notFound(res, "Curso não encontrado");
  }

  // Retorna o curso encontrado.
  return http.ok(res, curso);
});

// Cria a rota POST /cursos para cadastrar um curso.
router.post("/", (req, res) => {
  // Extrai título e código do corpo da requisição.
  const { titulo, codigo } = req.body || {};

  // Valida os dados recebidos.
  const erros = validarCurso({ titulo, codigo });

  // Verifica se houve erro de validação.
  if (erros.length) {
    // Retorna erro 400.
    return http.badRequest(res, erros.join("; "));
  }

  // Verifica se já existe curso com o mesmo código.
  const codigoDuplicado = cursos.some((item) => item.codigo === codigo);

  // Verifica se o código está duplicado.
  if (codigoDuplicado) {
    // Retorna erro 409.
    return http.conflict(res, "Código já cadastrado");
  }

  // Gera um novo id maior que o maior id atual.
  const id = cursos.length ? Math.max(...cursos.map((item) => item.id)) + 1 : 1;

  // Cria o novo curso.
  const novoCurso = {
    id,
    titulo,
    codigo
  };

  // Adiciona o novo curso ao array.
  cursos.push(novoCurso);

  // Retorna o curso criado.
  return http.created(res, novoCurso);
});

// Cria a rota PUT /cursos/:id para editar um curso.
router.put("/:id", (req, res) => {
  // Converte o id da URL para número.
  const id = Number(req.params.id);

  // Procura a posição do curso no array.
  const index = cursos.findIndex((item) => item.id === id);

  // Verifica se o curso não foi encontrado.
  if (index === -1) {
    // Retorna erro 404.
    return http.notFound(res, "Curso não encontrado");
  }

  // Extrai título e código do corpo da requisição.
  const { titulo, codigo } = req.body || {};

  // Valida os dados recebidos.
  const erros = validarCurso({ titulo, codigo });

  // Verifica se houve erro de validação.
  if (erros.length) {
    // Retorna erro 400.
    return http.badRequest(res, erros.join("; "));
  }

  // Verifica se outro curso já possui o mesmo código.
  const codigoDuplicado = cursos.some((item) => item.codigo === codigo && item.id !== id);

  // Verifica se o código está duplicado.
  if (codigoDuplicado) {
    // Retorna erro 409.
    return http.conflict(res, "Código já cadastrado");
  }

  // Atualiza o curso no array.
  cursos[index] = {
    id,
    titulo,
    codigo
  };

  // Retorna o curso atualizado.
  return http.ok(res, cursos[index]);
});

// Cria a rota DELETE /cursos/:id para excluir um curso.
router.delete("/:id", (req, res) => {
  // Converte o id da URL para número.
  const id = Number(req.params.id);

  // Procura a posição do curso no array.
  const index = cursos.findIndex((item) => item.id === id);

  // Verifica se o curso não foi encontrado.
  if (index === -1) {
    // Retorna erro 404.
    return http.notFound(res, "Curso não encontrado");
  }

  // Verifica se o curso possui turma vinculada.
  const cursoTemTurma = turmas.some((item) => item.curso_id === id);

  // Impede excluir curso que possui turma vinculada.
  if (cursoTemTurma) {
    // Retorna erro 409.
    return http.conflict(res, "Não é possível excluir curso com turma vinculada");
  }

  // Remove o curso do array.
  cursos.splice(index, 1);

  // Retorna status 204, sem conteúdo.
  return http.noContent(res);
});
