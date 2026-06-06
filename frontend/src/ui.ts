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
    // Повідомлення про помилку через textContent — не innerHTML
    const span = document.createElement("span");
    span.className = "status-error";
    span.textContent = `Помилка завантаження: ${err?.message ?? "невідома"}`;
    el.innerHTML = "";
    el.appendChild(span);
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
  tbody.innerHTML = "";

  const getStatus = (id: string) => statuses.find((s) => s.id === id)?.name ?? id;
  const getUser = (id: string) => users.find((u) => u.id === id)?.name ?? id;

  const priorityBadge: Record<string, string> = {
    High: "badge badge--high",
    Medium: "badge badge--medium",
    Low: "badge badge--low",
  };

  for (const t of tickets) {
    const tr = document.createElement("tr");

    // subject — дані користувача → textContent (не innerHTML!)
    const tdSubject = document.createElement("td");
    tdSubject.textContent = t.subject;

    // status name → textContent
    const tdStatus = document.createElement("td");
    tdStatus.textContent = getStatus(t.statusId);

    // priority — через textContent
    const tdPriority = document.createElement("td");
    const badge = document.createElement("span");
    badge.className = priorityBadge[t.priority] ?? "badge";
    badge.textContent = t.priority;
    tdPriority.appendChild(badge);

    // author name — дані з БД → textContent
    const tdAuthor = document.createElement("td");
    tdAuthor.textContent = getUser(t.authorId);

    // date — форматована дата
    const tdDate = document.createElement("td");
    tdDate.textContent = new Date(t.createdAt).toLocaleDateString("uk-UA");

    // кнопки — data-id через .dataset, не через innerHTML
    const tdActions = document.createElement("td");

    const editBtn = document.createElement("button");
    editBtn.className = "btn btn--edit";
    editBtn.dataset.id = t.id;
    editBtn.textContent = "Редагувати";

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn btn--delete";
    deleteBtn.dataset.id = t.id;
    deleteBtn.textContent = "Видалити";

    tdActions.appendChild(editBtn);
    tdActions.appendChild(deleteBtn);

    tr.append(tdSubject, tdStatus, tdPriority, tdAuthor, tdDate, tdActions);
    tbody.appendChild(tr);
  }
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
  selectIds.forEach((id) => {
    const el = document.getElementById(id) as HTMLSelectElement | null;
    if (!el) return;
    el.innerHTML = "";

    const defaultOpt = document.createElement("option");
    defaultOpt.value = "";
    defaultOpt.textContent = "Оберіть статус";
    el.appendChild(defaultOpt);

    for (const s of statuses) {
      const opt = document.createElement("option");
      opt.value = s.id;
      opt.textContent = s.name;
      el.appendChild(opt);
    }
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