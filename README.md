# Заявки в техпідтримку

## Запуск проекту

### Бекенд
```bash
cd backend
npm install
npm run dev
```
Сервер запуститься на `http://localhost:3000`

### Фронтенд
```bash
cd frontend-ts
npm install
npm run dev
```
Відкрий `http://localhost:5173` у браузері.

## Структура фронтенду

frontend-ts/src/
config.ts      # API_BASE_URL, таймаут
dtos.ts        # TypeScript інтерфейси для всіх DTO
apiClient.ts   # HTTP-шар, AbortController, обробка помилок
ui.ts          # DOM-операції, стани, повідомлення
main.ts        # Логіка сценаріїв

## Правила сумісності DTO (не ламати формат)

1. Забороняється перейменовувати або видаляти поля які вже використовує фронтенд
2. Нові поля додаються як необов'язкові з дефолтними значеннями
3. Breaking changes можливі лише при введенні нової версії `/api/v2/`

## Приклади запитів для перевірки

### GET — список заявок
```bash
curl http://localhost:3000/api/v1/tickets
```

### GET — одна заявка
```bash
curl http://localhost:3000/api/v1/tickets/{id}
```

### POST — створити заявку
```bash
curl -X POST http://localhost:3000/api/v1/tickets \
  -H "Content-Type: application/json" \
  -d "{\"subject\":\"Test\",\"message\":\"Test message\",\"priority\":\"High\",\"statusId\":\"STATUS_ID\",\"authorId\":\"USER_ID\"}"
```

### PUT — оновити заявку
```bash
curl -X PUT http://localhost:3000/api/v1/tickets/{id} \
  -H "Content-Type: application/json" \
  -d "{\"subject\":\"Updated subject\",\"priority\":\"Low\"}"
```

### DELETE — видалити заявку
```bash
curl -X DELETE http://localhost:3000/api/v1/tickets/{id}
```

### Перевірка CORS помилки
Відкрити фронтенд як `file://` замість `http://` — браузер покаже CORS помилку.

### Перевірка помилки мережі
Зупинити бекенд і виконати будь-яку дію на фронтенді — з'явиться повідомлення "Помилка мережі або CORS".

### Перевірка таймауту
В `frontend-ts/src/config.ts` змінити `REQUEST_TIMEOUT_MS` на `1` і виконати запит.

### Перевірка валідації (400)
```bash
curl -X POST http://localhost:3000/api/v1/tickets \
  -H "Content-Type: application/json" \
  -d "{}"
```