import { Injectable, inject } from '@angular/core';
import { DatabaseService } from '../../services';
import { Group } from '../../models';
import { BaseRepository } from '../base.repository';
import { QueryExecResult, SqlValue } from './sql.types';

@Injectable({
  providedIn: 'root'
})
export class GroupSqliteRepository implements BaseRepository<Group> {
  private dbService = inject(DatabaseService);

  async getAll(): Promise<Group[]> {
    const db = await this.dbService.getDatabase();
    const result = db.exec('SELECT * FROM groups');

    if (result.length === 0) return [];

    const groups: Group[] = [];
    for (const row of result[0].values) {
      const group = await this.mapRowToGroup(row);
      groups.push(group);
    }
    return groups;
  }

  async getById(id: string): Promise<Group | null> {
    const db = await this.dbService.getDatabase();
    const stmt = db.prepare('SELECT * FROM groups WHERE id = ?');
    stmt.bind([id]);

    if (stmt.step()) {
      const row = stmt.get();
      stmt.free();
      return this.mapRowToGroup(row);
    }

    stmt.free();
    return null;
  }

  async getByUserId(userId: string): Promise<Group[]> {
    const db = await this.dbService.getDatabase();
    const result = db.exec(`
      SELECT g.* FROM groups g
      INNER JOIN group_members gm ON g.id = gm.group_id
      WHERE gm.user_id = '${userId}'
    `);

    if (result.length === 0) return [];

    const groups: Group[] = [];
    for (const row of result[0].values) {
      const group = await this.mapRowToGroup(row);
      groups.push(group);
    }
    return groups;
  }

  async getByInviteCode(code: string): Promise<Group | null> {
    const db = await this.dbService.getDatabase();
    const stmt = db.prepare('SELECT * FROM groups WHERE invite_code = ?');
    stmt.bind([code]);

    if (stmt.step()) {
      const row = stmt.get();
      stmt.free();
      return this.mapRowToGroup(row);
    }

    stmt.free();
    return null;
  }

  async create(groupData: Omit<Group, 'id' | 'createdAt'>): Promise<Group> {
    const db = await this.dbService.getDatabase();
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    const inviteCode = groupData.inviteCode || this.generateInviteCode();

    db.run(
      `INSERT INTO groups (id, name, description, admin_id, invite_code, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, groupData.name, groupData.description || null, groupData.adminId, inviteCode, createdAt]
    );

    // Aggiungi l'admin come membro
    db.run(`INSERT INTO group_members (group_id, user_id, joined_at) VALUES (?, ?, ?)`, [
      id,
      groupData.adminId,
      createdAt
    ]);

    // Aggiungo gli altri membri se presenti
    for (const memberId of groupData.memberIds) {
      if (memberId !== groupData.adminId) {
        db.run(`INSERT INTO group_members (group_id, user_id, joined_at) VALUES (?, ?, ?)`, [
          id,
          memberId,
          createdAt
        ]);
      }
    }

    this.dbService.saveDatabase();

    return {
      id,
      name: groupData.name,
      description: groupData.description,
      adminId: groupData.adminId,
      memberIds: [groupData.adminId, ...groupData.memberIds.filter((m) => m !== groupData.adminId)],
      inviteCode,
      createdAt: new Date(createdAt)
    };
  }

  async update(id: string, groupData: Partial<Group>): Promise<Group | null> {
    const existing = await this.getById(id);
    if (!existing) return null;

    const db = await this.dbService.getDatabase();

    const fields: string[] = [];
    const values: (string | number | null)[] = [];

    if (groupData.name) {
      fields.push('name = ?');
      values.push(groupData.name);
    }
    if (groupData.description !== undefined) {
      fields.push('description = ?');
      values.push(groupData.description);
    }

    if (fields.length > 0) {
      values.push(id);
      db.run(`UPDATE groups SET ${fields.join(', ')} WHERE id = ?`, values);
      this.dbService.saveDatabase();
    }

    return this.getById(id);
  }

  async delete(id: string): Promise<boolean> {
    const db = await this.dbService.getDatabase();
    db.run('DELETE FROM group_members WHERE group_id = ?', [id]);
    db.run('DELETE FROM groups WHERE id = ?', [id]);
    this.dbService.saveDatabase();
    return true;
  }

  async addMember(groupId: string, userId: string): Promise<boolean> {
    const db = await this.dbService.getDatabase();
    const joinedAt = new Date().toISOString();

    try {
      db.run(`INSERT INTO group_members (group_id, user_id, joined_at) VALUES (?, ?, ?)`, [
        groupId,
        userId,
        joinedAt
      ]);
      this.dbService.saveDatabase();
      return true;
    } catch {
      return false;
    }
  }

  async removeMember(groupId: string, userId: string): Promise<boolean> {
    const db = await this.dbService.getDatabase();
    db.run('DELETE FROM group_members WHERE group_id = ? AND user_id = ?', [groupId, userId]);
    this.dbService.saveDatabase();
    return true;
  }

  private async mapRowToGroup(row: any[]): Promise<Group> {
    const db = await this.dbService.getDatabase();
    const membersResult: QueryExecResult[] = db.exec(
      `SELECT user_id FROM group_members WHERE group_id = '${row[0]}'`
    );
    const memberIds: string[] =
      membersResult.length > 0
        ? membersResult[0].values.map((r: SqlValue[]) => r[0] as string)
        : [];

    return {
      id: row[0] as string,
      name: row[1] as string,
      description: row[2] as string | undefined,
      adminId: row[3] as string,
      inviteCode: row[4] as string | undefined,
      memberIds,
      createdAt: new Date(row[5] as string)
    };
  }

  private generateInviteCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }
}
