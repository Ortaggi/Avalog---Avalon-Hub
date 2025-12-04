# Avalog - Architettura Frontend v0.1

## Tecnologie

- **Angular 19**
- **Bootstrap 5** (SCSS + JS)
- **SCSS** per gli stili custom

---

## Struttura Progetto
```
src/app/
├── core/                   # Servizi singleton, guards, interceptors
├── shared/                 # Componenti, pipe, direttive riutilizzabili
│   └── components/
│       └── navbar/
├── features/
│   ├── auth/               # Login, registrazione
│   │   └── pages/
│   │       ├── login/
│   │       └── register/
│   ├── dashboard/          # Dashboard statistiche personali
│   │   └── pages/
│   │       └── dashboard-home/
│   ├── matches/            # Registro partite
│   │   └── pages/
│   │       ├── matches-list/
│   │       └── match-create/
│   ├── leaderboard/        # Classifiche
│   │   └── pages/
│   │       └── leaderboard-home/
│   ├── profile/            # Profilo utente
│   │   └── pages/
│   │       └── profile-home/
│   └── groups/             # Gestione gruppi
│       └── pages/
│           ├── groups-list/
│           └── group-detail/
```

---

## Moduli

| Modulo | Scopo | Lazy Loaded |
|--------|-------|-------------|
| `CoreModule` | Servizi singleton, guards, interceptors | No |
| `SharedModule` | Componenti riutilizzabili (navbar, ecc.) | No |
| `AuthModule` | Login, registrazione | Sì |
| `DashboardModule` | Dashboard statistiche | Sì |
| `MatchesModule` | Gestione partite | Sì |
| `LeaderboardModule` | Classifiche | Sì |
| `ProfileModule` | Profilo utente | Sì |
| `GroupsModule` | Gestione gruppi | Sì |

---

## Routing

| Path | Modulo | Componente |
|------|--------|------------|
| `/` | - | Redirect a `/dashboard` |
| `/auth/login` | Auth | LoginComponent |
| `/auth/register` | Auth | RegisterComponent |
| `/dashboard` | Dashboard | DashboardHomeComponent |
| `/matches` | Matches | MatchesListComponent |
| `/matches/create` | Matches | MatchCreateComponent |
| `/leaderboard` | Leaderboard | LeaderboardHomeComponent |
| `/profile` | Profile | ProfileHomeComponent |
| `/groups` | Groups | GroupsListComponent |
| `/groups/:id` | Groups | GroupDetailComponent |

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

# Genera nuovo componente in un modulo
ng generate component features/[modulo]/pages/[nome] --module=features/[modulo]

# Genera servizio nel core
ng generate service core/services/[nome]

# Build produzione
ng build --configuration=production
```