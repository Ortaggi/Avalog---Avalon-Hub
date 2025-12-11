import { Injectable } from '@angular/core';
import initSqlJs, { Database } from 'sql.js';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private db: Database | null = null;
  private initPromise: Promise<Database> | null = null;
  private readonly DB_KEY = 'avalog_local_db';

  async getDatabase(): Promise<Database> {
    if (this.db) {
      return this.db;
    }

    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = this.initDatabase();
    return this.initPromise;
  }

  private async initDatabase(): Promise<Database> {
    const SQL = await initSqlJs({
      locateFile: () => '/assets/sql-wasm.wasm'
    });

    // Provo a caricare il DB dal localStorage
    const savedDb = localStorage.getItem(this.DB_KEY);

    if (savedDb) {
      const data = new Uint8Array(JSON.parse(savedDb));
      this.db = new SQL.Database(data);
      console.log('Database caricato da localStorage');
    } else {
      this.db = new SQL.Database();
      console.log('Nuovo database creato');
      this.createTables();
    }

    return this.db;
  }

  private createTables(): void {
    if (!this.db) return;

    console.log('Creazione tabelle...');

    // Users table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        username TEXT UNIQUE NOT NULL,
        display_name TEXT NOT NULL,
        avatar TEXT,
        password TEXT NOT NULL,
        created_at TEXT NOT NULL
      )
    `);
    console.log('Tabella users creata');

    // Groups table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS groups (
         id TEXT PRIMARY KEY,
         name TEXT NOT NULL,
         description TEXT,
         admin_id TEXT NOT NULL,
         invite_code TEXT UNIQUE,
         created_at TEXT NOT NULL,
         FOREIGN KEY (admin_id) REFERENCES users(id)
        )
    `);
    console.log('Tabella groups creata');

    // Group members table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS group_members (
        group_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        joined_at TEXT NOT NULL,
        PRIMARY KEY (group_id, user_id),
        FOREIGN KEY (group_id) REFERENCES groups(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
        )
    `);
    console.log('Tabella group_members creata');

    // Matches table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS matches (
        id TEXT PRIMARY KEY,
        group_id TEXT NOT NULL,
        date TEXT NOT NULL,
        winning_faction TEXT NOT NULL,
        victory_type TEXT NOT NULL,
        notes TEXT,
        created_by TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (group_id) REFERENCES groups(id),
        FOREIGN KEY (created_by) REFERENCES users(id)
        )
    `);
    console.log('Tabella matches creata');

    // Match players table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS match_players (
        match_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        role_id TEXT NOT NULL,
        PRIMARY KEY (match_id, user_id),
        FOREIGN KEY (match_id) REFERENCES matches(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
        )
    `);
    console.log('Tabella match_players creata');

    // Salvo il DB dopo la creazione delle tabelle
    this.saveDatabase();
    console.log('Database salvato');
  }

  saveDatabase(): void {
    if (!this.db) return;

    const data = this.db.export();
    const arr = Array.from(data);
    localStorage.setItem(this.DB_KEY, JSON.stringify(arr));
  }

  clearDatabase(): void {
    localStorage.removeItem(this.DB_KEY);
    this.db = null;
    this.initPromise = null;
  }
}
