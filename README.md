<div align="center">

# 🗄️ DB Assistant

### AI-powered Database Design Tool

[![Hackathon 2026](https://img.shields.io/badge/Hackathon-2026-blueviolet?style=for-the-badge&logo=trophy)](https://github.com)
[![Team coders.exe](https://img.shields.io/badge/Team-coders.exe-ff69b4?style=for-the-badge&logo=github)](https://github.com)
[![React 19](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)](https://nodejs.org)
[![Groq AI](https://img.shields.io/badge/AI-Groq%20llama--3.3--70b-F54E06?style=for-the-badge&logo=meta)](https://groq.com)
[![License MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

<br/>

> **Тема хакатону #5:** AI-Databases — Асистент для побудови концептуальних моделей БД з генерацією SQL

<br/>

*Опишіть предметну область звичайною мовою — отримайте повноцінну схему бази даних за секунди.*  
*Describe your domain in plain language — get a complete database schema in seconds.*

</div>

---

## 📑 Зміст / Table of Contents

- [About the Project](#-about-the-project)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Team](#-team--codersexe)
- [License](#-license)

---

## 🧠 About the Project

**DB Assistant** — це інтелектуальний інструмент для проектування реляційних баз даних, побудований на основі великої мовної моделі. Користувач описує предметну область у вільній формі, а система автоматично:

- будує концептуальну ER-модель;
- пропонує структуру таблиць з атрибутами та зв'язками;
- генерує готовий SQL-код для обраної СУБД.

**DB Assistant** is an AI-driven tool that transforms a plain-language description of a subject area into a complete relational database design — including an ER diagram, normalized table structure, and production-ready SQL. Built to support students, developers, and analysts without replacing their thinking.

---

## ✨ Features

| | Feature | Description |
|--|---------|-------------|
| 🗺️ | **ER Diagram Generation** | Automatically builds an entity-relationship diagram rendered interactively with Mermaid.js |
| 📋 | **Editable Table Structure** | Proposes tables with columns, types, and keys — fully editable in the browser |
| 💾 | **SQL Code Generation** | Exports ready-to-run SQL for **MySQL**, **PostgreSQL**, and **SQLite** |
| 💬 | **AI Refinement Chat** | Converse with the AI to adjust, extend, or rethink the schema in real time |
| 🔬 | **Normalization Analysis** | Checks your schema against **1NF**, **2NF**, and **3NF** rules with actionable suggestions |
| 🌱 | **Seed Data Generation** | Generates realistic INSERT statements to populate your tables with sample data |
| 📜 | **Request History** | All previous generations are stored locally (localStorage) for quick access |
| ⏱️ | **Rate Limit Handling** | Graceful countdown UI when the AI API rate limit is reached |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| [React](https://react.dev) | 19.2 | UI framework |
| [React Router](https://reactrouter.com) | 7.13 | Client-side routing |
| [Mermaid.js](https://mermaid.js.org) | 11.14 | ER diagram rendering |
| CSS Modules | — | Scoped component styling |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| [Node.js](https://nodejs.org) | LTS | Runtime |
| [Express.js](https://expressjs.com) | 4.18 | REST API server |
| [Groq SDK](https://groq.com) | 1.1 | AI inference client |
| [dotenv](https://github.com/motdotla/dotenv) | 16.4 | Environment configuration |
| [cors](https://github.com/expressjs/cors) | 2.8 | Cross-origin resource sharing |

### AI Model
| Model | Provider | Context Window |
|-------|----------|----------------|
| `llama-3.3-70b-versatile` | [Groq](https://groq.com) | 128k tokens, ultra-fast inference |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ and **npm**
- A free [Groq API key](https://console.groq.com)

### 1. Clone the repository

```bash
git clone https://github.com/course-2026-np/db-assistant.git
cd db-assistant
```

### 2. Install dependencies

```bash
# Install frontend dependencies (project root)
npm install

# Install backend dependencies
cd server && npm install && cd ..
```

### 3. Configure environment variables

```bash
cp server/.env.example server/.env
# Open server/.env and fill in your GROQ_API_KEY
```

### 4. Run the application

Open **two terminal windows**:

```bash
# Terminal 1 — Start the backend server (port 5000)
cd server
npm run dev
```

```bash
# Terminal 2 — Start the React frontend (port 3000)
npm start
```

The app will be available at **[http://localhost:3000](http://localhost:3000)**.

---

## 🔐 Environment Variables

Create `server/.env` based on `server/.env.example`:

```env
# Your Groq API key — get it at https://console.groq.com
GROQ_API_KEY=gsk_...

# Port for the Express server
PORT=5000

# URL of the React frontend (for CORS)
CLIENT_URL=http://localhost:3000
```

| Variable | Required | Description |
|----------|----------|-------------|
| `GROQ_API_KEY` | ✅ Yes | Authentication key for the Groq inference API |
| `PORT` | ⚙️ Optional | Server port (default: `5000`) |
| `CLIENT_URL` | ⚙️ Optional | Frontend origin allowed by CORS (default: `http://localhost:3000`) |

---

## 📡 API Endpoints

All endpoints are served by the Express backend.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Health check — returns API status |
| `POST` | `/api/generate` | Generate ER diagram + table structure + SQL from a text description |
| `POST` | `/api/normalize` | Analyze a schema for 1NF / 2NF / 3NF compliance |
| `POST` | `/api/refine` | Refine an existing schema via follow-up chat message |
| `POST` | `/api/seed` | Generate seed INSERT statements for a given table structure |

### Example request — `/api/generate`

```json
POST /api/generate
Content-Type: application/json

{
  "description": "An online bookstore with customers, orders, books, and authors"
}
```

---

## 👥 Team — coders.exe

> Hackathon 2026 · Topic #5 · AI-Databases

<table>
  <tr>
    <td align="center" width="200">
      <img src="src/assets/serioga.png" width="100" height="100" style="border-radius:50%;object-fit:cover" alt="Zivak Serhii"/><br/>
      <strong>Zivak Serhii</strong><br/>
      <sub>Backend & AI Architect</sub><br/>
      <sub>SQL Generation · AI Logic Integration</sub>
    </td>
    <td align="center" width="200">
      <img src="src/assets/roma.png" width="100" height="100" style="border-radius:50%;object-fit:cover" alt="Novykov Roman"/><br/>
      <strong>Novykov Roman</strong><br/>
      <sub>Frontend & Visual Developer</sub><br/>
      <sub>Web Integration · Interface Engineering</sub>
    </td>
    <td align="center" width="200">
      <img src="src/assets/zhenya.png" width="100" height="100" style="border-radius:50%;object-fit:cover" alt="Zelinska Yevheniia"/><br/>
      <strong>Zelinska Yevheniia</strong><br/>
      <sub>UX & UI Designer</sub><br/>
      <sub>Visual Identity · Web Design</sub>
    </td>
    <td align="center" width="200">
      <img src="src/assets/lilia.png" width="100" height="100" style="border-radius:50%;object-fit:cover" alt="Henina Lilia"/><br/>
      <strong>Henina Lilia</strong><br/>
      <sub>QA & Product Manager</sub><br/>
      <sub>Copywriting · Pitch Deck</sub>
    </td>
  </tr>
</table>

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Made with ❤️ by **coders.exe** · Hackathon 2026

</div>
