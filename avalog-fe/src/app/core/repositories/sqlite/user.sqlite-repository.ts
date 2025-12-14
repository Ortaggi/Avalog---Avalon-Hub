import { Injectable, inject } from '@angular/core';
import { DatabaseService } from '../../services';
import { User } from '../../models';
import { BaseRepository } from '../base.repository';
import { SqlValue } from './sql.types';

@Injectable({
  providedIn: 'root'
})
export class UserSqliteRepository implements BaseRepository<User> {
  private dbService = inject(DatabaseService);

  async getAll(): Promise<User[]> {
    const db = await this.dbService.getDatabase();
    const result = db.exec('SELECT * FROM users');

    if (result.length === 0) return [];

    return result[0].values.map((row) => this.mapRowToUser(row));
  }

  async getById(id: string): Promise<User | null> {
    const db = await this.dbService.getDatabase();
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    stmt.bind([id]);

    if (stmt.step()) {
      const row = stmt.get();
      stmt.free();
      return this.mapRowToUser(row);
    }

    stmt.free();
    return null;
  }

  async getByEmail(email: string): Promise<User | null> {
    const db = await this.dbService.getDatabase();
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    stmt.bind([email]);

    console.log('Checking email:', email);

    if (stmt.step()) {
      const row = stmt.get();
      console.log('Found user:', row);
      stmt.free();
      return this.mapRowToUser(row);
    }

    console.log('No user found with email:', email);
    stmt.free();
    return null;
  }

  async getByUsername(username: string): Promise<User | null> {
    const db = await this.dbService.getDatabase();
    const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
    stmt.bind([username]);

    console.log('Checking username:', username);

    if (stmt.step()) {
      const row = stmt.get();
      console.log('Found user:', row);
      stmt.free();
      return this.mapRowToUser(row);
    }

    console.log('No user found with username:', username);
    stmt.free();
    return null;
  }

  async create(userData: Omit<User, 'id' | 'createdAt'> & { password: string }): Promise<User> {
    const db = await this.dbService.getDatabase();
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    db.run(
      `INSERT INTO users (id, email, username, display_name, avatar, password, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        userData.email,
        userData.username,
        userData.displayName,
        userData.avatar || null,
        userData.password,
        createdAt
      ]
    );

    this.dbService.saveDatabase();

    return {
      id,
      email: userData.email,
      username: userData.username,
      displayName: userData.displayName,
      avatar: userData.avatar,
      createdAt: new Date(createdAt)
    };
  }

  async update(id: string, userData: Partial<User>): Promise<User | null> {
    const existing = await this.getById(id);
    if (!existing) return null;

    const db = await this.dbService.getDatabase();

    const fields: string[] = [];
    const values: (string | number | null)[] = [];

    if (userData.email) {
      fields.push('email = ?');
      values.push(userData.email);
    }
    if (userData.username) {
      fields.push('username = ?');
      values.push(userData.username);
    }
    if (userData.displayName) {
      fields.push('display_name = ?');
      values.push(userData.displayName);
    }
    if (userData.avatar !== undefined) {
      fields.push('avatar = ?');
      values.push(userData.avatar);
    }

    if (fields.length > 0) {
      values.push(id);
      db.run(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);
      this.dbService.saveDatabase();
    }

    return this.getById(id);
  }

  async delete(id: string): Promise<boolean> {
    const db = await this.dbService.getDatabase();
    db.run('DELETE FROM users WHERE id = ?', [id]);
    this.dbService.saveDatabase();
    return true;
  }

  async validatePassword(email: string, password: string): Promise<User | null> {
    const db = await this.dbService.getDatabase();
    const stmt = db.prepare('SELECT * FROM users WHERE email = ? AND password = ?');
    stmt.bind([email, password]);

    if (stmt.step()) {
      const row: SqlValue[] = stmt.get();
      stmt.free();
      return this.mapRowToUser(row);
    }

    stmt.free();
    return null;
  }

  private mapRowToUser(row: SqlValue[]): User {
    return {
      id: row[0] as string,
      email: row[1] as string,
      username: row[2] as string,
      displayName: row[3] as string,
      avatar: row[4] as string | undefined,
      createdAt: new Date(row[6] as string)
    };
  }
}
