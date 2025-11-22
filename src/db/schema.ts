import { jsonb, pgTable, text } from 'drizzle-orm/pg-core';

export const hotels = pgTable('hotels', {
  id: text('id').primaryKey(),
  rooms: jsonb('rooms').$type<{
    type: string;
    quantity: number;
  }>().notNull(),
});

export type Hotel = typeof hotels.$inferSelect;
export type NewHotel = typeof hotels.$inferInsert;
