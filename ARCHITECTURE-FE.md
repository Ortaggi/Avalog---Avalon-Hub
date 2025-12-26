# Avalog - Architettura Frontend

## Tecnologie

- **Angular 19**
- **Bootstrap 5** (SCSS + JS)
- **SCSS** per gli stili custom
- **Supabase** per database e API

---

## Struttura Progetto
```
src/app/
├── core/
│   ├── config/             # Configurazioni (Supabase)
│   ├── guards/             # Route guards (auth, guest)
│   ├── models/             # Interfacce TypeScript
│   ├── repositories/       # Repository pattern
│   │   └── supabase/       # Implementazione Supabase
│   └── services/           # Servizi Angular
├── features/
│   ├── auth/               # Login, registrazione
│   ├── dashboard/          # Dashboard statistiche
│   ├── matches/            # Gestione partite
│   ├── leaderboard/        # Classifiche
│   ├── profile/            # Profilo utente
│   └── groups/             # Gestione gruppi
└── shared/
    └── components/
        └── navbar/
```

---

## Moduli

| Modulo        | Scopo                     | Lazy Loaded |
|--------       |-------                    |-------------|
| `CoreModule`  | Servizi singleton, guards | No |
| `SharedModule`| Componenti riutilizzabili | No |
| `AuthModule` | Login, registrazione | Sì |
| `DashboardModule` | Dashboard statistiche | Sì |
| `MatchesModule` | Gestione partite | Sì |
| `LeaderboardModule` | Classifiche | Sì |
| `ProfileModule` | Profilo utente | Sì |
| `GroupsModule` | Gestione gruppi | Sì |

---

## Routing

| Path | Modulo | Componente | Guard |
|------|--------|------------|-------|
| `/` | - | Redirect a `/dashboard` | - |
| `/auth/login` | Auth | LoginComponent | guestGuard |
| `/auth/register` | Auth | RegisterComponent | guestGuard |
| `/dashboard` | Dashboard | DashboardHomeComponent | authGuard |
| `/matches` | Matches | MatchesListComponent | authGuard |
| `/matches/create` | Matches | MatchCreateComponent | authGuard |
| `/leaderboard` | Leaderboard | LeaderboardHomeComponent | authGuard |
| `/profile` | Profile | ProfileHomeComponent | authGuard |
| `/groups` | Groups | GroupsListComponent | authGuard |
| `/groups/:id` | Groups | GroupDetailComponent | authGuard |

---

## Autenticazione

### Flow
1. Utente inserisce credenziali
2. `AuthService` valida tramite `UserSupabaseRepository`
3. Se valido, `TokenService` salva token nei cookie (7 giorni)
4. `authGuard` protegge le route autenticate
5. `guestGuard` impedisce accesso a login se già autenticato

### Token
- Salvati in cookie HTTP
- Durata: 7 giorni
- Contiene: `avalog_token` (token casuale) e `avalog_user_id`

---

## Repository Pattern
```
┌─────────────────────────────────────────────────┐
│              Angular Services                    │
│         (AuthService, MatchService, etc.)        │
└──────────────────────┬──────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────┐
│              Repository Interface                │
│     (UserRepository, MatchRepository, etc.)      │
└──────────────────────┬──────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────┐
│           Supabase Implementation                │
│         (UserSupabaseRepository, etc.)           │
└─────────────────────────────────────────────────┘
```

---

## Database (Supabase)

### Tabelle

| Tabella | Descrizione |
|---------|-------------|
| `users` | Utenti registrati |
| `groups` | Gruppi di gioco |
| `group_members` | Relazione utenti-gruppi |
| `matches` | Partite |
| `match_players` | Giocatori per partita con ruolo |

### Schema
```sql
users (id, email, username, display_name, avatar, password, created_at)
groups (id, name, description, admin_id, invite_code, created_at)
group_members (group_id, user_id, joined_at)
matches (id, group_id, date, winning_faction, victory_type, notes, created_by, created_at)
match_players (match_id, user_id, role_id)
```

---

## Stili

### File principali
- `src/styles.scss` — Stili globali + import Bootstrap
- `src/styles/_variables.scss` — Palette colori medievale

### Palette Colori

| Variabile | Colore | Uso |
|-----------|--------|-----|
| `$primary` | #8B4513 | Colore principale (legno/cuoio) |
| `$secondary` | #2F4F4F | Colore secondario (pietra) |
| `$good-faction` | #1E3A5F | Fazione Buoni (blu notte) |
| `$evil-faction` | #6B1C1C | Fazione Cattivi (rosso sangue) |
| `$bg-dark` | #1A1A1A | Sfondo principale |
| `$bg-medium` | #2D2D2D | Sfondo navbar/card |
| `$accent-gold` | #DAA520 | Accenti e titoli |
| `$text-light` | #F5F5DC | Testo principale |

---

## Comandi Utili
```bash
# Avvia dev server
ng serve

# Genera nuovo componente
ng generate component features/[modulo]/pages/[nome]

# Genera servizio
ng generate service core/services/[nome]

# Build produzione
ng build --configuration=production

# Lint
ng lint

# Commit con wizard
npm run commit
```