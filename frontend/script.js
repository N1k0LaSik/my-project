// ================= API =================
const API = "http://localhost:3000/api";

async function apiFetch(path, options = {}) {
    const res = await fetch(`${API}${path}`, {
        headers: { "Content-Type": "application/json" },
        ...options,
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Помилка запиту");
    }
    if (res.status === 204) return null;
    return res.json();
}


// ================= STATE =================
let state = [];
let statuses = [];
let users = [];
let editId = null;


// ================= ELEMENTS =================
const form = document.getElementById("ticketForm");
const tableBody = document.getElementById("tableBody");

const search = document.getElementById("search");
const filterStatus = document.getElementById("filterStatus");

const subject = document.getElementById("subject");
const statusSelect = document.getElementById("status");
const priority = document.getElementById("priority");
const message = document.getElementById("message");
const authorSelect = document.getElementById("author");
const emailInput = document.getElementById("email");


document.querySelector("button[type='submit']").disabled = true;

subject.addEventListener("input", checkFormFilled);
statusSelect.addEventListener("change", checkFormFilled);
priority.addEventListener("change", checkFormFilled);
message.addEventListener("input", checkFormFilled);
authorSelect.addEventListener("input", checkFormFilled);
emailInput.addEventListener("input", checkFormFilled);


// ================= LOAD DROPDOWNS =================
async function loadDropdowns() {
    statuses = (await apiFetch("/statuses")).items;
    users = (await apiFetch("/users")).items;

    statusSelect.innerHTML = `<option value="">Оберіть статус</option>` +
        statuses.map(s => `<option value="${s.id}">${s.name}</option>`).join("");

    filterStatus.innerHTML = `<option value="">Всі статуси</option>` +
        statuses.map(s => `<option value="${s.id}">${s.name}</option>`).join("");
}


// ================= FORM =================
function readForm() {
    return {
        subject: subject.value.trim(),
        statusId: statusSelect.value,
        priority: priority.value,
        message: message.value.trim(),
        authorId: authorSelect.value,
        email: emailInput.value.trim(),   
    };
}


// ================= VALIDATION =================
function clearErrors() {
    ["subject", "status", "priority", "message", "author", "email"].forEach(field => {
        document.getElementById(field).classList.remove("invalid");
        document.getElementById(field + "Error").textContent = "";
    });
}

function showError(field, messageText) {
    document.getElementById(field).classList.add("invalid");
    document.getElementById(field + "Error").textContent = messageText;
}

function validate(data) {
    clearErrors();
    let valid = true;

    if (!data.authorId) {
        showError("author", "Введіть ім'я автора");
        valid = false;
    } else if (data.authorId.length < 2) {
        showError("author", "Мінімум 2 символи");
        valid = false;
    }

    if (!data.statusId) {
        showError("status", "Оберіть статус");
        valid = false;
    }

    if (!data.priority) {
        showError("priority", "Оберіть пріоритет");
        valid = false;
    }

    if (!data.message) {
        showError("message", "Обов'язкове поле");
        valid = false;
    } else if (data.message.length < 10) {
        showError("message", "Мінімум 10 символів");
        valid = false;
    }

    if (!data.authorId) {
        showError("author", "Оберіть автора");
        valid = false;
    }

    if (!data.email) {
        showError("email", "Обов'язкове поле");
        valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        showError("email", "Невірний формат email");
        valid = false;
    }

    return valid;
}


// ================= CRUD =================
async function addOrUpdateItem(data) {
    if (editId !== null) {
        await apiFetch(`/tickets/${editId}`, {
            method: "PUT",
            body: JSON.stringify({
                subject: data.subject,
                statusId: data.statusId,
                priority: data.priority,
                message: data.message,
            }),
        });
        editId = null;
    } else {
        const newUser = await apiFetch("/users", {
            method: "POST",
            body: JSON.stringify({
                name: data.authorId,
                email: data.email,
            }),
        });

        await apiFetch("/tickets", {
            method: "POST",
            body: JSON.stringify({
                ...data,
                authorId: newUser.id,
            }),
        });
    }

    await loadTickets();
    form.reset();
    document.querySelector("button[type='submit']").disabled = true;
    await loadDropdowns();
    subject.focus();
}

async function deleteItem(id) {
    await apiFetch(`/tickets/${id}`, { method: "DELETE" });
    await loadTickets();
}

function startEdit(id) {
    const item = state.find(i => i.id === id);
    if (!item) return;

    subject.value = item.subject;
    statusSelect.value = item.statusId;
    priority.value = item.priority;
    message.value = item.message;
    authorSelect.value = getUserName(item.authorId);
    emailInput.value = users.find(u => u.id === item.authorId)?.email ?? "";

    editId = id;

    checkFormFilled();
}

// ================= LOAD TICKETS =================
async function loadTickets() {
    const params = new URLSearchParams();
    if (filterStatus.value) params.set("statusId", filterStatus.value);

    const response = await apiFetch(`/tickets?${params}`);
    console.log("TICKETS RESPONSE:", response);
    state = response.items;

    users = (await apiFetch("/users")).items;

    render();
}

// ================= RENDER =================
function getStatusName(id) {
    return statuses.find(s => s.id === id)?.name ?? id;
}

function getUserName(id) {
    return users.find(u => u.id === id)?.name ?? id;
}

function render() {
    const searchValue = search.value.toLowerCase();
    const priorityOrder = { High: 3, Medium: 2, Low: 1 };

    const filtered = state
        .filter(item => item.subject.toLowerCase().includes(searchValue))
        .sort((a, b) => (priorityOrder[b.priority] ?? 0) - (priorityOrder[a.priority] ?? 0));

    tableBody.innerHTML = filtered.map(item => `
        <tr>
            <td>${item.subject}</td>
            <td>${getStatusName(item.statusId)}</td>
            <td>${item.priority}</td>
            <td>${getUserName(item.authorId)}</td>
            <td>
                <button class="edit" data-id="${item.id}">Редагувати</button>
                <button class="delete" data-id="${item.id}">Видалити</button>
            </td>
        </tr>
    `).join("");
}


// ================= EVENTS =================
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = readForm();
    if (validate(data)) {
        await addOrUpdateItem(data);
    }
});

document.getElementById("resetBtn").addEventListener("click", () => {
    form.reset();
    clearErrors();
    editId = null;
});

search.addEventListener("input", render);

filterStatus.addEventListener("change", loadTickets);

tableBody.addEventListener("click", async (e) => {
    const id = e.target.dataset.id;

    if (e.target.classList.contains("delete")) {
        await deleteItem(id);
    }

    if (e.target.classList.contains("edit")) {
        startEdit(id);
    }
});


function checkFormFilled() {
    const data = readForm();
    const filled = 
        data.subject.length >= 3 &&
        data.statusId !== "" &&
        data.priority !== "" &&
        data.message.length >= 10 &&
        data.authorId.length >= 2 &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);

    document.querySelector("button[type='submit']").disabled = !filled;
}



// ================= INIT =================
async function init() {
    await loadDropdowns();
    await loadTickets();
}

init();