export interface Group {
  id: string;
  name: string;
  description?: string;
  adminId: string;
  memberIds: string[];
  inviteCode?: string;
  createdAt: Date;
}
