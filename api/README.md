# Avalog API

API for the **Avalog - Avalon Hub** application, designed to manage users, groups, game sessions, and statistics for the Avalon game.

---

## 🛠 Technologies

- **Node.js 20+**
- **Fastify** (with TypeScript and Zod)
- **Prisma** with PostgreSQL
- **Docker** and **Docker Compose**
- **Swagger** for documentation and testing
- **JWT** for authentication

---

## ⚡ Main Features

- User registration, login, and profile management
- Creation and management of groups
- Game sessions registration with participants
- User statistics and leaderboards
- Achievements / badges

---

## 📦 Installation

1. Clone the repository:

```bash
git clone <repo-url>
cd api-avalog
```

2. Install dependencies using **pnpm**:

```bash
pnpm install
```

3. Set up your `.env` file in the project root:

```env
PORT= ****
JWT_SECRET= *****
DATABASE_URL= *****
```

> Adjust `DATABASE_URL` if PostgreSQL is running on a different host or port.

---

## 🐳 Database (Docker)

The project provides a `docker-compose.yml` to run PostgreSQL:

```bash
docker compose up -d
```

- **User:** `usuario`
- **Password:** `senha`
- **Database:** `db`
- **Port:** `porta`

Check if it's running:

```bash
docker ps
```

To remove old volumes or reset the DB:

```bash
docker compose down -v
```

---

## 🏗 Prisma

1. Generate the Prisma client:

```bash
pnpm prisma generate
```

2. Run migrations:

```bash
pnpm prisma migrate dev --name init
```

3. Open Prisma Studio to view data:

```bash
pnpm prisma studio
```

---

## 🚀 Running the Server

```bash
pnpm dev
```

- Server running at `http://localhost:3333`
- Swagger UI available at `http://localhost:3333/docs`

---

## 📄 Swagger / POSTMAN

- **Swagger UI:** `http://localhost:3333/docs`
- **Postman Workspace:** `https://leonardo-tolotti-4727117.postman.co/workspace/a79e6221-1daf-4e81-a1ae-8c82fea7da97`

---

## 🔑 Authentication

- `POST /register` → Create a user
- `POST /login` → Receive a JWT token
- Use the token for protected routes in Swagger or Postman

Example request body for registration:

```json
{
  "email": "user@email.com",
  "password": "password12345",
  "nickname": "Merlin"
}
```

---

## 📁 Project Structure

```
src/
├─ controllers/     # Business logic
├─ routes/          # Route definitions
├─ plugins/         # Fastify plugins (Swagger, JWT, etc.)
├─ server.ts        # Server entry point
prisma/
├─ schema.prisma    # Models and migrations
docker-compose.yml  # PostgreSQL container
.env                # Environment variables
```

---

## 📝 Scripts

```bash
pnpm dev       # Start server with TSX
pnpm prisma generate
pnpm prisma migrate dev --name init
pnpm prisma studio
```

---

## 🔮 Roadmap / MVP Phase

- User registration and login
- Group creation and member management
- Adding game sessions with participants and results
- Basic statistics dashboard
- Global leaderboard

---
