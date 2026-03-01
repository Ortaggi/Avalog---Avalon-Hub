# Avalog - Architettura Frontend

## Tecnologie

- **Angular 21** (standalone components, lazy loading)
- **Bootstrap 5** (SCSS + JS)
- **SCSS** per gli stili custom
- **Backend API** Fastify + Prisma + PostgreSQL (via Docker)

---

## Struttura Progetto
```
client/src/app/
├── core/
│   ├── api/                # ApiFactoryService, BackendApi, ApiInterface
│   ├── auth.guard.ts       # Protegge route autenticate
│   └── guest.guard.ts      # Blocca accesso a login se già autenticato
├── features/
│   ├── auth/               # Login, registrazione
│   │   ├── login/
│   │   ├── register/
│   │   └── layout.component.ts
│   ├── dashboard/          # Dashboard statistiche
│   ├── matches/            # Gestione partite
│   │   └── pages/
│   │       ├── matches-list/
│   │       └── match-create/
│   ├── groups/             # Gestione gruppi
│   │   └── pages/
│   │       └── group-list/
│   └── logged-layout.component.ts
└── shared/
    ├── models/             # Interfacce TypeScript (Group, GameDetail, ecc.)
    └── services/           # Servizi Angular (GroupService, GameService, UsersService)
```

---

## Routing

File: `client/src/app/app.routes.ts`

| Path | Componente | Guard |
|------|------------|-------|
| `/` | → redirect a `/dashboard` | - |
| `/auth/login` | LoginComponent | guestGuard |
| `/auth/register` | RegisterComponent | guestGuard |
| `/dashboard` | DashboardHomeComponent | authGuard |
| `/groups` | GroupsListComponent | authGuard |
| `/games` | MatchesListComponent | authGuard |
| `/games/create` | MatchCreateComponent | authGuard |
| `/games/:id` | MatchCreateComponent | authGuard |

---

## Autenticazione

### Flow
1. Utente inserisce credenziali
2. `AuthService` chiama `POST /api/auth/login` via `BackendApi`
3. Il token JWT viene salvato (cookie/localStorage)
4. `authGuard` verifica la sessione tramite `GET /api/auth/me`
5. `guestGuard` impedisce accesso a login se già autenticato

---

## API Layer

### Struttura
```
ApiFactoryService           → decide quale implementazione usare
BackendApi (backend.ts)     → implementazione HTTP verso Fastify
ApiInterface                → contratto comune
```

### BackendUrl (environment files)
- `environment.ts` (production): `backendUrl: '/api/v0'`
- `environment.dev.ts` (development): `backendUrl: 'http://localhost:8000/api'`
- `environment.local.ts` (local): `backendUrl: 'http://localhost:8000/api'`

### Proxy Dev Server
Il file `proxy.conf.json` reindirizza `/api/**` verso `http://localhost` (nginx Docker sulla porta 80).

---

## Architettura Docker (sviluppo locale)

```
Browser (porta 4200)
    │
    │ /api/** → proxy → http://localhost:80
    ▼
Nginx (porta 80) nel container Docker
    │
    ├── /api/v0/** → proxy → http://localhost:8000/api (interno container)
    │
    └── /* → serve Angular build (produzione)

Container avalog_api:
    ├── nginx (porta 80, esposta all'host)
    └── Fastify API (porta 8000, solo interna)

Container avalog_postgres:
    └── PostgreSQL (porta 5432, esposta all'host)
```

### Comandi utili
```bash
# Avvia i container
docker compose up -d

# Vedi i log del backend
docker logs avalog_api

# Connettiti al database
docker exec -it avalog_postgres psql -U avalog -d avalog
```

---

## Database (PostgreSQL via Prisma)

### Tabelle principali

| Tabella | Descrizione |
|---------|-------------|
| `users` | Utenti registrati |
| `groups` | Gruppi di gioco |
| `memberships` | Relazione utenti-gruppi (con ruolo ADMIN/MEMBER) |
| `games` | Partite |
| `game_participants` | Giocatori per partita con ruolo e fazione |
| `achievements` | Achievement disponibili |
| `user_achievements` | Achievement degli utenti |
| `user_statistics` | Statistiche per utente |

### Aggiungere dati da psql
```sql
-- Crea un gruppo
INSERT INTO groups (id, name, created_at, updated_at)
VALUES (gen_random_uuid()::text, 'Nome Gruppo', NOW(), NOW())
RETURNING id, name;

-- Associa un utente al gruppo come ADMIN
INSERT INTO memberships (id, user_id, group_id, role, joined_at)
VALUES (gen_random_uuid()::text, 'USER_ID', 'GROUP_ID', 'ADMIN', NOW());
```

---

## Pattern: Change Detection con async/await

Quando si usa `async/await` con chiamate HTTP in Angular, il change detection
potrebbe non aggiornarsi automaticamente. Soluzione: iniettare `ChangeDetectorRef`
e chiamare `detectChanges()` nel blocco `finally`.

```typescript
import { ChangeDetectorRef } from '@angular/core';

// Nel componente:
private cdr = inject(ChangeDetectorRef);

private async loadData(): Promise<void> {
  this.isLoading = true;
  try {
    this.data = await this.service.getAll();
  } catch (error) {
    this.errorMessage = 'Errore nel caricamento.';
  } finally {
    this.isLoading = false;
    this.cdr.detectChanges(); // forza l'aggiornamento della UI
  }
}
```

---

## Stili

### File principali
- `src/styles.scss` — Stili globali + import Bootstrap
- Palette colori medievale definita nelle CSS variables Bootstrap

### Palette Colori

| Variabile | Colore | Uso |
|-----------|--------|-----|
| `text-gold` | #DAA520 | Titoli e accenti |
| `bg-dark-grey` | #1A1A1A | Sfondo principale |
| `bg-medium-grey` | #2D2D2D | Card e navbar |
| `good-faction` | #1E3A5F | Fazione Buoni |
| `evil-faction` | #6B1C1C | Fazione Cattivi |
| `text-light-muted` | #A9A9A9 | Testo secondario |

---

## Comandi Utili
```bash
# Avvia dev server (dalla cartella client/)
npm start

# Build produzione
npm run build

# Lint
npm run lint
```
