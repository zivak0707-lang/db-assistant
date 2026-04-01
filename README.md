# DB Assistant

AI-генератор баз даних. Проект розбитий на дві папки:

```
db-assistant/
├── server/   — Express.js API (Node.js)
└── client/   — React (Create React App)
```

## Запуск

### 1. Server

```bash
cd server
cp .env.example .env
# Вставте ваш GROQ_API_KEY у .env
npm install
npm run dev       # або npm start
```

Сервер запускається на http://localhost:5000

### 2. Client

```bash
cd client
npm install
npm start
```

Клієнт запускається на http://localhost:3000

Запити до `/api/*` автоматично проксуються на сервер (через поле `"proxy"` у `client/package.json`).

## API ендпоінти

| Метод | URL              | Опис                        |
|-------|------------------|-----------------------------|
| POST  | /api/generate    | Генерація схеми БД          |
| POST  | /api/refine      | Уточнення схеми через чат   |
| POST  | /api/normalize   | Перевірка нормальних форм   |
| POST  | /api/seed        | Генерація тестових даних    |
