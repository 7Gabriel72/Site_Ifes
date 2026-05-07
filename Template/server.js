// Importa o Express, biblioteca usada para criar o servidor web.
import express from "express";

// Importa o módulo path, usado para trabalhar com caminhos de arquivos e pastas.
import path from "path";

// Importa fileURLToPath para descobrir o caminho do arquivo atual usando ES Modules.
import { fileURLToPath } from "url";

// Importa o roteador responsável pelas rotas de alunos.
import { router as alunosRouter } from "./src/routes/alunos.js";

// Importa o roteador responsável pelas rotas de cursos.
import { router as cursosRouter } from "./src/routes/cursos.js";

// Importa o roteador responsável pelas rotas de turmas.
import { router as turmasRouter } from "./src/routes/turmas.js";

// Importa o roteador responsável pelas rotas de matrículas.
import { router as matriculasRouter } from "./src/routes/matriculas-turma.js";

// Cria a aplicação principal do Express.
const app = express();

// Permite que o servidor receba dados no formato JSON.
app.use(express.json());

// Converte o endereço do arquivo atual para um caminho físico do sistema.
const __filename = fileURLToPath(import.meta.url);

// Descobre a pasta onde está o arquivo server.js.
const __dirname = path.dirname(__filename);

// Libera a pasta public para ser acessada pelo navegador.
app.use(express.static(path.join(__dirname, "public")));

// Cria uma rota simples para testar se a API está funcionando.
app.get("/saude", (req, res) => {
  // Retorna uma resposta em JSON informando que o servidor está funcionando.
  res.json({
    status: "ok",
    mensagem: "API da Secretaria Escolar funcionando."
  });
});

// Cria uma rota informativa sobre a API.
app.get("/api", (req, res) => {
  // Retorna informações gerais do projeto.
  res.json({
    nome: "Secretaria Escolar",
    recursos: ["alunos", "cursos", "turmas", "matriculas-turma"],
    operacoes: ["cadastrar", "buscar/listar", "editar", "deletar"]
  });
});

// Conecta as rotas de alunos ao endereço /alunos.
app.use("/alunos", alunosRouter);

// Conecta as rotas de cursos ao endereço /cursos.
app.use("/cursos", cursosRouter);

// Conecta as rotas de turmas ao endereço /turmas.
app.use("/turmas", turmasRouter);

// Conecta as rotas de matrículas ao servidor.
app.use("/", matriculasRouter);

// Trata erros internos do servidor.
app.use((err, req, res, next) => {
  // Mostra o erro no terminal para facilitar a correção.
  console.error(err);

  // Envia uma resposta de erro para o navegador.
  res.status(500).json({
    erro: "Erro interno do servidor."
  });
});

// Trata rotas que não existem.
app.use((req, res) => {
  // Retorna erro 404 quando o caminho acessado não foi encontrado.
  res.status(404).json({
    erro: "Rota não encontrada.",
    caminho: req.originalUrl
  });
});

// Define a porta em que o servidor será executado.
const PORT = process.env.PORT || 3000;

// Inicia o servidor na porta definida.
app.listen(PORT, () => {
  // Mostra no terminal o endereço do sistema.
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
