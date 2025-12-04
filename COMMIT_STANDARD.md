# Standard per i Commit

## Struttura del Commit

```
<tipo>: <descrizione breve>

[corpo opzionale del messaggio]

[footer opzionale]
```

## Tipi di Commit

- **feat**: Una nuova funzionalità
- **fix**: Correzione di un bug
- **docs**: Modifiche alla documentazione
- **style**: Modifiche che non influenzano il significato del codice (formattazione, spazi, ecc.)
- **refactor**: Modifiche al codice che non aggiungono funzionalità né correggono bug
- **test**: Aggiunta o modifica di test
- **chore**: Modifiche al processo di build o strumenti ausiliari

## Regole

1. **Descrizione breve**: massimo 50 caratteri
2. **Usa l'imperativo**: "add" non "added" o "adds"
3. **Non usare il punto finale** nella descrizione breve
4. **Corpo del messaggio**: spiega il "perché" non il "cosa"
5. **Una riga vuota** tra descrizione e corpo
6. **Corpo limitato a 72 caratteri per riga**

## Esempi

### Esempio 1: Nuova funzionalità
```
feat: add user authentication system

Implement JWT-based authentication with login and logout functionality.
Includes password hashing and token validation middleware.
```

### Esempio 2: Correzione bug
```
fix: resolve memory leak in data processing

Fixed issue where event listeners were not being properly removed
after component unmount, causing memory accumulation.
```

### Esempio 3: Documentazione
```
docs: update API documentation for new endpoints
```

### Esempio 4: Refactoring
```
refactor: simplify user service logic

Extracted common validation logic into separate utility functions
to improve code maintainability and reduce duplication.
```

### Esempio 5: Test
```
test: add unit tests for authentication module
```

### Esempio 6: Chore
```
chore: update dependencies to latest versions
```

## Esempio Completo con Footer

```
feat: add export functionality for reports

Users can now export reports in PDF and CSV formats.
Added export button in the reports dashboard with format selection.

Closes #123
```

## ❌ Esempi da Evitare

- ❌ `Fixed stuff` - troppo vago
- ❌ `Updated files` - non descrittivo
- ❌ `WIP` - non committare lavori incompleti
- ❌ `feat: Added new feature.` - usa imperativo e niente punto finale
- ❌ `fix: fixed the bug that was causing problems` - troppo lungo e generico
