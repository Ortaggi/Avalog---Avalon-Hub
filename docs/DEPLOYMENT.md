# Guida al Deploy - Avalog

---

## Architettura

Il progetto è distribuito come **singolo container Docker** che include:
- **Nginx** (porta 80) — serve il frontend e fa da reverse proxy all'API
- **Fastify API** (porta 8000, solo interna) — backend Node.js
- **Supervisor** — gestisce i processi nginx e API

Il database PostgreSQL gira in un container separato.

```
[ Browser ]
     │
     ▼
[ Nginx :80 ]
     ├── /api/v0/** ──▶ Fastify :8000 (interno)
     └── /**        ──▶ Angular build (static files)

[ PostgreSQL :5432 ] ◀──── Fastify (via Prisma)
```

---

## Deploy Locale (Docker)

### Prerequisiti
- Docker e Docker Compose installati
- Nessun processo in ascolto su porta 80 e 5432

### 1. Build dell'immagine

```bash
docker build --platform linux/amd64 -t avalog/api:latest .
```

> Il flag `--platform linux/amd64` garantisce compatibilità con il server remoto.

### 2. Avvia i container

```bash
docker compose up -d
```

Questo avvia:
- `avalog_postgres` — PostgreSQL su porta 5432
- `avalog_api` — Nginx + API su porta 80

### 3. Verifica

```bash
# Controlla che i container siano su
docker ps

# Controlla i log
docker logs avalog_api
docker logs avalog_postgres

# Testa l'API
curl http://localhost/api/v0/auth/me
```

### 4. Connessione al database

```bash
docker exec -it avalog_postgres psql -U avalog -d avalog
```

### 5. Ferma i container

```bash
docker compose down

# Per rimuovere anche i volumi (reset DB)
docker compose down -v
```

---

## Sviluppo Frontend (fuori Docker)

Per sviluppare il frontend con hot reload, avvia il dev server Angular separatamente.
Il `proxy.conf.json` reindirizza le chiamate API al container Docker.

```bash
cd client
npm start
# App disponibile su http://localhost:4200
# Le chiamate /api/** vengono proxate verso http://localhost:80
```

Assicurati che il container `avalog_api` sia in esecuzione prima di avviare il dev server.

---

## Deploy Remoto

### Metodo 1: Script manuale (`build_and_deploy.sh`)

Deploya l'intera applicazione (frontend + backend) come immagine Docker sul server remoto.

**Prerequisiti:**
- Accesso SSH configurato verso `root@avalog.online`
- Docker installato sul server remoto
- Docker Compose configurato sul server remoto

**Procedura:**

```bash
# Dalla root del progetto
./build_and_deploy.sh
```

Lo script esegue in sequenza:
1. Build dell'immagine Docker (`linux/amd64`)
2. Salva l'immagine e la invia via SSH al server remoto con gzip
3. Il server carica l'immagine localmente

**Dopo lo script**, accedi al server e riavvia i container:

```bash
ssh root@avalog.online
cd /path/to/project
docker compose up -d
```

---

### Metodo 2: GitHub Actions (automatico)

Si attiva automaticamente alla **pubblicazione di una release** su GitHub.

**Cosa fa:**
1. Checkout del codice
2. Build Angular (`ng build`)
3. Deploy dei file statici via `rsync` su SSH

**Secrets richiesti** (configurare in GitHub → Settings → Secrets → Actions):

| Secret | Descrizione |
|--------|-------------|
| `SSH_PRIVATE_KEY` | Chiave SSH privata per accesso al server |
| `SSH_HOST` | IP o dominio del server |
| `SSH_USER` | Username SSH |
| `DEPLOY_PATH` | Percorso destinazione sul server (es. `/var/www/avalog`) |
| `NG_APP_ENV` | Environment Angular per la build |
| `NG_APP_SERVER_TYPE` | Tipo di server (es. `backend`) |

**Come triggerare il deploy:**
1. Vai su GitHub → Releases → "Draft a new release"
2. Crea un tag (es. `v1.2.0`) e pubblica la release
3. GitHub Actions parte automaticamente

**Monitora il deploy:**
- GitHub → Actions → workflow "Deploy to Hostinger"

---

## Troubleshooting

### Container non si avvia
```bash
docker logs avalog_api
docker logs avalog_postgres
```

### API non risponde
```bash
# Verifica che nginx stia girando nel container
docker exec avalog_api nginx -t

# Verifica che Fastify stia girando
docker exec avalog_api ps aux | grep node
```

### Database non raggiungibile
```bash
# Verifica che postgres sia healthy
docker ps | grep postgres

# Testa la connessione
docker exec avalog_postgres pg_isready -U avalog
```

### Loader bloccato nel frontend (Angular)
Se dopo una chiamata API il loader rimane attivo, usare `ChangeDetectorRef`:
```typescript
private cdr = inject(ChangeDetectorRef);

// Nel blocco finally:
this.isLoading = false;
this.cdr.detectChanges();
```
