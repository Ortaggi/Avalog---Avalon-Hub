import { z } from "zod";

export const Role = z.enum([
    'MERLIN',
    'PERCIVAL',
    'GOOD_SIMPLE',
    'ASSASSIN',
    'MORGANA',
    'MORDRED',
    'OBERON',
    'EVIL_SIMPLE',
]);

export const UserStatsResponse = z.object({
    totalGames: z.number(),
    wins: z.number(),
    goodWins: z.number(),
    evilWins: z.number(),
    mostPlayedRole: Role.nullable(),
    bestRole: Role.nullable(),
});

export type RoleType = z.infer<typeof Role>;