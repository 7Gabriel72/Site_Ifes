const clients = [
  { name: "Gabriel Marques Figueira", cpf: "315.729.440-08", job: "Engenheiro de Software" },
  { name: "Julia Batista Rocha", cpf: "764.090.210-35", job: "Administradora" },
  { name: "Carlos Eduardo Prado", cpf: "098.125.330-11", job: "Analista Financeiro" },
  { name: "Marina Lopes Duarte", cpf: "442.771.600-27", job: "Medica Veterinaria" },
  { name: "Rafael Nunes Cardoso", cpf: "550.943.880-02", job: "Arquiteto" }
];

const additionalClients = [
  { name: "Fernanda Vieira Costa", cpf: "628.190.500-72", job: "Designer de Interiores" },
  { name: "Bruno Araujo Sales", cpf: "199.620.340-16", job: "Professor" },
  { name: "Patricia Mendonca Lima", cpf: "903.458.240-64", job: "Consultora Comercial" },
  { name: "Leonardo Freitas Pires", cpf: "740.328.510-29", job: "Tecnico em Automacao" }
];

const clientsBody = document.getElementById("clientsBody");
const selectedNameInput = document.getElementById("selectedName");
const selectBtn = document.getElementById("selectBtn");
const addBtn = document.getElementById("addBtn");
const removeBtn = document.getElementById("removeBtn");

let selectedIndex = 0;

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function ensureSelection() {
  if (clients.length === 0) {
    selectedIndex = -1;
    selectedNameInput.value = "Nenhum cliente cadastrado";
    removeBtn.disabled = true;
    selectBtn.disabled = true;
    return;
  }

  if (selectedIndex < 0 || selectedIndex >= clients.length) {
    selectedIndex = 0;
  }

  selectedNameInput.value = clients[selectedIndex].name;
  removeBtn.disabled = false;
  selectBtn.disabled = false;
}

function renderClients() {
  if (clients.length === 0) {
    clientsBody.innerHTML =
      '<tr><td colspan="3" class="no-results">Sem clientes. Clique em "ADICIONAR CLIENTE".</td></tr>';
    ensureSelection();
    return;
  }

  clientsBody.innerHTML = clients
    .map((client, index) => {
      const selectedClass = index === selectedIndex ? "selected" : "";
      return `
        <tr class="${selectedClass}" data-index="${index}">
          <td>${escapeHtml(client.name)}</td>
          <td>${escapeHtml(client.cpf)}</td>
          <td>${escapeHtml(client.job)}</td>
        </tr>
      `;
    })
    .join("");

  ensureSelection();
}

function selectNextClient() {
  if (clients.length === 0) {
    return;
  }

  selectedIndex = (selectedIndex + 1) % clients.length;
  renderClients();
}

function addClient() {
  const candidate = additionalClients.find((person) => {
    return !clients.some((client) => client.cpf === person.cpf);
  });

  if (!candidate) {
    selectedNameInput.value = "Todos os clientes extras ja foram adicionados";
    return;
  }

  clients.push(candidate);
  selectedIndex = clients.length - 1;
  renderClients();
}

function removeClient() {
  if (selectedIndex < 0 || selectedIndex >= clients.length) {
    return;
  }

  clients.splice(selectedIndex, 1);
  if (selectedIndex >= clients.length) {
    selectedIndex = clients.length - 1;
  }
  renderClients();
}

clientsBody.addEventListener("click", (event) => {
  const row = event.target.closest("tr[data-index]");
  if (!row) {
    return;
  }

  selectedIndex = Number(row.dataset.index);
  renderClients();
});

selectBtn.addEventListener("click", selectNextClient);
addBtn.addEventListener("click", addClient);
removeBtn.addEventListener("click", removeClient);

renderClients();
