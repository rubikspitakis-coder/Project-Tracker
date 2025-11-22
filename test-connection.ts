#!/usr/bin/env tsx

async function testDatabaseConnection() {
  console.log("🔍 Database Connection Diagnostics");
  console.log("==================================");

  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error("❌ DATABASE_URL environment variable not found!");
    console.log("🔧 Fix: In Railway dashboard, connect PostgreSQL to your service");
    process.exit(1);
  }

  console.log("✅ DATABASE_URL found");
  console.log("🔗 URL format:", databaseUrl.replace(/:[^:@]*@/, ':****@')); // Hide password

  // Test basic connection without Drizzle
  try {
    console.log("🔄 Testing basic connection...");

    // Use a simple fetch to test if the database is reachable
    const url = new URL(databaseUrl);
    console.log("📍 Host:", url.hostname);
    console.log("🔌 Port:", url.port || "5432");
    console.log("🗄️  Database:", url.pathname.slice(1));

    // Try to import and test pg connection
    const { Pool } = await import("pg");
    const pool = new Pool({
      connectionString: databaseUrl,
      ssl: false, // Railway internal connections don't need SSL
    });

    console.log("🔄 Testing SQL connection...");
    const client = await pool.connect();
    const result = await client.query('SELECT 1 as test');
    client.release();
    console.log("✅ Basic SQL connection successful!");
    console.log("📊 Test result:", result.rows);

    // Now test with Drizzle
    console.log("🔄 Testing Drizzle ORM...");
    const { drizzle } = await import("drizzle-orm/node-postgres");
    const db = drizzle(pool);

    // Test a simple query
    const dbResult = await client.query('SELECT NOW() as current_time');
    console.log("✅ Drizzle ORM connection successful!");
    console.log("⏰ Database time:", dbResult.rows);

    await pool.end();

    console.log("🎉 All connection tests passed!");
    console.log("🔧 Next step: Run 'npm run db:push' to create tables");

  } catch (error: any) {
    console.error("❌ Connection failed:", error.message);
    console.log("\n🔧 Troubleshooting steps:");
    console.log("1. Verify PostgreSQL service is running in Railway");
    console.log("2. Check if DATABASE_URL is correctly connected");
    console.log("3. Wait 2-3 minutes for database to fully initialize");
    console.log("4. Try redeploying your service");
    process.exit(1);
  }
}

testDatabaseConnection();
