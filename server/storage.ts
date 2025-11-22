import { type App, type InsertApp, apps } from "@shared/schema";
import { randomUUID } from "crypto";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { eq } from "drizzle-orm";
import * as schema from "@shared/schema";

export interface IStorage {
  getApp(id: string): Promise<App | undefined>;
  getAllApps(): Promise<App[]>;
  createApp(app: InsertApp): Promise<App>;
  updateApp(id: string, app: Partial<InsertApp>): Promise<App | undefined>;
  deleteApp(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private apps: Map<string, App>;

  constructor() {
    this.apps = new Map();
  }

  async getApp(id: string): Promise<App | undefined> {
    return this.apps.get(id);
  }

  async getAllApps(): Promise<App[]> {
    return Array.from(this.apps.values());
  }

  async createApp(insertApp: InsertApp): Promise<App> {
    const id = randomUUID();
    const app: App = {
      ...insertApp,
      id,
      liveUrl: insertApp.liveUrl || null,
      repositoryUrl: insertApp.repositoryUrl || null,
      notes: insertApp.notes || null,
      updatedAt: new Date(),
    };
    this.apps.set(id, app);
    return app;
  }

  async updateApp(id: string, insertApp: Partial<InsertApp>): Promise<App | undefined> {
    const app = this.apps.get(id);
    if (!app) return undefined;

    const updatedApp: App = {
      ...app,
      ...insertApp,
      liveUrl: insertApp.liveUrl !== undefined ? insertApp.liveUrl || null : app.liveUrl,
      repositoryUrl: insertApp.repositoryUrl !== undefined ? insertApp.repositoryUrl || null : app.repositoryUrl,
      notes: insertApp.notes !== undefined ? insertApp.notes || null : app.notes,
      updatedAt: new Date(),
    };
    this.apps.set(id, updatedApp);
    return updatedApp;
  }

  async deleteApp(id: string): Promise<boolean> {
    return this.apps.delete(id);
  }
}

export class DbStorage implements IStorage {
  private db;
  private pool;

  constructor(databaseUrl: string) {
    this.pool = new Pool({
      connectionString: databaseUrl,
      ssl: false, // Railway internal connections don't need SSL
    });
    this.db = drizzle(this.pool, { schema });
  }

  async getApp(id: string): Promise<App | undefined> {
    const result = await this.db.select().from(apps).where(eq(apps.id, id));
    return result[0];
  }

  async getAllApps(): Promise<App[]> {
    return await this.db.select().from(apps);
  }

  async createApp(insertApp: InsertApp): Promise<App> {
    const result = await this.db.insert(apps).values(insertApp).returning();
    return result[0];
  }

  async updateApp(id: string, insertApp: Partial<InsertApp>): Promise<App | undefined> {
    const result = await this.db
      .update(apps)
      .set({ ...insertApp, updatedAt: new Date() })
      .where(eq(apps.id, id))
      .returning();
    return result[0];
  }

  async deleteApp(id: string): Promise<boolean> {
    const result = await this.db.delete(apps).where(eq(apps.id, id)).returning();
    return result.length > 0;
  }
}

// Use database storage if DATABASE_URL is provided, otherwise fall back to memory storage
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.warn("⚠️  DATABASE_URL not found. Using in-memory storage. Data will be lost on restart!");
}

export const storage: IStorage = databaseUrl
  ? new DbStorage(databaseUrl)
  : new MemStorage();
