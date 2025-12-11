import { Injectable, inject } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { Match, PlayerMatch } from '../../models';
import { BaseRepository } from '../base.repository';
import { QueryExecResult, SqlValue } from 'sql.js';

@Injectable({
  providedIn: 'root'
})
export class MatchSqliteRepository implements BaseRepository<Match> {
  private dbService = inject(DatabaseService);

  async getAll(): Promise<Match[]> {
    const db = await this.dbService.getDatabase();
    const result = db.exec('SELECT * FROM matches ORDER BY date DESC');

    if (result.length === 0) return [];

    const matches: Match[] = [];
    for (const row of result[0].values) {
      const match = await this.mapRowToMatch(row);
      matches.push(match);
    }
    return matches;
  }

  async getById(id: string): Promise<Match | null> {
    const db = await this.dbService.getDatabase();
    const stmt = db.prepare('SELECT * FROM matches WHERE id = ?');
    stmt.bind([id]);

    if (stmt.step()) {
      const row = stmt.get();
      stmt.free();
      return this.mapRowToMatch(row);
    }

    stmt.free();
    return null;
  }

  async getByGroupId(groupId: string): Promise<Match[]> {
    const db = await this.dbService.getDatabase();
    const result = db.exec(
      `SELECT * FROM matches WHERE group_id = '${groupId}' ORDER BY date DESC`
    );

    if (result.length === 0) return [];

    const matches: Match[] = [];
    for (const row of result[0].values) {
      const match = await this.mapRowToMatch(row);
      matches.push(match);
    }
    return matches;
  }

  async getByUserId(userId: string): Promise<Match[]> {
    const db = await this.dbService.getDatabase();
    const result = db.exec(`
      SELECT m.* FROM matches m
      INNER JOIN match_players mp ON m.id = mp.match_id
      WHERE mp.user_id = '${userId}'
      ORDER BY m.date DESC
    `);

    if (result.length === 0) return [];

    const matches: Match[] = [];
    for (const row of result[0].values) {
      const match = await this.mapRowToMatch(row);
      matches.push(match);
    }
    return matches;
  }

  async create(matchData: Omit<Match, 'id' | 'createdAt'>): Promise<Match> {
    const db = await this.dbService.getDatabase();
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    db.run(
      `INSERT INTO matches (id, group_id, date, winning_faction, victory_type, notes, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        matchData.groupId,
        matchData.date instanceof Date ? matchData.date.toISOString() : matchData.date,
        matchData.winningFaction,
        matchData.victoryType,
        matchData.notes || null,
        matchData.createdBy,
        createdAt
      ]
    );

    // Aggiungo i giocatori
    for (const player of matchData.players) {
      db.run(`INSERT INTO match_players (match_id, user_id, role_id) VALUES (?, ?, ?)`, [
        id,
        player.idPlayer,
        player.idRole
      ]);
    }

    this.dbService.saveDatabase();

    return {
      id,
      groupId: matchData.groupId,
      date: matchData.date instanceof Date ? matchData.date : new Date(matchData.date),
      players: matchData.players,
      winningFaction: matchData.winningFaction,
      victoryType: matchData.victoryType,
      notes: matchData.notes,
      createdBy: matchData.createdBy,
      createdAt: new Date(createdAt)
    };
  }

  async update(id: string, matchData: Partial<Match>): Promise<Match | null> {
    const existing = await this.getById(id);
    if (!existing) return null;

    const db = await this.dbService.getDatabase();

    const fields: string[] = [];
    const values: (string | number | null)[] = [];

    if (matchData.date) {
      fields.push('date = ?');
      values.push(matchData.date instanceof Date ? matchData.date.toISOString() : matchData.date);
    }
    if (matchData.winningFaction) {
      fields.push('winning_faction = ?');
      values.push(matchData.winningFaction);
    }
    if (matchData.victoryType) {
      fields.push('victory_type = ?');
      values.push(matchData.victoryType);
    }
    if (matchData.notes !== undefined) {
      fields.push('notes = ?');
      values.push(matchData.notes);
    }

    if (fields.length > 0) {
      values.push(id);
      db.run(`UPDATE matches SET ${fields.join(', ')} WHERE id = ?`, values);
    }

    // Aggiorno i giocatori se presenti
    if (matchData.players) {
      db.run('DELETE FROM match_players WHERE match_id = ?', [id]);
      for (const player of matchData.players) {
        db.run(`INSERT INTO match_players (match_id, user_id, role_id) VALUES (?, ?, ?)`, [
          id,
          player.idPlayer,
          player.idRole
        ]);
      }
    }

    this.dbService.saveDatabase();
    return this.getById(id);
  }

  async delete(id: string): Promise<boolean> {
    const db = await this.dbService.getDatabase();
    db.run('DELETE FROM match_players WHERE match_id = ?', [id]);
    db.run('DELETE FROM matches WHERE id = ?', [id]);
    this.dbService.saveDatabase();
    return true;
  }

  private async mapRowToMatch(row: any[]): Promise<Match> {
    const db = await this.dbService.getDatabase();
    const playersResult: QueryExecResult[] = db.exec(
      `SELECT user_id, role_id FROM match_players WHERE match_id = '${row[0]}'`
    );
    const players: PlayerMatch[] =
      playersResult.length > 0
        ? playersResult[0].values.map(
            (r: SqlValue[]): PlayerMatch => ({
              idPlayer: r[0] as string,
              idRole: r[1] as string
            })
          )
        : [];

    return {
      id: row[0] as string,
      groupId: row[1] as string,
      date: new Date(row[2] as string),
      winningFaction: row[3] as 'good' | 'evil',
      victoryType: row[4] as 'missions' | 'assassination',
      notes: row[5] as string | undefined,
      createdBy: row[6] as string,
      createdAt: new Date(row[7] as string),
      players
    };
  }
}
