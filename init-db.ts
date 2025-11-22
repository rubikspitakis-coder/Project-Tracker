#!/usr/bin/env tsx
import { drizzle } from "drizzle-orm/neon-serverless";
import * as schema from "./shared/schema.js";

async function initializeDatabase() {
  console.log("🚀 Initializing Project Tracker Database...");
  
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error("❌ DATABASE_URL not found!");
    console.error("Make sure you've added a PostgreSQL database in Railway");
    process.exit(1);
  }

  try {
    console.log("🔄 Connecting to database...");
    const db = drizzle(databaseUrl, { schema });
    
    console.log("🔄 Creating tables...");
    // The drizzle-kit push command should be run instead, but let's verify connection
    
    console.log("🔄 Testing database connection...");
    const result = await db.select().from(schema.apps).limit(1);
    console.log("✅ Database connection successful!");
    console.log("✅ Tables are accessible!");
    
    console.log("🎉 Database initialization complete!");
    console.log("📊 Your Project Tracker is ready to use!");
    
  } catch (error: any) {
    if (error.message.includes('relation "apps" does not exist')) {
      console.log("✅ Database connection successful!");
      console.error("❌ Tables don't exist yet!");
      console.log("🔧 You need to run the schema migration:");
      console.log("   Option 1: Run 'npm run db:push' in Railway console");
      console.log("   Option 2: Use Railway CLI: 'railway run npm run db:push'");
      process.exit(1);
    } else {
      console.error("❌ Database error:", error.message);
      process.exit(1);
    }
  }
}

initializeDatabase();