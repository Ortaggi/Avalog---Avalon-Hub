# Guida al Deploy - Avalog

Questa guida descrive come deployare Avalog su un server con Nginx.

---

## Architettura Deploy
```
┌─────────────┐     push      ┌─────────────────┐
│   GitHub    │ ───────────▶  │  GitHub Actions │
│   (main)    │               │    (CI/CD)      │
└─────────────┘               └────────┬────────┘
                                       │
                                       │ rsync via SSH
                                       ▼
                              ┌─────────────────┐
                              │    Hostinger    │
                              │  (Nginx + App)  │
                              └─────────────────┘
```

---

## Prerequisiti

- Server con accesso SSH
- Nginx installato
- Dominio configurato
- Account GitHub con accesso al repository

---

## Setup Iniziale Server

### 1. Crea la cartella per l'app
```bash
ssh user@tuo-server
mkdir -p /var/www/avalog
```

### 2. Configura Nginx
```bash
sudo nano /etc/nginx/sites-available/avalog
```
```nginx
server {
    listen 80;
    server_name tuodominio.com www.tuodominio.com;
    root /var/www/avalog;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    # Angular routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 3. Abilita il sito
```bash
sudo ln -s /etc/nginx/sites-available/avalog /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 4. (Opzionale) HTTPS con Let's Encrypt
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d tuodominio.com -d www.tuodominio.com
```

---

## Setup GitHub Actions

### 1. Genera chiave SSH per deploy
```bash
ssh-keygen -t ed25519 -C "github-actions-avalog" -f ~/.ssh/avalog_deploy_key
```

### 2. Aggiungi chiave pubblica sul server
```bash
cat ~/.ssh/avalog_deploy_key.pub >> ~/.ssh/authorized_keys
```

### 3. Configura secrets su GitHub

Vai su GitHub → Repository → Settings → Secrets → Actions

| Secret | Valore                                                |
|--------|-------------------------------------------------------|
| `SSH_PRIVATE_KEY` | Contenuto di `avalog_deploy_key` codificato in base64 |
| `SSH_HOST` | IP o dominio del server                               |
| `SSH_USER` | Username SSH                                          |
| `DEPLOY_PATH` | `/var/www/avalog-fe`                                  |

---

## Pipeline CI/CD

Il file `.github/workflows/deploy.yml` esegue:

1. **Checkout** — Scarica il codice
2. **Setup Node.js** — Installa Node 20
3. **Install dependencies** — `npm ci`
4. **Build** — `ng build --configuration=production`
5. **Deploy** — rsync dei file su server via SSH

### Trigger

Il deploy si attiva automaticamente ad ogni push su `main`.

---

## Deploy Manuale

Se necessario, puoi deployare manualmente:
```bash
# Build locale
cd avalog-fe
ng build

# Upload via rsync
rsync -avz --delete \
  dist/avalog-fe/browser/ \
  user@server:/var/www/avalog-fe/
```

---

## Troubleshooting

### Build fallisce
- Verifica che `ng build` funzioni localmente
- Controlla i log di GitHub Actions

### Deploy fallisce (SSH)
- Verifica che la chiave SSH sia corretta
- Controlla che l'utente abbia permessi sulla cartella

### App non funziona dopo deploy
- Verifica la configurazione Nginx
- Controlla che `try_files` sia configurato per Angular routing
- Verifica i permessi della cartella `/var/www/avalog-fe`

### 404 sulle route
- Assicurati che Nginx abbia `try_files $uri $uri/ /index.html;`