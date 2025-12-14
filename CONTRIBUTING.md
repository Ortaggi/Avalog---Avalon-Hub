# Guida alla Contribuzione - Avalog

Questa guida descrive gli standard e i tool utilizzati per contribuire al progetto.

---

## Setup Ambiente

Dopo aver clonato il repository, installa le dipendenze dalla root:
```bash
npm install
cd avalog-fe && npm install
```

---

## Git Hooks (Husky)

Il progetto usa **Husky** per eseguire controlli automatici ad ogni commit.

### Hook attivi

| Hook | Azione |
|------|--------|
| `pre-commit` | Esegue lint-staged (Prettier + ESLint) |

### Lint-Staged

Ad ogni commit vengono automaticamente formattati:
- File `.ts` e `.html` → Prettier + ESLint
- File `.scss` → Prettier

---

## Standard Commit (Conventional Commits)

Tutti i commit devono seguire il formato **Conventional Commits**:
```
<type>(<scope>): <description>

[body opzionale]

[footer opzionale]
```

### Tipi consentiti

| Tipo | Quando usarlo |
|------|---------------|
| `feat` | Nuova funzionalità |
| `fix` | Correzione bug |
| `docs` | Solo documentazione |
| `style` | Formattazione (no cambio logica) |
| `refactor` | Refactoring codice |
| `test` | Aggiunta/modifica test |
| `chore` | Manutenzione, dipendenze, config |
| `ci` | Modifiche CI/CD |
| `perf` | Miglioramenti performance |

### Scope (opzionale)

Lo scope indica l'area del codice modificata:
- `auth`, `dashboard`, `matches`, `leaderboard`, `profile`, `groups`
- `core`, `shared`
- `api` (per il backend)

### Esempi
```bash
feat(auth): add login page
fix(matches): correct win rate calculation
docs: update README
chore: upgrade Angular to v19.1
refactor(dashboard): simplify stats service
```

---

## Commitizen (Wizard Interattivo)

Per comporre i commit con una guida interattiva, usa:
```bash
git add .
npm run commit
```

Il wizard ti guiderà passo-passo nella creazione del messaggio.

---

## Coding Style

### Prettier

Configurazione in `.prettierrc`:
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "none",
  "printWidth": 100
}
```

### ESLint

Il progetto usa `@angular-eslint` per il linting del codice Angular.

Per eseguire manualmente:
```bash
cd avalog-fe
ng lint
```

---

## Workflow Consigliato

1. Crea un branch per la feature/fix:
```bash
   git checkout -b feature/nome-feature
```

2. Sviluppa e committa usando Commitizen:
```bash
   git add .
   npm run commit
```

3. Pusha e apri una Pull Request:
```bash
   git push origin feature/nome-feature
```

---

## Deploy

Il deploy avviene automaticamente tramite GitHub Actions ad ogni push su `main`.

Per maggiori dettagli, leggi la [guida al deploy](./DEPLOYMENT.md).

### Build locale
```bash
cd avalog-fe
ng build
```

I file compilati saranno in `dist/avalog-fe/browser/`.