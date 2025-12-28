import z from "zod";
import { Role } from "./stats.js";

export const GameResponse = z.object({
    id: z.uuid(),
    groupId: z.uuid(),
    result: z.enum(['GOOD_WIN', 'EVIL_WIN']),
    winType: z.enum(['THREE_MISSIONS', 'ASSASSINATION']).nullable(),
    notes: z.string().nullable(),
    playedAt: z.string(),
})

export const GameArrayResponse = z.array(GameResponse)

export const GameRequest = z.object({
    groupId: z.uuid(),
    result: z.enum(['GOOD_WIN', 'EVIL_WIN']),
    winType: z.enum(['THREE_MISSIONS', 'ASSASSINATION']).nullable(),
    notes: z.string().nullable(),
    participants: z.array(
        z.object({
            userId: z.uuid(),
            role: Role,
            faction: z.enum(['GOOD', 'EVIL']),
        }),
    ),
})

export const GameUpdateRequest = GameRequest.partial().refine(
    (data) => Object.keys(data).length > 0,
    { message: 'At least one field must be provided' },
)

export const GameFilters = z.object({
    playedAt: z.string().optional(),
    winType: z.enum(['THREE_MISSIONS', 'ASSASSINATION']).optional(),
    result: z.enum(['GOOD_WIN', 'EVIL_WIN']).optional(),
}).partial().optional()

export type GameFiltersType = z.infer<typeof GameFilters>
export type GameResponseType = z.infer<typeof GameResponse>
export type GameRequestType = z.infer<typeof GameRequest>
export type GameArrayType = z.infer<typeof GameArrayResponse>
export type GameUpdateRequestType = z.infer<typeof GameUpdateRequest>