import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const apps = pgTable("apps", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  platform: text("platform").notNull(),
  status: text("status").notNull(),
  category: text("category").notNull(),
  icon: text("icon"),
  liveUrl: text("live_url"),
  repositoryUrl: text("repository_url"),
  notes: text("notes"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertAppSchema = createInsertSchema(apps).omit({
  id: true,
  updatedAt: true,
}).extend({
  icon: z.string().optional(),
  liveUrl: z.string().optional(),
  repositoryUrl: z.string().optional(),
  notes: z.string().optional(),
});

export type InsertApp = z.infer<typeof insertAppSchema>;
export type App = typeof apps.$inferSelect;
