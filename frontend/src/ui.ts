import type { ApiError, StatusDto, TicketListItemDto, UserDto } from "./dtos";

// ─── Notice ───────────────────────────────────────────────────────────────────

let noticeTimer: ReturnType<typeof setTimeout> | null = null;

export function showNotice(text: string, isError = false): void {
  const el = document.getElementById("notice")!;
  el.textContent = text;
  el.className = "notice " + (isError ? "notice--error" : "notice--success");
  if (noticeTimer) clearTimeout(noticeTimer);
  noticeTimer = setTimeout(() => {
    el.textContent = "";
    el.className = "notice";
  }, 5000);
}

export function showApiError(err: ApiError): void {
  const detail = err.errors
    ? err.errors.map((e) => `${e.field ? e.field + ": " : ""}${e.message}`).join("; ")
    : err.details ?? "";
  showNotice(`Помилка (${err.status || "мережа"}): ${err.message}${detail ? " — " + detail : ""}`, true);
}

// ─── List status ──────────────────────────────────────────────────────────────

export function renderListStatus(
  status: "loading" | "success" | "empty" | "error",
  err?: ApiError
): void {
  const el = document.getElementById("listStatus")!;
  if (status === "loading") {
    el.innerHTML = `<span class="status-loading">Завантаження...</span>`;
  } else if (status === "empty") {
    el.innerHTML = `<span class="status-empty">Заявок ще немає</span>`;
  } else if (status === "error") {
    el.innerHTML = `<span class="status-error">Помилка завантаження: ${err?.message ?? "невідома"}</span>`;
  } else {
    el.innerHTML = "";
  }
}

// ─── Table ────────────────────────────────────────────────────────────────────

export function renderTable(
  tickets: TicketListItemDto[],
  statuses: StatusDto[],
  users: UserDto[]
): void {
  const tbody = document.getElementById("tableBody")!;

  const getStatus = (id: string) =>
    statuses.find((s) => s.id === id)?.name ?? id;
  const getUser = (id: string) =>
    users.find((u) => u.id === id)?.name ?? id;

  const priorityBadge: Record<string, string> = {
    High: "badge badge--high",
    Medium: "badge badge--medium",
    Low: "badge badge--low",
  };

  tbody.innerHTML = tickets
    .map(
      (t) => `
    <tr>
      <td>${t.subject}</td>
      <td>${getStatus(t.statusId)}</td>
      <td><span class="${priorityBadge[t.priority] ?? "badge"}">${t.priority}</span></td>
      <td>${getUser(t.authorId)}</td>
      <td>${new Date(t.createdAt).toLocaleDateString("uk-UA")}</td>
      <td>
        <button class="btn btn--edit" data-id="${t.id}">Редагувати</button>
        <button class="btn btn--delete" data-id="${t.id}">Видалити</button>
      </td>
    </tr>`
    )
    .join("");
}

// ─── Form state ───────────────────────────────────────────────────────────────

export function setFormLoading(isLoading: boolean): void {
  const btn = document.getElementById("submitBtn") as HTMLButtonElement;
  const cancelBtn = document.getElementById("cancelBtn") as HTMLButtonElement;
  btn.disabled = isLoading;
  cancelBtn.disabled = isLoading;
  btn.textContent = isLoading ? "Збереження..." : "Зберегти";
}

export function setDeleteLoading(id: string, isLoading: boolean): void {
  const btn = document.querySelector(
    `button.btn--delete[data-id="${id}"]`
  ) as HTMLButtonElement | null;
  if (btn) btn.disabled = isLoading;
}

// ─── Validation errors ────────────────────────────────────────────────────────

export function clearFieldErrors(): void {
  document.querySelectorAll(".field-error").forEach((el) => {
    (el as HTMLElement).textContent = "";
  });
  document.querySelectorAll(".invalid").forEach((el) => {
    el.classList.remove("invalid");
  });
}

export function showFieldError(field: string, message: string): void {
  const input = document.getElementById(field);
  const errorEl = document.getElementById(field + "Error");
  if (input) input.classList.add("invalid");
  if (errorEl) errorEl.textContent = message;
}

// ─── Populate dropdowns ───────────────────────────────────────────────────────

export function populateStatuses(
  statuses: StatusDto[],
  selectIds: string[]
): void {
  const options =
    `<option value="">Оберіть статус</option>` +
    statuses.map((s) => `<option value="${s.id}">${s.name}</option>`).join("");
  selectIds.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = options;
  });
}

// ─── Edit mode ────────────────────────────────────────────────────────────────

export function setEditMode(isEdit: boolean): void {
  const btn = document.getElementById("submitBtn") as HTMLButtonElement;
  const cancelBtn = document.getElementById("cancelBtn")!;
  btn.textContent = isEdit ? "Оновити" : "Зберегти";
  cancelBtn.style.display = isEdit ? "inline-block" : "none";
  document.getElementById("formTitle")!.textContent = isEdit
    ? "Редагування заявки"
    : "Нова заявка";
}