// Cria um objeto com funções auxiliares para respostas HTTP.
export const http = {
  // Retorna uma resposta de sucesso com status 200.
  ok: (res, body) => res.status(200).json(body),

  // Retorna uma resposta de criação com status 201.
  created: (res, body) => res.status(201).json(body),

  // Retorna uma resposta sem conteúdo com status 204.
  noContent: (res) => res.status(204).send(),

  // Retorna uma resposta de erro de validação com status 400.
  badRequest: (res, msg) => res.status(400).json({ erro: msg }),

  // Retorna uma resposta de item não encontrado com status 404.
  notFound: (res, msg = "Não encontrado") => res.status(404).json({ erro: msg }),

  // Retorna uma resposta de conflito com status 409.
  conflict: (res, msg) => res.status(409).json({ erro: msg })
};
