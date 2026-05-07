// Banco de dados em memoria usado pela API da AutoPrime Veiculos.
export const carros = [
  {
    id: 1,
    modelo: "Volkswagen Gol 1.6",
    marca: "Volkswagen",
    placa: "MTR-1A23",
    dataCompra: "2026-01-09",
    statusPagamento: "Pago",
    ano: 2026,
    preco: 68900,
    combustivel: "Flex",
    cambio: "Manual",
    quilometragem: "8.500 km"
  },
  {
    id: 2,
    modelo: "Fiat Argo Drive",
    marca: "Fiat",
    placa: "QWE-9B72",
    dataCompra: "2025-11-14",
    statusPagamento: "Atrasado",
    ano: 2025,
    preco: 77900,
    combustivel: "Flex",
    cambio: "Manual",
    quilometragem: "19.400 km"
  },
  {
    id: 3,
    modelo: "Chevrolet Onix LT",
    marca: "Chevrolet",
    placa: "ABC-4D88",
    dataCompra: "2025-12-02",
    statusPagamento: "Consorcio",
    ano: 2025,
    preco: 82900,
    combustivel: "Flex",
    cambio: "Automatico",
    quilometragem: "14.200 km"
  },
  {
    id: 4,
    modelo: "Hyundai HB20 Comfort",
    marca: "Hyundai",
    placa: "RTY-2F19",
    dataCompra: "2026-02-18",
    statusPagamento: "Pago",
    ano: 2026,
    preco: 85900,
    combustivel: "Flex",
    cambio: "Automatico",
    quilometragem: "6.800 km"
  },
  {
    id: 5,
    modelo: "Toyota Corolla XEi",
    marca: "Toyota",
    placa: "JKL-8H61",
    dataCompra: "2025-10-27",
    statusPagamento: "Pendente",
    ano: 2024,
    preco: 154800,
    combustivel: "Flex",
    cambio: "CVT",
    quilometragem: "15.200 km"
  }
];

export const clientes = [
  {
    id: 1,
    nome: "Gabriel Marques Figueira",
    cpf: "315.729.440-08",
    email: "gabriel.figueira@email.com",
    profissao: "Engenheiro de Software"
  },
  {
    id: 2,
    nome: "Julia Batista Rocha",
    cpf: "764.090.210-35",
    email: "julia.rocha@email.com",
    profissao: "Administradora"
  },
  {
    id: 3,
    nome: "Carlos Eduardo Prado",
    cpf: "098.125.330-11",
    email: "carlos.prado@email.com",
    profissao: "Analista Financeiro"
  },
  {
    id: 4,
    nome: "Marina Lopes Duarte",
    cpf: "442.771.600-27",
    email: "marina.duarte@email.com",
    profissao: "Medica Veterinaria"
  },
  {
    id: 5,
    nome: "Rafael Nunes Cardoso",
    cpf: "550.943.880-02",
    email: "rafael.cardoso@email.com",
    profissao: "Arquiteto"
  }
];

export const seguros = [
  {
    id: 1,
    seguradora: "Porto Seguro",
    protecoes: ["Colisao", "Roubo e Furto", "Incendio", "Assistencia 24h"],
    precoMensal: 289.9
  },
  {
    id: 2,
    seguradora: "Bradesco Seguros",
    protecoes: ["Colisao", "Roubo e Furto", "Carro Reserva", "Guincho 24h"],
    precoMensal: 319.5
  },
  {
    id: 3,
    seguradora: "Azul Seguros",
    protecoes: ["Roubo e Furto", "Perda Total", "Protecao de Vidros"],
    precoMensal: 224.7
  },
  {
    id: 4,
    seguradora: "Tokio Marine",
    protecoes: ["Colisao", "Danos a Terceiros", "Assistencia 24h", "Cobertura de Farois"],
    precoMensal: 271.3
  }
];

export const vendas = [
  {
    id: 1,
    cliente_id: 1,
    carro_id: 1,
    seguro_id: 1,
    dataVenda: "2026-03-12",
    statusPagamento: "Pago"
  },
  {
    id: 2,
    cliente_id: 2,
    carro_id: 3,
    seguro_id: 3,
    dataVenda: "2026-03-22",
    statusPagamento: "Consorcio"
  }
];
