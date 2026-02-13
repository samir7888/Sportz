import { z } from 'zod';

// Match status constants
export const MATCH_STATUS = {
    SCHEDULED: 'scheduled',
    LIVE: 'live',
    FINISHED: 'finished',
} as const;

// List matches query schema
export const listMatchesQuerySchema = z.object({
    limit: z.coerce.number().int().positive().max(100).optional(),
});

// Match ID parameter schema
export const matchIdParamSchema = z.object({
    id: z.coerce.number().int().positive(),
});

// Create match schema
export const createMatchSchema = z
    .object({
        sport: z.string().min(1, 'Sport is required'),
        homeTeam: z.string().min(1, 'Home team is required'),
        awayTeam: z.string().min(1, 'Away team is required'),
        startTime: z.iso.datetime(),
        endTime: z.iso.datetime(),
        homeScore: z.coerce.number().int().nonnegative().optional(),
        awayScore: z.coerce.number().int().nonnegative().optional(),
    })
    .superRefine((data, ctx) => {
        const startDate = new Date(data.startTime);
        const endDate = new Date(data.endTime);

        if (endDate <= startDate) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'End time must be after start time',
                path: ['endTime'],
            });
        }
    });

// Update score schema
export const updateScoreSchema = z.object({
    homeScore: z.coerce.number().int().nonnegative(),
    awayScore: z.coerce.number().int().nonnegative(),
});

// Type exports for convenience
export type ListMatchesQuery = z.infer<typeof listMatchesQuerySchema>;
export type MatchIdParam = z.infer<typeof matchIdParamSchema>;
export type CreateMatch = z.infer<typeof createMatchSchema>;
export type UpdateScore = z.infer<typeof updateScoreSchema>;
