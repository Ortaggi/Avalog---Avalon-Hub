export type CreateGroupInput = {
  name: string;
  adminId: string;
};

export type AddMemberInput = {
  userId: string;
  role?: 'ADMIN' | 'MEMBER';
};
