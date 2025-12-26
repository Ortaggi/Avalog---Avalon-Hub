export type ParticipantInput = {
  userId: string;
  role:
    | 'MERLIN'
    | 'PERCIVAL'
    | 'GOOD_SIMPLE'
    | 'ASSASSIN'
    | 'MORGANA'
    | 'MORDRED'
    | 'OBERON'
    | 'EVIL_SIMPLE';
  faction: 'GOOD' | 'EVIL';
};

export type CreateGameInput = {
  groupId: string;
  result: 'GOOD_WIN' | 'EVIL_WIN';
  winType?: 'THREE_MISSIONS' | 'ASSASSINATION';
  notes?: string;
  participants: ParticipantInput[];
};
