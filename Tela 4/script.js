const insurancePlans = [
  {
    protections: ["Colisao", "Roubo e Furto", "Incendio", "Assistencia 24h"],
    price: 289.9,
    company: "Porto Seguro"
  },
  {
    protections: ["Colisao", "Roubo e Furto", "Carro Reserva", "Guincho 24h"],
    price: 319.5,
    company: "Bradesco Seguros"
  },
  {
    protections: ["Roubo e Furto", "Perda Total", "Protecao de Vidros"],
    price: 224.7,
    company: "Azul Seguros"
  },
  {
    protections: ["Colisao", "Danos a Terceiros", "Assistencia 24h", "Cobertura de Farois"],
    price: 271.3,
    company: "Tokio Marine"
  },
  {
    protections: ["Colisao", "Fenomenos da Natureza", "Carro Reserva", "Protecao de Vidros"],
    price: 305.8,
    company: "Allianz"
  }
];

const insuranceBody = document.getElementById("insuranceBody");
const insuranceSearch = document.getElementById("insuranceSearch");
const sortBtn = document.getElementById("sortBtn");
const clearBtn = document.getElementById("clearBtn");
const insuranceMeta = document.getElementById("insuranceMeta");

let sortAscending = true;

function normalizeText(value) {
  return value
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function formatMoney(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(value);
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderPlans(plans, query = "") {
  if (plans.length === 0) {
    insuranceBody.innerHTML =
      '<tr><td colspan="4" class="no-results">Nenhum plano encontrado.</td></tr>';
    insuranceMeta.textContent = `0 resultados para "${query}"`;
    return;
  }

  insuranceBody.innerHTML = plans
    .map((plan, index) => {
      const protectionsHtml = plan.protections
        .map((protection) => `<li>${escapeHtml(protection)}</li>`)
        .join("");

      return `
        <tr>
          <td class="rank">${index + 1}</td>
          <td>
            <ul class="protection-list">${protectionsHtml}</ul>
          </td>
          <td class="price">${formatMoney(plan.price)}</td>
          <td class="company-cell">${escapeHtml(plan.company)}</td>
        </tr>
      `;
    })
    .join("");

  insuranceMeta.textContent = `${plans.length} ${plans.length === 1 ? "plano encontrado" : "planos encontrados"}`;
}

function filterAndSortPlans() {
  const query = insuranceSearch.value.trim();
  let plans = [...insurancePlans];

  if (query) {
    const normalizedQuery = normalizeText(query);
    plans = plans.filter((plan) => {
      const text = [plan.company, ...plan.protections].map(normalizeText).join(" ");
      return text.includes(normalizedQuery);
    });
  }

  plans.sort((a, b) => {
    return sortAscending ? a.price - b.price : b.price - a.price;
  });

  renderPlans(plans, query);
}

sortBtn.addEventListener("click", () => {
  sortAscending = !sortAscending;
  sortBtn.textContent = sortAscending ? "ORDENAR PRECO" : "PRECO DESC";
  filterAndSortPlans();
});

insuranceSearch.addEventListener("input", filterAndSortPlans);
insuranceSearch.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    filterAndSortPlans();
  }
});

clearBtn.addEventListener("click", () => {
  insuranceSearch.value = "";
  sortAscending = true;
  sortBtn.textContent = "ORDENAR PRECO";
  filterAndSortPlans();
  insuranceSearch.focus();
});

filterAndSortPlans();
