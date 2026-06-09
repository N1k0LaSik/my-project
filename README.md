Стек

Бекенд: Node.js, Express, TypeScript, SQLite
Фронтенд: TypeScript, Vite
БД: SQLite (файл dev.db)


Запуск проекту
bash# Бекенд
cd backend
npm install
npm run seed
npm run dev

# Фронтенд (окремий термінал)
cd frontend
npm install
npm run dev
Бекенд запускається на http://localhost:3000, фронтенд на http://localhost:5173.

Demo Auth
Ідентифікація реалізована через заголовок X-Demo-UserId. На фронтенді у верхній панелі є dropdown де можна обрати поточного користувача — після вибору всі мутаційні запити (POST/PUT/DELETE) автоматично передають цей заголовок.
Seed дані містять трьох користувачів:

user-1 — Alice Johnson
user-2 — Bob Smith
user-3 — Carol White

Поведінка бекенду:

немає заголовку X-Demo-UserId → 401
userId не існує в БД → 401
валідний userId → запит виконується з контекстом цього користувача


Сценарій А — SQL Injection
Вразливість
Пошук по тікетах в analytics.repository.ts будував SQL запит через конкатенацію рядка з даними користувача. Параметр search з URL потрапляв напряму в SQL що дозволяло змінити структуру запиту.
Виправлення
У dbClient.ts всі функції all(), get(), run() оновлено — додано параметр params: unknown[] = [] який передається в SQLite драйвер окремо від SQL шаблону. У всіх репозиторіях (ticket.repository.ts, user.repository.ts, status.repository.ts, ticket-message.repository.ts, analytics.repository.ts) конкатенація замінена на ? параметри. Для sortBy реалізовано allowlist з дозволених назв колонок — параметризація не працює для назв колонок тому використовується перевірка через Set.

Перевірка
bash# Спроба ін'єкції — повертає порожній масив []
GET http://localhost:3000/api/v1/analytics/tickets?search=' OR '1'='1' --

# Нормальний пошук — повертає тікети де subject містить "login"
GET http://localhost:3000/api/v1/analytics/tickets?search=login

Сценарій Б — XSS
Вразливість
Таблиця тікетів на фронтенді будувалась через innerHTML — дані з сервера вставлялись напряму в HTML розмітку. Якщо поле subject містило HTML теги або JS код — браузер виконував їх.
Виправлення
У frontend/src/ui.ts функція renderTable повністю переписана — кожен елемент таблиці створюється через document.createElement() а текстовий вміст встановлюється через textContent. Браузер завжди інтерпретує значення textContent як звичайний текст незалежно від його вмісту.
Перевірка
Створити тікет з subject:
<img src=x onerror=alert('XSS')>
Після виправлення цей рядок відображається в таблиці як звичайний текст без виконання коду.

Сценарій В — Broken Access Control (IDOR)
Вразливість
Доступ до тікетів надавався лише за id без перевірки чи належить цей тікет поточному користувачу. Будь-який авторизований користувач міг змінити або видалити чужий тікет підставивши інший id в URL.
Виправлення
Реалізовано в трьох місцях у зв'язці:
demo-auth.middleware.ts — перевіряє заголовок X-Demo-UserId і існування користувача в БД, встановлює req.user = { id }.
ticket.routes.ts — підключає demoAuth до всіх мутаційних маршрутів:
typescriptticketRoutes.post("/", demoAuth, TicketController.createTicket);
ticketRoutes.put("/:id", demoAuth, TicketController.updateTicket);
ticketRoutes.delete("/:id", demoAuth, TicketController.deleteTicket);
ticket.repository.ts — методи updateByOwner і softDeleteByOwner перевіряють власника безпосередньо в SQL через AND authorId = ?. Якщо тікет існує але належить іншому користувачу — SQLite повертає 0 змінених рядків і контролер повертає 404.
Перевірка
bash# Без заголовку — 401
DELETE http://localhost:3000/api/v1/tickets/ticket-1

# Невідомий userId — 401
DELETE http://localhost:3000/api/v1/tickets/ticket-1
X-Demo-UserId: fake-user-999

# Чужий тікет — 404 (ticket-1 належить user-1)
DELETE http://localhost:3000/api/v1/tickets/ticket-1
X-Demo-UserId: user-2

# Свій тікет — 204
DELETE http://localhost:3000/api/v1/tickets/ticket-2
X-Demo-UserId: user-2

Сценарій Г — Security Misconfiguration
Вразливість
Сервер міг повертати клієнту stack trace і внутрішні деталі помилок що розкривало структуру проекту. Були відсутні базові HTTP security headers. CORS не був обмежений конкретними origins.

Виправлення
security-headers.middleware.ts — додає чотири заголовки до кожної відповіді:

X-Content-Type-Options: nosniff — захист від MIME-sniffing
X-Frame-Options: DENY — захист від clickjacking
Referrer-Policy: no-referrer — не передає Referer при переходах
Strict-Transport-Security — примушує використовувати HTTPS

error-handler.middleware.ts — в production режимі клієнт бачить тільки "Unexpected server error" без внутрішніх деталей. Stack trace логується лише на сервері.
app.ts — CORS обмежений explicit whitelist з чотирьох дозволених origins. X-Demo-UserId явно вказаний в allowedHeaders.
Перевірка
bashcurl.exe -I http://localhost:3000/health
Відповідь містить всі чотири security headers.

Структура захисних файлів
backend/src/
├── db/
│   └── dbClient.ts                        # параметризовані запити
├── middleware/
│   ├── demo-auth.middleware.ts            # ідентифікація через X-Demo-UserId
│   ├── security-headers.middleware.ts     # HTTP security headers
│   └── error-handler.middleware.ts        # централізована обробка помилок
├── repositories/
│   ├── ticket.repository.ts               # методи ByOwner для IDOR захисту
│   ├── analytics.repository.ts            # параметризований пошук
│   └── ...
└── routes/
    └── ticket.routes.ts                   # demoAuth на мутаційних маршрутах

frontend/src/
├── ui.ts                                  # DOM API замість innerHTML
└── apiClient.ts                           # автоматична передача X-Demo-UserId