# Система тікетів технічної підтримки

REST API для управління заявками в техпідтримку, побудований на Node.js + TypeScript + Express + SQLite.

---

## Запуск проекту

### Встановлення залежностей:
```bash
npm install
```

### Запуск в режимі розробки:
```bash
npm run dev
```

При запуску автоматично:
1. Відкривається SQLite база даних (`backend/data/app.db`)
2. Застосовуються всі міграції зі схемою БД
3. Запускається сервер на `http://localhost:3000`

### Наповнення бази тестовими даними (seed):
```bash
npm run seed
```
Створює 3 користувачів, 4 статуси, 5 тікетів, 4 повідомлення.

### Компіляція:
```bash
npm run build
```

### Запуск production збірки:
```bash
npm start
```

### Запуск тестів:
```bash
npm test
```

Сервер запускається на `http://localhost:3000`  
Документація Swagger: `http://localhost:3000/api-docs`

---

## База даних

SQLite файл зберігається локально: `backend/data/app.db`  
Файл не комітиться в репозиторій (додано в `.gitignore`).

### Схема БД

#### Таблиці та зв'язки

**Users**
| Поле | Тип | Обмеження |
|------|-----|-----------|
| id | TEXT | PRIMARY KEY |
| name | TEXT | NOT NULL |
| email | TEXT | NOT NULL, UNIQUE |
| createdAt | TEXT | NOT NULL |

**Statuses**
| Поле | Тип | Обмеження |
|------|-----|-----------|
| id | TEXT | PRIMARY KEY |
| name | TEXT | NOT NULL, UNIQUE |
| color | TEXT | NOT NULL |

**Tickets**
| Поле | Тип | Обмеження |
|------|-----|-----------|
| id | TEXT | PRIMARY KEY |
| subject | TEXT | NOT NULL |
| message | TEXT | NOT NULL |
| priority | TEXT | NOT NULL, CHECK (Low/Medium/High) |
| statusId | TEXT | NOT NULL, FK → Statuses(id) ON DELETE RESTRICT |
| authorId | TEXT | NOT NULL, FK → Users(id) ON DELETE RESTRICT |
| createdAt | TEXT | NOT NULL |
| updatedAt | TEXT | NOT NULL |
| deletedAt | TEXT | NULL (soft delete) |

**TicketMessages**
| Поле | Тип | Обмеження |
|------|-----|-----------|
| id | TEXT | PRIMARY KEY |
| ticketId | TEXT | NOT NULL, FK → Tickets(id) ON DELETE CASCADE |
| authorId | TEXT | NOT NULL, FK → Users(id) ON DELETE RESTRICT |
| content | TEXT | NOT NULL |
| createdAt | TEXT | NOT NULL |

#### Зв'язки
- `Users` 1:N `Tickets` (один користувач — багато тікетів)
- `Statuses` 1:N `Tickets` (один статус — багато тікетів)
- `Tickets` 1:N `TicketMessages` (один тікет — багато повідомлень)
- `Users` 1:N `TicketMessages` (один користувач — багато повідомлень)

#### Поведінка при видаленні
- Видалення User або Status заборонено якщо є пов'язані тікети (`ON DELETE RESTRICT`)
- Видалення Ticket каскадно видаляє всі його повідомлення (`ON DELETE CASCADE`)
- Тікети видаляються через soft delete (поле `deletedAt`)

### Міграції

Схема БД версіонується через систему міграцій у папці `backend/migrations/`:
- `001_create_users.sql`
- `002_create_statuses.sql`
- `003_create_tickets.sql`
- `004_create_ticket_messages.sql`
- `005_add_indexes.sql`

Таблиця `schema_migrations` зберігає які міграції вже застосовано. При кожному запуску застосовуються тільки нові.

---

## Endpoints

### Users
| Метод | URL | Опис |
|-------|-----|------|
| GET | /api/users | Список всіх користувачів |
| GET | /api/users/:id | Користувач за id |
| POST | /api/users | Створити користувача |
| PUT | /api/users/:id | Оновити користувача |
| DELETE | /api/users/:id | Видалити користувача |

### Statuses
| Метод | URL | Опис |
|-------|-----|------|
| GET | /api/statuses | Список всіх статусів |
| GET | /api/statuses/:id | Статус за id |
| POST | /api/statuses | Створити статус |
| PUT | /api/statuses/:id | Оновити статус |
| DELETE | /api/statuses/:id | Видалити статус |

### Tickets
| Метод | URL | Опис |
|-------|-----|------|
| GET | /api/tickets | Список тікетів (фільтрація, сортування, пагінація) |
| GET | /api/tickets/:id | Тікет за id |
| POST | /api/tickets | Створити тікет |
| PUT | /api/tickets/:id | Оновити тікет |
| PATCH | /api/tickets/:id | Часткове оновлення |
| DELETE | /api/tickets/:id | Soft delete тікету |

#### Параметри фільтрації для GET /api/tickets:
- `?statusId=` — фільтр за статусом
- `?priority=` — фільтр за пріоритетом (Low/Medium/High)
- `?authorId=` — фільтр за автором
- `?sortBy=createdAt|updatedAt|subject|priority` — сортування
- `?sortDir=asc|desc` — напрямок сортування
- `?page=1&pageSize=10` — пагінація

### Ticket Messages
| Метод | URL | Опис |
|-------|-----|------|
| GET | /api/tickets/:ticketId/messages | Повідомлення тікету |
| POST | /api/tickets/:ticketId/messages | Додати повідомлення |
| DELETE | /api/tickets/:ticketId/messages/:id | Видалити повідомлення |

### Analytics
| Метод | URL | Опис |
|-------|-----|------|
| GET | /api/analytics/tickets | Тікети з деталями автора і статусу (JOIN) |
| GET | /api/analytics/tickets?search=текст | Пошук тікетів по темі (LIKE) |
| GET | /api/analytics/tickets/count-by-status | Кількість тікетів по статусах (COUNT) |

---

## Демонстрація SQL Injection (навчальна)

Endpoint `GET /api/analytics/tickets?search=` використовує рядкову конкатенацію:

```typescript
const sql = `... WHERE t.subject LIKE '%${search}%'`;
```

**Чому це небезпечно:** користувацький ввід потрапляє напряму в SQL запит.

**Приклад "поганого" вводу:**
```
GET /api/analytics/tickets?search=%' OR '1'='1
```
Це змінить логіку WHERE і поверне всі записи незалежно від фільтру.

**Виправлення:** параметризовані запити (плейсхолдери `?`) — буде реалізовано в лаб №5.

---

## Приклади запитів

### Отримати всі тікети з фільтром:
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/tickets?priority=High&sortBy=createdAt&sortDir=desc" -Method GET
```

### Створити користувача:
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/users" -Method POST -ContentType "application/json" -Body '{"name": "Іван Петренко", "email": "ivan@example.com"}'
```

### Створити тікет:
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/tickets" -Method POST -ContentType "application/json" -Body '{"subject": "Проблема з входом", "message": "Не можу увійти в систему", "priority": "High", "statusId": "status-1", "authorId": "user-1"}'
```

### Аналітика — кількість тікетів по статусах:
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/analytics/tickets/count-by-status" -Method GET
```

### Пошук тікетів:
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/analytics/tickets?search=login" -Method GET
```

### Спроба створити дублікат email (409 Conflict):
```powershell
try { Invoke-RestMethod -Uri "http://localhost:3000/api/users" -Method POST -ContentType "application/json" -Body '{"name": "Test", "email": "alice@example.com"}' } catch { $_.ErrorDetails.Message }
```

---

## Структура проекту

```
backend/
├── src/
│   ├── controllers/       # Обробка HTTP запитів
│   ├── services/          # Бізнес-логіка
│   ├── repositories/      # Доступ до SQLite
│   ├── routes/            # Маршрути API
│   ├── db/                # SQLite підключення та міграції
│   │   ├── db.ts          # Відкриття файлу БД
│   │   ├── dbClient.ts    # Обгортки all/get/run
│   │   ├── migrate.ts     # Система міграцій
│   │   └── seed.ts        # Тестові дані
│   ├── dtos/              # DTO для запитів і відповідей
│   ├── models/            # Моделі даних
│   ├── validators/        # Валідація вхідних даних
│   ├── middleware/        # Logger, error handler
│   ├── errors/            # Клас ApiError
│   ├── app.ts             # Налаштування Express
│   └── index.ts           # Точка входу
├── migrations/            # SQL файли міграцій
├── data/                  # SQLite файл (не в репозиторії)
└── .gitignore
```