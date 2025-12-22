# 🏰 Avalog - Avalon Hub

**Avalog** è una web app pensata per tracciare e analizzare le tue sessioni di *The Resistance: Avalon*.

Registra ogni partita, segna chi ha giocato quale ruolo, e lascia che i dati rivelino la verità: chi è il Merlino più convincente? Chi viene sempre scoperto come spia? Chi ha il miglior win rate come Mordred?

> Per gruppi che prendono il bluff sul serio.

---

## ✨ Funzionalità

- 📝 **Registro partite** — Salva le partite con giocatori, ruoli ed esiti
- 📊 **Dashboard statistiche** — Win rate, ruoli preferiti, andamento nel tempo
- 🏆 **Classifiche** — Ranking globali e per ruolo
- 👤 **Profili giocatore** — Tieni traccia della tua carriera su Avalon
- 👥 **Gruppi** — Crea e gestisci i tuoi gruppi di gioco

---

## 🛠️ Tech Stack

### Frontend
- Angular 19
- Bootstrap 5
- SCSS (tema medievale custom)

### Backend
- Supabase (PostgreSQL + API REST)

### DevOps
- GitHub Actions (CI/CD)
- Nginx (reverse proxy)
- Hostinger (hosting)

---

## 🚀 Quick Start

### Prerequisiti
- Node.js v20+
- npm
- Account Supabase

### Installazione
```bash
# Clona il repository
git clone https://github.com/[username]/Avalog---Avalon-Hub.git
cd Avalog---Avalon-Hub

# Installa dipendenze root (Husky, Commitizen)
npm install

# Installa dipendenze frontend
cd avalog-fe
npm install

# Configura Supabase
# Copia src/app/core/config/supabase.config.example.ts in supabase.config.ts
# e inserisci le tue credenziali

# Avvia il dev server
ng serve
```

L'app sarà disponibile su `http://localhost:4200`

---

## 📁 Struttura Progetto
```
Avalog---Avalon-Hub/
├── .github/
│   └── workflows/
│       └── deploy.yml      # CI/CD pipeline
├── avalog-fe/              # Frontend Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/       # Servizi, modelli, repository
│   │   │   ├── features/   # Moduli funzionali
│   │   │   └── shared/     # Componenti condivisi
│   │   └── styles/         # SCSS globali
│   └── package.json
├── REQUIREMENTS.md         # Requisiti funzionali
├── ARCHITECTURE.md         # Documentazione tecnica
├── CONTRIBUTING.md         # Guida alla contribuzione
├── DEPLOYMENT.md           # Guida al deploy
└── README.md
```

---

## 📖 Documentazione

| Documento | Descrizione |
|-----------|-------------|
| [REQUIREMENTS.md](./REQUIREMENTS.md) | Requisiti funzionali del progetto |
| [ARCHITECTURE.md](./avalog-fe/ARCHITECTURE.md) | Architettura frontend |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Guida per contribuire |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Guida al deploy |

---

## 

## 🤝 Contribuire

Leggi la [guida alla contribuzione](./CONTRIBUTING.md) per i dettagli su:
- Git hooks e linting
- Standard per i commit
- Workflow di sviluppo

---

## 🚀 Deploy

Il progetto usa GitHub Actions per il deploy automatico. Ogni push su `main` triggera:
1. Build dell'app Angular
2. Deploy via rsync su server Hostinger

Leggi la [guida al deploy](./DEPLOYMENT.md) per i dettagli.

---

## 📜 Licenza

MIT

---

## 🎲 Ruoli Avalon Supportati

### Fazione Buoni
- **Merlino** — Conosce i cattivi (tranne Mordred)
- **Percival** — Conosce Merlino
- **Fedeli di Artù** — Nessuna informazione speciale

### Fazione Cattivi
- **Assassino** — Può assassinare Merlino
- **Morgana** — Appare come Merlino a Percival
- **Mordred** — Invisibile a Merlino
- **Oberon** — Non conosce gli altri cattivi

---

*Sviluppato con ⚔️ per i fan di Avalon*
