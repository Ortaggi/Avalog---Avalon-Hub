# Avalog - Avalon Hub

## Requisiti di Progetto

### Descrizione

**Avalog** è una web app pensata per tracciare e analizzare le sessioni di *Avalon*.

Registra ogni partita, segna chi ha giocato quale ruolo, e lascia che i dati rivelino la verità.

---

## 1. Funzionalità Core

### 1.1 Gestione Utenti e Profili

| ID | Requisito | Priorità |
|----|-----------|----------|
| U-01 | Registrazione utente (email + password) | Alta |
| U-02 | Login / Logout | Alta |
| U-03 | Profilo personale con avatar e nickname | Alta |
| U-04 | Modifica dati profilo | Media |
| U-05 | Eliminazione account | Bassa |

### 1.2 Gestione Gruppi

| ID | Requisito | Priorità |
|----|-----------|----------|
| G-01 | Creazione gruppo di gioco | Alta |
| G-02 | Invito giocatori al gruppo (via link o username) | Alta |
| G-03 | Gestione membri del gruppo (admin può rimuovere) | Media |
| G-04 | Un utente può appartenere a più gruppi | Media |

### 1.3 Registro Partite

| ID | Requisito | Priorità |
|----|-----------|----------|
| P-01 | Creazione nuova partita | Alta |
| P-02 | Selezione giocatori partecipanti (dal gruppo) | Alta |
| P-03 | Assegnazione ruolo a ogni giocatore | Alta |
| P-04 | Registrazione esito partita (Buoni/Cattivi vincono) | Alta |
| P-05 | Registrazione modalità vittoria (3 missioni / assassinio Merlino) | Media |
| P-06 | Data e ora partita (default: ora corrente) | Media |
| P-07 | Note opzionali sulla partita | Bassa |
| P-08 | Modifica partita già inserita | Media |
| P-09 | Eliminazione partita | Bassa |

### 1.4 Dashboard Statistiche Personali

| ID | Requisito | Priorità |
|----|-----------|----------|
| S-01 | Win rate globale | Alta |
| S-02 | Win rate per fazione (Buoni vs Cattivi) | Alta |
| S-03 | Win rate per ruolo specifico | Alta |
| S-04 | Numero totale partite giocate | Alta |
| S-05 | Ruolo più giocato | Media |
| S-06 | Ruolo con miglior performance | Media |
| S-07 | Grafico andamento win rate nel tempo | Media |
| S-08 | Storico partite personale con filtri | Media |

### 1.5 Leaderboard / Classifiche

| ID | Requisito | Priorità |
|----|-----------|----------|
| L-01 | Classifica globale per win rate (min. X partite) | Alta |
| L-02 | Classifica per fazione (miglior Buono, miglior Cattivo) | Alta |
| L-03 | Classifica per ruolo specifico | Alta |
| L-04 | Filtro classifiche per gruppo | Media |
| L-05 | Filtro classifiche per periodo (mese, anno, sempre) | Bassa |

---

## 2. Funzionalità Avanzate (Future)

### 2.1 Statistiche Avanzate

| ID | Requisito | Priorità |
|----|-----------|----------|
| SA-01 | Statistiche di coppia (win rate quando X e Y giocano insieme) | Bassa |
| SA-02 | Statistiche di correlazione (X e Y stessa squadra vs squadre opposte) | Bassa |
| SA-03 | Statistiche "nemesi" (contro chi perdi di più) | Bassa |

### 2.2 Achievement / Badge

| ID | Requisito | Priorità |
|----|-----------|----------|
| A-01 | Sistema di achievement sbloccabili | Bassa |
| A-02 | Badge per traguardi (es. "100 partite", "10 vittorie come Mordred") | Bassa |
| A-03 | Badge visibili sul profilo | Bassa |

### 2.3 Modalità Gioco (Roadmap Futura)

| ID | Requisito | Priorità |
|----|-----------|----------|
| MG-01 | Assegnazione casuale ruoli | Futura |
| MG-02 | Visualizzazione ruolo segreto sul proprio dispositivo | Futura |
| MG-03 | Gestione fasi di gioco (notte, votazioni, missioni) | Futura |
| MG-04 | Sostituzione completa delle carte fisiche | Futura |

### 2.4 Ruoli Custom

| ID | Requisito | Priorità |
|----|-----------|----------|
| RC-01 | Supporto ruoli base (Merlino, Percival, Assassino, Morgana, Mordred, Oberon) | Alta |
| RC-02 | Possibilità di aggiungere ruoli custom per espansioni | Bassa |

---

## 3. Requisiti Non Funzionali

### 3.1 Tecnologia

| ID | Requisito |
|----|-----------|
| T-01 | Web app responsive (mobile-first) |
| T-02 | PWA per installazione su dispositivi mobili |
| T-03 | Database per persistenza dati |
| T-04 | Autenticazione sicura (JWT o simile) |

### 3.2 Usabilità

| ID | Requisito |
|----|-----------|
| UX-01 | Inserimento partita rapido (< 1 minuto) |
| UX-02 | Interfaccia intuitiva, minimo onboarding |


---

## 4. Ruoli Avalon Supportati

### Fazione Buoni
- **Merlino** — Conosce i cattivi (tranne Mordred)
- **Percival** — Conosce Merlino (ma vede anche Morgana)
- **Buono semplice** — Nessuna informazione speciale

### Fazione Cattivi
- **Assassino** — Può tentare di assassinare Merlino a fine partita
- **Morgana** — Appare come Merlino a Percival
- **Mordred** — Invisibile a Merlino
- **Oberon** — Non conosce gli altri cattivi (e loro non conoscono lui)
- **Cattivo semplice** — Nessun potere speciale

---

## 5. Priorità di Sviluppo

### MVP (Minimum Viable Product)
1. Registrazione / Login utenti
2. Creazione gruppi e inviti
3. Inserimento partite con ruoli ed esito
4. Dashboard statistiche base (win rate globale e per ruolo)
5. Leaderboard globale e per ruolo

### Fase 2
1. Grafici andamento temporale
2. Filtri avanzati su storico partite
3. Statistiche per fazione
4. PWA

### Fase 3
1. Achievement / Badge
2. Statistiche coppia e correlazioni
3. Ruoli custom

### Fase 4 (Roadmap Futura)
1. Modalità gioco integrata

---

## 6. Note Aggiuntive

- L'app è pensata per essere **aperta a chiunque** voglia usarla con il proprio gruppo
- La **modalità gioco** (assegnazione ruoli, sostituzione carte) è prevista come funzionalità futura, non nel MVP
- Il tracciamento è limitato all'**esito finale** della partita (no dettagli su singole missioni/votazioni)
