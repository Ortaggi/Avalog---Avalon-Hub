import z from "zod";

export const GroupRequest = z.object({
    name: z.string().min(3),
    adminId: z.uuid(),
});

export const GroupUpdateRequest = z.object({
    name: z.string().min(3),
});

export const GroupMemberRequest = z.object({
    userId: z.uuid(),
    role: z.enum(['ADMIN', 'MEMBER']).optional(),
});

export const GroupMemberResponse = z.object({
    id: z.uuid(),
    email: z.string().email(),
    nickname: z.string().nullable(),
    role: z.enum(['ADMIN', 'MEMBER']),
});

export const GroupResponse = z.object({
    id: z.uuid(),
    name: z.string(),
})

export const GroupDetailResponse = z.object({
    id: z.uuid(),
    name: z.string(),
    adminId: z.uuid(),
    members: z.array(GroupMemberResponse),
});

export type GroupRequestType = z.infer<typeof GroupRequest>;
export type GroupUpdateRequestType = z.infer<typeof GroupUpdateRequest>;
export type GroupMemberRequestType = z.infer<typeof GroupMemberRequest>;
export type GroupMemberResponseType = z.infer<typeof GroupMemberResponse>;
export type GroupResponseType = z.infer<typeof GroupResponse>;
export type GroupDetailResponseType = z.infer<typeof GroupDetailResponse>;