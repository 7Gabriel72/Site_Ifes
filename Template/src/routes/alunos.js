// Importa o Express para criar as rotas.
import express from "express";

// Importa alunos e matrículas do banco de dados em memória.
import { alunos, matriculas } from "../db/data.js";

// Importa funções auxiliares para respostas HTTP.
import { http } from "../utils/http.js";

// Importa a função que valida dados de alunos.
import { validarAluno } from "../validators/alunos.js";

// Cria e exporta o roteador de alunos.
export const router = express.Router();

// Cria a rota GET /alunos para listar ou buscar alunos.
router.get("/", (req, res) => {
  // Captura o parâmetro q da URL, usado para busca.
  const { q } = req.query;

  // Começa usando a lista completa de alunos.
  let lista = alunos;

  // Verifica se o usuário digitou algum termo de busca.
  if (q) {
    // Converte o termo buscado para letras minúsculas.
    const termo = String(q).toLowerCase();

    // Filtra alunos pelo nome ou pelo e-mail.
    lista = lista.filter((aluno) =>
      (aluno.nome + " " + aluno.email).toLowerCase().includes(termo)
    );
  }

  // Retorna a lista de alunos em formato JSON.
  return http.ok(res, lista);
});

// Cria a rota GET /alunos/:id para buscar um aluno específico.
router.get("/:id", (req, res) => {
  // Converte o id recebido na URL para número.
  const id = Number(req.params.id);

  // Procura o aluno com o id informado.
  const aluno = alunos.find((item) => item.id === id);

  // Verifica se o aluno não foi encontrado.
  if (!aluno) {
    // Retorna erro 404 se o aluno não existir.
    return http.notFound(res, "Aluno não encontrado");
  }

  // Retorna o aluno encontrado.
  return http.ok(res, aluno);
});

// Cria a rota POST /alunos para cadastrar um novo aluno.
router.post("/", (req, res) => {
  // Extrai nome e email enviados no corpo da requisição.
  const { nome, email } = req.body || {};

  // Valida os dados recebidos.
  const erros = validarAluno({ nome, email });

  // Verifica se a validação encontrou erros.
  if (erros.length) {
    // Retorna erro 400 com as mensagens de validação.
    return http.badRequest(res, erros.join("; "));
  }

  // Verifica se já existe aluno com o mesmo e-mail.
  const emailDuplicado = alunos.some((item) => item.email === email);

  // Verifica se o e-mail está duplicado.
  if (emailDuplicado) {
    // Retorna erro 409 indicando conflito de dados.
    return http.conflict(res, "Email já cadastrado");
  }

  // Gera um novo id maior que o maior id atual.
  const id = alunos.length ? Math.max(...alunos.map((item) => item.id)) + 1 : 1;

  // Cria o objeto do novo aluno.
  const novoAluno = {
    id,
    nome,
    email
  };

  // Adiciona o novo aluno ao array de alunos.
  alunos.push(novoAluno);

  // Retorna o aluno criado com status 201.
  return http.created(res, novoAluno);
});

// Cria a rota PUT /alunos/:id para editar um aluno.
router.put("/:id", (req, res) => {
  // Converte o id recebido na URL para número.
  const id = Number(req.params.id);

  // Procura a posição do aluno no array.
  const index = alunos.findIndex((item) => item.id === id);

  // Verifica se o aluno não foi encontrado.
  if (index === -1) {
    // Retorna erro 404.
    return http.notFound(res, "Aluno não encontrado");
  }

  // Extrai nome e email enviados no corpo da requisição.
  const { nome, email } = req.body || {};

  // Valida os dados recebidos.
  const erros = validarAluno({ nome, email });

  // Verifica se a validação encontrou erros.
  if (erros.length) {
    // Retorna erro 400.
    return http.badRequest(res, erros.join("; "));
  }

  // Verifica se outro aluno já usa o mesmo e-mail.
  const emailDuplicado = alunos.some((item) => item.email === email && item.id !== id);

  // Verifica se houve duplicidade.
  if (emailDuplicado) {
    // Retorna erro 409.
    return http.conflict(res, "Email já cadastrado");
  }

  // Atualiza o aluno no array.
  alunos[index] = {
    id,
    nome,
    email
  };

  // Retorna o aluno atualizado.
  return http.ok(res, alunos[index]);
});

// Cria a rota DELETE /alunos/:id para excluir um aluno.
router.delete("/:id", (req, res) => {
  // Converte o id recebido na URL para número.
  const id = Number(req.params.id);

  // Procura a posição do aluno no array.
  const index = alunos.findIndex((item) => item.id === id);

  // Verifica se o aluno não foi encontrado.
  if (index === -1) {
    // Retorna erro 404.
    return http.notFound(res, "Aluno não encontrado");
  }

  // Verifica se o aluno possui matrícula ativa.
  const alunoTemMatricula = matriculas.some((item) => item.aluno_id === id);

  // Impede excluir aluno que possui matrícula.
  if (alunoTemMatricula) {
    // Retorna erro 409.
    return http.conflict(res, "Não é possível excluir aluno com matrícula ativa");
  }

  // Remove o aluno do array.
  alunos.splice(index, 1);

  // Retorna status 204, sem conteúdo.
  return http.noContent(res);
});
