const cars = [
  {
    name: "Volkswagen Gol 1.6",
    plate: "MTR-1A23",
    purchaseDate: "2026-01-09",
    paymentStatus: "Pago"
  },
  {
    name: "Fiat Argo Drive",
    plate: "QWE-9B72",
    purchaseDate: "2025-11-14",
    paymentStatus: "Atrasado"
  },
  {
    name: "Chevrolet Onix LT",
    plate: "ABC-4D88",
    purchaseDate: "2025-12-02",
    paymentStatus: "Consorcio"
  },
  {
    name: "Hyundai HB20 Comfort",
    plate: "RTY-2F19",
    purchaseDate: "2026-02-18",
    paymentStatus: "Pago"
  },
  {
    name: "Toyota Corolla XEi",
    plate: "JKL-8H61",
    purchaseDate: "2025-10-27",
    paymentStatus: "Atrasado"
  }
];

const tableBody = document.getElementById("carsTable");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const clearBtn = document.getElementById("clearBtn");
const resultCount = document.getElementById("resultCount");

function normalizeText(value) {
  return value
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatDate(dateString) {
  const date = new Date(`${dateString}T00:00:00`);
  return new Intl.DateTimeFormat("pt-BR").format(date);
}

function statusClass(status) {
  const normalizedStatus = normalizeText(status);

  if (normalizedStatus.includes("pago")) {
    return "completed";
  }

  if (normalizedStatus.includes("atras")) {
    return "blocked";
  }

  return "consorcio";
}

function renderRows(rows, query = "") {
  if (rows.length === 0) {
    tableBody.innerHTML =
      '<tr><td class="no-results" colspan="4">Nenhum carro encontrado para esta busca.</td></tr>';
    resultCount.textContent = `0 resultados para "${query}"`;
    return;
  }

  tableBody.innerHTML = rows
    .map((car) => {
      const badgeClass = statusClass(car.paymentStatus);
      return `
        <tr>
          <td>${escapeHtml(car.name)}</td>
          <td>${escapeHtml(car.plate)}</td>
          <td>${formatDate(car.purchaseDate)}</td>
          <td><span class="status ${badgeClass}">${escapeHtml(car.paymentStatus)}</span></td>
        </tr>
      `;
    })
    .join("");

  resultCount.textContent = `${rows.length} ${rows.length === 1 ? "resultado" : "resultados"}`;
}

function applySearch() {
  const query = searchInput.value.trim();

  if (!query) {
    renderRows(cars);
    return;
  }

  const normalizedQuery = normalizeText(query);

  const filtered = cars.filter((car) => {
    const searchableText = [
      car.name,
      car.plate,
      car.paymentStatus,
      formatDate(car.purchaseDate)
    ]
      .map(normalizeText)
      .join(" ");

    return searchableText.includes(normalizedQuery);
  });

  renderRows(filtered, query);
}

searchBtn.addEventListener("click", applySearch);
clearBtn.addEventListener("click", () => {
  searchInput.value = "";
  searchInput.focus();
  renderRows(cars);
});

searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    applySearch();
  }
});

renderRows(cars);
