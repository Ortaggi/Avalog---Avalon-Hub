# Changelog

Tutte le modifiche rilevanti al progetto saranno documentate in questo file.

Il formato è basato su [Keep a Changelog](https://keepachangelog.com/it/1.0.0/),
e questo progetto aderisce al [Semantic Versioning](https://semver.org/lang/it/).

## [Unreleased]

### Added
- Funzionalità in sviluppo non ancora rilasciate

---

## [0.1.1] - 2026-01-05
- Gestione della partite (inserimento, visualizzazione)

## [0.1.0] - 2025-12-21

### Added
- Setup iniziale progetto Angular 19
- Integrazione Bootstrap 5 con tema medievale custom
- Struttura moduli con lazy loading
- Integrazione Supabase come database
- Sistema autenticazione con cookie (login, register, logout)
- Token service per persistenza sessione (7 giorni)
- Auth guard e Guest guard per protezione route
- Pagina Login
- Pagina Registrazione
- Dashboard con statistiche personali
- Pagina lista partite con filtri
- Form creazione partita multi-step (giocatori, ruoli, esito)
- Navbar condizionale
- CI/CD pipeline con GitHub Actions
- Deploy automatico su Hostinger via SSH

### Documentazione
- README.md
- ARCHITECTURE.md
- CONTRIBUTING.md
- DEPLOYMENT.md
- REQUIREMENTS.md

---

## Legenda

- **Added** - Nuove funzionalità
- **Changed** - Modifiche a funzionalità esistenti
- **Deprecated** - Funzionalità che saranno rimosse
- **Removed** - Funzionalità rimosse
- **Fixed** - Bug fix
- **Security** - Vulnerabilità risolte