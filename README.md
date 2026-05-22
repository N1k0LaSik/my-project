Система тікетів технічної підтримки
REST API для управління заявками в техпідтримку, побудований на Node.js + TypeScript + Express.
---
Запуск проекту
Встановлення залежностей:
```bash
npm install
```
Запуск в режимі розробки:
```bash
npm run dev
```
Компіляція:
```bash
npm run build
```
Запуск production збірки:
```bash
npm start
```
Запуск тестів:
```bash
npm test
```
Сервер запускається на `http://localhost:3000`
Документація Swagger: `http://localhost:3000/api-docs`
---
Реалізовані сутності
Users — користувачі системи
Statuses — статуси тікетів
Tickets — заявки в техпідтримку
Ticket Messages — повідомлення до тікетів
---
Демонстрація API
> Всі команди виконуються в PowerShell при запущеному сервері.
> Де написано СЮДИ_ID — підставити реальний id з попередньої відповіді.
---
1. Перевірка сервера
Сервер працює і повертає статус:
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/health" -Method GET
```
Показати тільки код відповіді:
```powershell
(Invoke-WebRequest -Uri "http://localhost:3000/health" -Method GET).StatusCode
```
---
2. Users
Отримати список всіх користувачів:
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/users" -Method GET
```
Показати тільки код відповіді:
```powershell
(Invoke-WebRequest -Uri "http://localhost:3000/api/users" -Method GET).StatusCode
```
Отримати користувача за ID:
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/users/СЮДИ_ID" -Method GET
```
Показати тільки код відповіді:
```powershell
(Invoke-WebRequest -Uri "http://localhost:3000/api/users/СЮДИ_ID" -Method GET).StatusCode
```
Створити користувача:
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/users" -Method POST -ContentType "application/json" -Body '{"name": "Іван Петренко", "email": "ivan@example.com"}'
```
Показати тільки код відповіді:
```powershell
(Invoke-WebRequest -Uri "http://localhost:3000/api/users" -Method POST -ContentType "application/json" -Body '{"name": "Іван Петренко", "email": "ivan@example.com"}').StatusCode
```
Оновити користувача:
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/users/СЮДИ_ID" -Method PUT -ContentType "application/json" -Body '{"name": "Іван Оновлений", "email": "ivan.new@example.com"}'
```
Показати тільки код відповіді:
```powershell
(Invoke-WebRequest -Uri "http://localhost:3000/api/users/СЮДИ_ID" -Method PUT -ContentType "application/json" -Body '{"name": "Іван Оновлений", "email": "ivan.new@example.com"}').StatusCode
```
Видалити користувача:
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/users/СЮДИ_ID" -Method DELETE
```
Показати тільки код відповіді:
```powershell
(Invoke-WebRequest -Uri "http://localhost:3000/api/users/СЮДИ_ID" -Method DELETE).StatusCode
```
---
3. Statuses
Отримати список всіх статусів:
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/statuses" -Method GET
```
Показати тільки код відповіді:
```powershell
(Invoke-WebRequest -Uri "http://localhost:3000/api/statuses" -Method GET).StatusCode
```
Створити статус:
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/statuses" -Method POST -ContentType "application/json" -Body '{"name": "Pending", "color": "#9b59b6"}'
```
Показати тільки код відповіді:
```powershell
(Invoke-WebRequest -Uri "http://localhost:3000/api/statuses" -Method POST -ContentType "application/json" -Body '{"name": "Pending", "color": "#9b59b6"}').StatusCode
```
---
4. Tickets
Отримати список всіх тікетів:
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/tickets" -Method GET
```
Показати тільки код відповіді:
```powershell
(Invoke-WebRequest -Uri "http://localhost:3000/api/tickets" -Method GET).StatusCode
```
Отримати тікет за ID:
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/tickets/СЮДИ_ID" -Method GET
```
Показати тільки код відповіді:
```powershell
(Invoke-WebRequest -Uri "http://localhost:3000/api/tickets/СЮДИ_ID" -Method GET).StatusCode
```
Створити тікет:
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/tickets" -Method POST -ContentType "application/json" -Body '{"subject": "Проблема з входом", "message": "Не можу увійти в систему вже другий день", "priority": "High", "statusId": "00000000-0000-0000-0001-000000000001", "authorId": "СЮДИ_ID_КОРИСТУВАЧА"}'
```
Показати тільки код відповіді:
```powershell
(Invoke-WebRequest -Uri "http://localhost:3000/api/tickets" -Method POST -ContentType "application/json" -Body '{"subject": "Проблема з входом", "message": "Не можу увійти в систему вже другий день", "priority": "High", "statusId": "00000000-0000-0000-0001-000000000001", "authorId": "СЮДИ_ID_КОРИСТУВАЧА"}').StatusCode
```
Оновити тікет повністю (PUT):
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/tickets/СЮДИ_ID" -Method PUT -ContentType "application/json" -Body '{"subject": "Оновлена тема", "message": "Оновлений текст повідомлення тут", "priority": "Low", "statusId": "00000000-0000-0000-0001-000000000002"}'
```
Показати тільки код відповіді:
```powershell
(Invoke-WebRequest -Uri "http://localhost:3000/api/tickets/СЮДИ_ID" -Method PUT -ContentType "application/json" -Body '{"subject": "Оновлена тема", "message": "Оновлений текст повідомлення тут", "priority": "Low", "statusId": "00000000-0000-0000-0001-000000000002"}').StatusCode
```
Часткове оновлення тікету (PATCH) — оновлює тільки передані поля:
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/tickets/СЮДИ_ID" -Method PATCH -ContentType "application/json" -Body '{"priority": "High"}'
```
Показати тільки код відповіді:
```powershell
(Invoke-WebRequest -Uri "http://localhost:3000/api/tickets/СЮДИ_ID" -Method PATCH -ContentType "application/json" -Body '{"priority": "High"}').StatusCode
```
Видалити тікет — soft delete, тікет позначається як видалений але залишається в пам'яті:
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/tickets/СЮДИ_ID" -Method DELETE
```
Показати тільки код відповіді:
```powershell
(Invoke-WebRequest -Uri "http://localhost:3000/api/tickets/СЮДИ_ID" -Method DELETE).StatusCode
```
---
5. Фільтрація, сортування, пагінація
Фільтрація за статусом:
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/tickets?statusId=00000000-0000-0000-0001-000000000001" -Method GET
```
Показати тільки код відповіді:
```powershell
(Invoke-WebRequest -Uri "http://localhost:3000/api/tickets?statusId=00000000-0000-0000-0001-000000000001" -Method GET).StatusCode
```
Фільтрація за пріоритетом:
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/tickets?priority=High" -Method GET
```
Показати тільки код відповіді:
```powershell
(Invoke-WebRequest -Uri "http://localhost:3000/api/tickets?priority=High" -Method GET).StatusCode
```
Сортування за пріоритетом від високого до низького:
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/tickets?sortBy=priority&sortDir=desc" -Method GET
```
Показати тільки код відповіді:
```powershell
(Invoke-WebRequest -Uri "http://localhost:3000/api/tickets?sortBy=priority&sortDir=desc" -Method GET).StatusCode
```
Сортування за датою створення:
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/tickets?sortBy=createdAt&sortDir=asc" -Method GET
```
Показати тільки код відповіді:
```powershell
(Invoke-WebRequest -Uri "http://localhost:3000/api/tickets?sortBy=createdAt&sortDir=asc" -Method GET).StatusCode
```
Пагінація — перша сторінка по 2 записи:
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/tickets?page=1&pageSize=2" -Method GET
```
Показати тільки код відповіді:
```powershell
(Invoke-WebRequest -Uri "http://localhost:3000/api/tickets?page=1&pageSize=2" -Method GET).StatusCode
```
Пагінація — друга сторінка:
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/tickets?page=2&pageSize=2" -Method GET
```
Показати тільки код відповіді:
```powershell
(Invoke-WebRequest -Uri "http://localhost:3000/api/tickets?page=2&pageSize=2" -Method GET).StatusCode
```
---
6. Валідація — 400 Bad Request
Спроба створити тікет з некоректними даними — повертає 400 з описом всіх помилок:
```powershell
try { Invoke-RestMethod -Uri "http://localhost:3000/api/tickets" -Method POST -ContentType "application/json" -Body '{"subject": "ab"}' } catch { $_.ErrorDetails.Message }
```
Показати тільки код відповіді:
```powershell
try { Invoke-WebRequest -Uri "http://localhost:3000/api/tickets" -Method POST -ContentType "application/json" -Body '{"subject": "ab"}' } catch { $_.Exception.Response.StatusCode.value__ }
```
Спроба створити користувача без обов'язкових полів:
```powershell
try { Invoke-RestMethod -Uri "http://localhost:3000/api/users" -Method POST -ContentType "application/json" -Body '{}' } catch { $_.ErrorDetails.Message }
```
Показати тільки код відповіді:
```powershell
try { Invoke-WebRequest -Uri "http://localhost:3000/api/users" -Method POST -ContentType "application/json" -Body '{}' } catch { $_.Exception.Response.StatusCode.value__ }
```
---
7. Помилка 404 Not Found
Запит до неіснуючого тікету:
```powershell
try { Invoke-RestMethod -Uri "http://localhost:3000/api/tickets/non-existing-id" -Method GET } catch { $_.ErrorDetails.Message }
```
Показати тільки код відповіді:
```powershell
try { Invoke-WebRequest -Uri "http://localhost:3000/api/tickets/non-existing-id" -Method GET } catch { $_.Exception.Response.StatusCode.value__ }
```
Запит до неіснуючого користувача:
```powershell
try { Invoke-RestMethod -Uri "http://localhost:3000/api/users/non-existing-id" -Method GET } catch { $_.ErrorDetails.Message }
```
Показати тільки код відповіді:
```powershell
try { Invoke-WebRequest -Uri "http://localhost:3000/api/users/non-existing-id" -Method GET } catch { $_.Exception.Response.StatusCode.value__ }
```
---
8. Тести
Запуск всіх unit-тестів:
```bash
npm test
```
---
Структура проекту
```
src/
├── controllers/       # Обробка HTTP запитів
├── services/          # Бізнес-логіка
├── repositories/      # Зберігання даних в пам'яті
├── routes/            # Маршрути API
├── dtos/              # DTO для запитів і відповідей
├── models/            # Моделі даних
├── validators/        # Валідація вхідних даних
├── middleware/        # Logger, error handler
├── errors/            # Клас ApiError
├── swagger.ts         # Конфігурація Swagger
├── app.ts             # Налаштування Express
└── index.ts           # Точка входу
```