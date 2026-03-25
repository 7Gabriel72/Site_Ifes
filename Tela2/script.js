const catalogItems = [
  {
    model: "Volkswagen Nivus Highline",
    brand: "Volkswagen",
    engine: "1.0 Turbo",
    fuel: "Flex",
    year: "2025",
    mileage: "12.300 km",
    gearbox: "Automatico",
    price: 129900,
    color: "#2a6f97"
  },
  {
    model: "Chevrolet Tracker Premier",
    brand: "Chevrolet",
    engine: "1.2 Turbo",
    fuel: "Flex",
    year: "2024",
    mileage: "18.900 km",
    gearbox: "Automatico",
    price: 134500,
    color: "#3f7d20"
  },
  {
    model: "Fiat Pulse Audace",
    brand: "Fiat",
    engine: "1.0 Turbo 200",
    fuel: "Flex",
    year: "2025",
    mileage: "9.700 km",
    gearbox: "CVT",
    price: 112300,
    color: "#8f5a12"
  },
  {
    model: "Hyundai HB20 Platinum",
    brand: "Hyundai",
    engine: "1.0 TGDI",
    fuel: "Flex",
    year: "2023",
    mileage: "27.450 km",
    gearbox: "Automatico",
    price: 101900,
    color: "#56467a"
  },
  {
    model: "Toyota Corolla XEi",
    brand: "Toyota",
    engine: "2.0",
    fuel: "Flex",
    year: "2024",
    mileage: "15.200 km",
    gearbox: "CVT",
    price: 154800,
    color: "#4f5d73"
  }
];

const catalogBody = document.getElementById("catalogBody");
const catalogSearch = document.getElementById("catalogSearch");
const sortPriceBtn = document.getElementById("sortPriceBtn");
const clearCatalogBtn = document.getElementById("clearCatalogBtn");
const catalogMeta = document.getElementById("catalogMeta");

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

function createCarThumb(model, color) {
  const safeModel = model.replaceAll("&", "&amp;").replaceAll("<", "&lt;");
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="440" height="240" viewBox="0 0 440 240">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${color}" />
          <stop offset="100%" stop-color="#10151e" />
        </linearGradient>
      </defs>
      <rect width="440" height="240" fill="url(#bg)" />
      <rect x="52" y="118" width="330" height="62" rx="24" fill="#f5f7fa" fill-opacity="0.95" />
      <rect x="94" y="82" width="170" height="46" rx="12" fill="#f5f7fa" fill-opacity="0.95" />
      <circle cx="136" cy="185" r="22" fill="#141821" />
      <circle cx="302" cy="185" r="22" fill="#141821" />
      <text x="220" y="42" text-anchor="middle" fill="#ffffff" font-size="20" font-weight="700">${safeModel}</text>
    </svg>
  `;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function renderCatalog(items, query = "") {
  if (items.length === 0) {
    catalogBody.innerHTML =
      '<tr><td class="no-results" colspan="3">Nenhum veiculo encontrado no catalogo.</td></tr>';
    catalogMeta.textContent = `0 resultados para "${query}"`;
    return;
  }

  catalogBody.innerHTML = items
    .map((item) => {
      const thumb = createCarThumb(item.model, item.color);
      const specs = [
        `Modelo: ${item.model}`,
        `Marca: ${item.brand}`,
        `Motor: ${item.engine}`,
        `Combustivel: ${item.fuel}`,
        `Ano: ${item.year}`,
        `Quilometragem: ${item.mileage}`,
        `Cambio: ${item.gearbox}`
      ];

      const specsHtml = specs.map((spec) => `<li>${escapeHtml(spec)}</li>`).join("");

      return `
        <tr>
          <td class="photo-cell">
            <img class="thumb" src="${thumb}" alt="${escapeHtml(item.model)}" loading="lazy" />
          </td>
          <td class="price">${formatMoney(item.price)}</td>
          <td>
            <ul class="spec-list">${specsHtml}</ul>
          </td>
        </tr>
      `;
    })
    .join("");

  catalogMeta.textContent = `${items.length} ${items.length === 1 ? "veiculo encontrado" : "veiculos encontrados"}`;
}

function getFilteredAndSortedItems() {
  const query = catalogSearch.value.trim();

  let result = [...catalogItems];
  if (query) {
    const normalizedQuery = normalizeText(query);
    result = result.filter((item) => {
      const searchableText = [
        item.model,
        item.brand,
        item.engine,
        item.fuel,
        item.year,
        item.mileage,
        item.gearbox
      ]
        .map(normalizeText)
        .join(" ");

      return searchableText.includes(normalizedQuery);
    });
  }

  result.sort((a, b) => {
    return sortAscending ? a.price - b.price : b.price - a.price;
  });

  return { result, query };
}

function refreshCatalog() {
  const { result, query } = getFilteredAndSortedItems();
  renderCatalog(result, query);
}

sortPriceBtn.addEventListener("click", () => {
  sortAscending = !sortAscending;
  sortPriceBtn.textContent = sortAscending ? "ORDENAR PRECO" : "PRECO DESC";
  refreshCatalog();
});

catalogSearch.addEventListener("input", refreshCatalog);
catalogSearch.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    refreshCatalog();
  }
});

clearCatalogBtn.addEventListener("click", () => {
  catalogSearch.value = "";
  sortAscending = true;
  sortPriceBtn.textContent = "ORDENAR PRECO";
  refreshCatalog();
  catalogSearch.focus();
});

refreshCatalog();
