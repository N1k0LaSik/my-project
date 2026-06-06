import * as api from "./apiClient";
import { invalidateCache, setCurrentUserId } from "./apiClient";
import * as ui from "./ui";
import type { ApiError, CreateTicketDto, StatusDto, TicketListItemDto, UserDto } from "./dtos";
 
// ─── State ────────────────────────────────────────────────────────────────────
 
let tickets: TicketListItemDto[] = [];
let statuses: StatusDto[] = [];
let users: UserDto[] = [];
let editId: string | null = null;
 
// ─── Elements ─────────────────────────────────────────────────────────────────
 
const form = document.getElementById("ticketForm") as HTMLFormElement;
const subjectInput = document.getElementById("subject") as HTMLInputElement;
const statusSelect = document.getElementById("status") as HTMLSelectElement;
const prioritySelect = document.getElementById("priority") as HTMLSelectElement;
const messageInput = document.getElementById("message") as HTMLTextAreaElement;
const searchInput = document.getElementById("search") as HTMLInputElement;
const filterStatusSelect = document.getElementById("filterStatus") as HTMLSelectElement;
const tableBody = document.getElementById("tableBody") as HTMLTableSectionElement;
const submitBtn = document.getElementById("submitBtn") as HTMLButtonElement;
const cancelBtn = document.getElementById("cancelBtn") as HTMLButtonElement;
const resetBtn = document.getElementById("resetBtn") as HTMLButtonElement;
 
// ─── Validation ───────────────────────────────────────────────────────────────
 
function validate(): boolean {
  ui.clearFieldErrors();
  let valid = true;
 
  const subject = subjectInput.value.trim();
  const message = messageInput.value.trim();
 
  if (!subject || subject.length < 3) {
    ui.showFieldError("subject", "Мінімум 3 символи");
    valid = false;
  }
  if (!statusSelect.value) {
    ui.showFieldError("status", "Оберіть статус");
    valid = false;
  }
  if (!prioritySelect.value) {
    ui.showFieldError("priority", "Оберіть пріоритет");
    valid = false;
  }
  if (!message || message.length < 10) {
    ui.showFieldError("message", "Мінімум 10 символів");
    valid = false;
  }
  if (!api.getCurrentUserId()) {
    ui.showNotice("Оберіть користувача у панелі Demo Auth", true);
    valid = false;
  }
 
  return valid;
}
 
// ─── Load data ────────────────────────────────────────────────────────────────
 
async function loadDropdowns(): Promise<void> {
  const [statusRes, userRes] = await Promise.all([
    api.getStatuses(),
    api.getUsers(),
  ]);
  statuses = statusRes.items;
  users = userRes.items;
  ui.populateStatuses(statuses, ["status", "filterStatus"]);
}
 
async function loadTickets(): Promise<void> {
  ui.renderListStatus("loading");
 
  const statusId = filterStatusSelect.value || undefined;
  const priorityFilter = (document.getElementById("filterPriority") as HTMLSelectElement)?.value || undefined;
 
  try {
    const [res, userRes] = await Promise.all([
      api.getTickets({ statusId, priority: priorityFilter }),
      api.getUsers(),
    ]);
    tickets = res.items;
    users = userRes.items;
 
    if (tickets.length === 0) {
      ui.renderTable([], statuses, users);
      ui.renderListStatus("empty");
      return;
    }
 
    ui.renderTable(applySearch(tickets), statuses, users);
    ui.renderListStatus("success");
  } catch (e) {
    const err = e as ApiError;
    ui.renderTable([], statuses, users);
    ui.renderListStatus("error", err);
    ui.showApiError(err);
  }
}
 
function applySearch(items: TicketListItemDto[]): TicketListItemDto[] {
  const q = searchInput.value.toLowerCase();
  return q ? items.filter((t) => t.subject.toLowerCase().includes(q)) : items;
}
 
// ─── Form submit ──────────────────────────────────────────────────────────────
 
async function handleSubmit(e: Event): Promise<void> {
  e.preventDefault();
  if (!validate()) return;
 
  ui.setFormLoading(true);
 
  const subject = subjectInput.value.trim();
  const message = messageInput.value.trim();
 
  try {
    if (editId) {
      await api.updateTicket(editId, {
        subject,
        message,
        priority: prioritySelect.value as CreateTicketDto["priority"],
        statusId: statusSelect.value,
      });
      ui.showNotice("Заявку оновлено");
    } else {
      const dto: CreateTicketDto = {
        subject,
        message,
        priority: prioritySelect.value as CreateTicketDto["priority"],
        statusId: statusSelect.value,
        authorId: api.getCurrentUserId() ?? "",
      };
      await api.createTicket(dto);
      ui.showNotice("Заявку створено");
    }
 
    resetForm();
    invalidateCache("/tickets");
    invalidateCache("/users");
    await loadTickets();
  } catch (e) {
    const err = e as ApiError;
    ui.showApiError(err);
 
    if (err.errors) {
      err.errors.forEach((fieldErr) => {
        if (fieldErr.field) ui.showFieldError(fieldErr.field, fieldErr.message);
      });
    }
  } finally {
    ui.setFormLoading(false);
  }
}
 
// ─── Delete ───────────────────────────────────────────────────────────────────
 
async function handleDelete(id: string): Promise<void> {
  if (!confirm("Видалити заявку?")) return;
 
  ui.setDeleteLoading(id, true);
  try {
    await api.deleteTicket(id);
    invalidateCache("/tickets");
    ui.showNotice("Заявку видалено");
    await loadTickets();
  } catch (e) {
    const err = e as ApiError;
    ui.showApiError(err);
    ui.setDeleteLoading(id, false);
  }
}
 
// ─── Edit ─────────────────────────────────────────────────────────────────────
 
async function handleEdit(id: string): Promise<void> {
  try {
    const [ticket, userRes] = await Promise.all([
      api.getTicketById(id),
      api.getUsers(),
    ]);
    users = userRes.items;
 
    subjectInput.value = ticket.subject;
    statusSelect.value = ticket.statusId;
    prioritySelect.value = ticket.priority;
    messageInput.value = ticket.message;
 
    editId = id;
    ui.setEditMode(true);
    checkFormFilled();
    form.scrollIntoView({ behavior: "smooth" });
  } catch (e) {
    ui.showApiError(e as ApiError);
  }
}
 
// ─── Reset form ───────────────────────────────────────────────────────────────
 
function resetForm(): void {
  form.reset();
  editId = null;
  ui.clearFieldErrors();
  ui.setEditMode(false);
  submitBtn.disabled = true;
}
 
// ─── Check form filled ────────────────────────────────────────────────────────
 
function checkFormFilled(): void {
  const filled =
    subjectInput.value.trim().length >= 3 &&
    statusSelect.value !== "" &&
    prioritySelect.value !== "" &&
    messageInput.value.trim().length >= 10;
 
  submitBtn.disabled = !filled;
}
 
// ─── Events ───────────────────────────────────────────────────────────────────
 
form.addEventListener("submit", handleSubmit);
 
cancelBtn.addEventListener("click", resetForm);
 
resetBtn.addEventListener("click", () => {
  resetForm();
});
 
searchInput.addEventListener("input", () => {
  ui.renderTable(applySearch(tickets), statuses, users);
});
 
filterStatusSelect.addEventListener("change", loadTickets);
(document.getElementById("filterPriority") as HTMLSelectElement).addEventListener("change", loadTickets);
 
tableBody.addEventListener("click", async (e) => {
  const target = e.target as HTMLElement;
  const id = target.dataset.id;
  if (!id) return;
 
  if (target.classList.contains("btn--delete")) await handleDelete(id);
  if (target.classList.contains("btn--edit")) await handleEdit(id);
});
 
[subjectInput, messageInput].forEach((el) =>
  el.addEventListener("input", checkFormFilled)
);
[statusSelect, prioritySelect].forEach((el) =>
  el.addEventListener("change", checkFormFilled)
);
 
// ─── Init ─────────────────────────────────────────────────────────────────────
 
async function init(): Promise<void> {
  try {
    const userRes = await api.getUsers();
    const demoSelect = document.getElementById("demoUserSelect") as HTMLSelectElement;
    const demoLabel = document.getElementById("demoUserLabel") as HTMLElement;
 
    if (demoSelect) {
      userRes.items.forEach((u) => {
        const opt = document.createElement("option");
        opt.value = u.id;
        opt.textContent = `${u.name} (${u.email})`;
        demoSelect.appendChild(opt);
      });
 
      demoSelect.addEventListener("change", () => {
        const id = demoSelect.value || null;
        setCurrentUserId(id);
        if (demoLabel) {
          demoLabel.textContent = id
            ? `Авторизовано як: ${demoSelect.options[demoSelect.selectedIndex].text}`
            : "(для POST/PUT/DELETE)";
          demoLabel.style.color = id ? "#4ade80" : "#94a3b8";
        }
      });
    }
 
    await loadDropdowns();
    await loadTickets();
  } catch (e) {
    ui.showApiError(e as ApiError);
  }
}
 
init();