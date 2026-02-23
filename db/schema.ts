import { sql } from 'drizzle-orm';
import { pgTable, serial, varchar, timestamp, integer, jsonb, pgEnum, text, boolean } from 'drizzle-orm/pg-core';

// Enum for match status
export const sportsTypeEnum = pgEnum('sports_type', ['football', 'cricket']);

// User table for Better-Auth
export const user = pgTable("user", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").notNull(),
    image: text("image"),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
});

// Session table for Better-Auth
export const session = pgTable("session", {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
        .notNull()
        .references(() => user.id),
});

// Account table for Better-Auth
export const account = pgTable("account", {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
});

// Verification table for Better-Auth
export const verification = pgTable("verification", {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at"),
    updatedAt: timestamp("updated_at"),
});

// Matches table    
export const matches = pgTable('matches', {
    id: serial('id').primaryKey(),
    userId: text('user_id').references(() => user.id), // Added for CMS ownership
    sport: sportsTypeEnum('sport').notNull(),
    homeTeam: varchar('home_team', { length: 255 }).notNull(),
    awayTeam: varchar('away_team', { length: 255 }).notNull(),
    startTime: timestamp('start_time', { withTimezone: true }).notNull(),
    endTime: timestamp('end_time', { withTimezone: true }).notNull(),
    homeScore: integer('home_score').notNull().default(0),
    homeWickets: integer('home-wickets').notNull().default(0),
    awayWickets: integer('away-wickets').notNull().default(0),
    awayScore: integer('away_score').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().default(sql`now()`),
});

// Commentary table
export const commentary = pgTable('commentary', {
    id: serial('id').primaryKey(),
    matchId: integer('match_id')
        .notNull()
        .references(() => matches.id, { onDelete: 'cascade' }),
    minute: integer('minute'),
    over: integer('over'),
    run: integer('run'),
    sequence: integer('sequence').notNull(),
    eventType: varchar('event_type', { length: 100 }).notNull(),
    actor: varchar('actor', { length: 255 }),
    team: varchar('team', { length: 255 }),
    message: varchar('message', { length: 1000 }).notNull(),
    metadata: jsonb('metadata'),
    // tags: text('tags').array(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().default(sql`now()`),
});
