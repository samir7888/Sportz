import { z } from 'zod';

// List commentary query schema
export const listCommentaryQuerySchema = z.object({
    limit: z.coerce.number().int().positive().max(100).optional(),
});

// Create commentary schema
export const createCommentarySchema = z.object({
    minute: z.coerce.number().int().nonnegative(),
    sequence: z.coerce.number().int(),
    period: z.string(),
    eventType: z.string(),
    actor: z.string().optional(),
    team: z.string().optional(),
    message: z.string().min(1, 'Message is required'),
    metadata: z.record(z.string(), z.any()).optional(),
    tags: z.array(z.string()).optional(),
});

// Type exports for convenience
export type ListCommentaryQuery = z.infer<typeof listCommentaryQuerySchema>;
export type CreateCommentary = z.infer<typeof createCommentarySchema>;
