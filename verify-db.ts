import { drizzle } from "drizzle-orm/neon-serverless";
import * as schema from "./shared/schema.js";

async function verifyDatabase() {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error("❌ DATABASE_URL not found!");
    process.exit(1);
  }

  try {
    console.log("🔄 Connecting to database...");
    const db = drizzle(databaseUrl, { schema });
    
    // Test connection and check if tables exist
    const result = await db.select().from(schema.apps).limit(1);
    console.log("✅ Database connection successful!");
    console.log("✅ Tables exist and are accessible!");
    console.log(`📊 Current apps count: ${result.length}`);
    
    // Test insert (optional)
    console.log("🧪 Testing database operations...");
    const testApp = await db.insert(schema.apps).values({
      name: "Test App",
      platform: "Web",
      status: "Development",
      category: "Testing",
      notes: "Database verification test"
    }).returning();
    
    console.log("✅ Insert test successful!");
    
    // Clean up test data
    await db.delete(schema.apps).where(schema.apps.id.eq(testApp[0].id));
    console.log("✅ Cleanup successful!");
    
    console.log("🎉 Database is fully operational!");
    
  } catch (error: any) {
    if (error.message.includes('relation "apps" does not exist')) {
      console.error("❌ Tables don't exist! Run: npm run db:push");
    } else {
      console.error("❌ Database error:", error.message);
    }
    process.exit(1);
  }
}

verifyDatabase();