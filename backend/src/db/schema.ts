import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  timestamp,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const plotStatusEnum = pgEnum('plot_status', [
  'seed',
  'sprout',
  'growing',
  'blooming',
  'withered',
]);

export const moodEnum = pgEnum('mood', ['sunny', 'cloudy', 'stormy', 'rainy']);

// Users – garden owners
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password_hash: text('password_hash').notNull(),
  avatar_url: text('avatar_url'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Plants – types of plants available (each is a metaphor for a virtue)
// The wisdom_message is the hidden insight revealed only when the plant blooms
export const plants = pgTable('plants', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description').notNull(),
  wisdom_message: text('wisdom_message').notNull(),
  growth_days: integer('growth_days').notNull().default(7),
  image_key: varchar('image_key', { length: 255 }),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Garden plots – user's 3x3 grid of garden slots (max 9 per user)
export const gardenPlots = pgTable('garden_plots', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  slot_index: integer('slot_index').notNull(),
  plant_id: integer('plant_id').references(() => plants.id, {
    onDelete: 'set null',
  }),
  planted_at: timestamp('planted_at'),
  watered_at: timestamp('watered_at'),
  status: plotStatusEnum('status').default('seed'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Journal entries – daily gratitude / reflection log
export const journalEntries = pgTable('journal_entries', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  mood: moodEnum('mood').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Community gifts – sharing fruits with other gardeners
export const communityGifts = pgTable('community_gifts', {
  id: serial('id').primaryKey(),
  sender_id: integer('sender_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  receiver_id: integer('receiver_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  plant_id: integer('plant_id').references(() => plants.id, {
    onDelete: 'set null',
  }),
  message: text('message'),
  sent_at: timestamp('sent_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  gardenPlots: many(gardenPlots),
  journalEntries: many(journalEntries),
  sentGifts: many(communityGifts, { relationName: 'sender' }),
  receivedGifts: many(communityGifts, { relationName: 'receiver' }),
}));

export const plantsRelations = relations(plants, ({ many }) => ({
  gardenPlots: many(gardenPlots),
  gifts: many(communityGifts),
}));

export const gardenPlotsRelations = relations(gardenPlots, ({ one }) => ({
  user: one(users, { fields: [gardenPlots.user_id], references: [users.id] }),
  plant: one(plants, {
    fields: [gardenPlots.plant_id],
    references: [plants.id],
  }),
}));

export const journalEntriesRelations = relations(journalEntries, ({ one }) => ({
  user: one(users, {
    fields: [journalEntries.user_id],
    references: [users.id],
  }),
}));

export const communityGiftsRelations = relations(
  communityGifts,
  ({ one }) => ({
    sender: one(users, {
      fields: [communityGifts.sender_id],
      references: [users.id],
      relationName: 'sender',
    }),
    receiver: one(users, {
      fields: [communityGifts.receiver_id],
      references: [users.id],
      relationName: 'receiver',
    }),
    plant: one(plants, {
      fields: [communityGifts.plant_id],
      references: [plants.id],
    }),
  })
);
