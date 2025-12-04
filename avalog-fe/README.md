# 🏰 Avalog - Avalon Hub

**Avalog** è una web app pensata per tracciare e analizzare le tue sessioni di *Avalon*.

Registra ogni partita, segna chi ha giocato quale ruolo, e lascia che i dati rivelino la verità

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
- *Coming soon*

---

## 🚀 Quick Start

### Prerequisiti
- Node.js v18.19+ o v20+
- npm

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

# Avvia il dev server
ng serve
```

L'app sarà disponibile su `http://localhost:4200`

---

## 📁 Struttura Progetto
```
Avalog---Avalon-Hub/
├── avalog-fe/          # Frontend Angular
├── avalog-be/          # Backend (coming soon)
├── .husky/             # Git hooks
├── REQUIREMENTS.md     # Requisiti funzionali
├── ARCHITECTURE.md     # Documentazione tecnica
├── CONTRIBUTING.md     # Guida alla contribuzione
└── README.md
```

---

## 📖 Documentazione

| Documento                             | Descrizione |
|---------------------------------------|-------------|
| [REQUIREMENTS.md](../REQUIREMENTS.md) | Requisiti funzionali del progetto |
| [ARCHITECTURE.md](../ARCHITECTURE.md) | Architettura frontend |
| [CONTRIBUTING.md](../CONTRIBUTING.md) | Guida per contribuire |

---

## 🤝 Contribuire

Leggi la [guida alla contribuzione](../CONTRIBUTING.md) per i dettagli su:
- Git hooks e linting
- Standard per i commit
- Workflow di sviluppo

---

## 📜 Licenza

*Da definire*

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
