var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";
import session from "express-session";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  apps: () => apps,
  insertAppSchema: () => insertAppSchema
});
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var apps = pgTable("apps", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  platform: text("platform").notNull(),
  status: text("status").notNull(),
  category: text("category").notNull(),
  icon: text("icon"),
  liveUrl: text("live_url"),
  repositoryUrl: text("repository_url"),
  notes: text("notes"),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});
var insertAppSchema = createInsertSchema(apps).omit({
  id: true,
  updatedAt: true
}).extend({
  icon: z.string().optional(),
  liveUrl: z.string().optional(),
  repositoryUrl: z.string().optional(),
  notes: z.string().optional()
});

// server/storage.ts
import { randomUUID } from "crypto";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { eq } from "drizzle-orm";
var MemStorage = class {
  apps;
  constructor() {
    this.apps = /* @__PURE__ */ new Map();
  }
  async getApp(id) {
    return this.apps.get(id);
  }
  async getAllApps() {
    return Array.from(this.apps.values());
  }
  async createApp(insertApp) {
    const id = randomUUID();
    const app2 = {
      ...insertApp,
      id,
      icon: insertApp.icon || null,
      liveUrl: insertApp.liveUrl || null,
      repositoryUrl: insertApp.repositoryUrl || null,
      notes: insertApp.notes || null,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.apps.set(id, app2);
    return app2;
  }
  async updateApp(id, insertApp) {
    const app2 = this.apps.get(id);
    if (!app2) return void 0;
    const updatedApp = {
      ...app2,
      ...insertApp,
      icon: insertApp.icon !== void 0 ? insertApp.icon || null : app2.icon,
      liveUrl: insertApp.liveUrl !== void 0 ? insertApp.liveUrl || null : app2.liveUrl,
      repositoryUrl: insertApp.repositoryUrl !== void 0 ? insertApp.repositoryUrl || null : app2.repositoryUrl,
      notes: insertApp.notes !== void 0 ? insertApp.notes || null : app2.notes,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.apps.set(id, updatedApp);
    return updatedApp;
  }
  async deleteApp(id) {
    return this.apps.delete(id);
  }
};
var DbStorage = class {
  db;
  pool;
  constructor(databaseUrl2) {
    this.pool = new Pool({
      connectionString: databaseUrl2,
      ssl: false
      // Railway internal connections don't need SSL
    });
    this.db = drizzle(this.pool, { schema: schema_exports });
  }
  async getApp(id) {
    const result = await this.db.select().from(apps).where(eq(apps.id, id));
    return result[0];
  }
  async getAllApps() {
    return await this.db.select().from(apps);
  }
  async createApp(insertApp) {
    const result = await this.db.insert(apps).values(insertApp).returning();
    return result[0];
  }
  async updateApp(id, insertApp) {
    const result = await this.db.update(apps).set({ ...insertApp, updatedAt: /* @__PURE__ */ new Date() }).where(eq(apps.id, id)).returning();
    return result[0];
  }
  async deleteApp(id) {
    const result = await this.db.delete(apps).where(eq(apps.id, id)).returning();
    return result.length > 0;
  }
};
var databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.warn("\u26A0\uFE0F  DATABASE_URL not found. Using in-memory storage. Data will be lost on restart!");
}
var storage = databaseUrl ? new DbStorage(databaseUrl) : new MemStorage();

// server/routes.ts
import { z as z2 } from "zod";

// server/auth.ts
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
var AUTH_USERNAME = "admin";
var AUTH_PASSWORD = process.env.AUTH_PASSWORD;
if (!AUTH_PASSWORD) {
  throw new Error("AUTH_PASSWORD environment variable is required");
}
var PASSWORD_HASH = bcrypt.hashSync(AUTH_PASSWORD, 10);
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      if (username !== AUTH_USERNAME) {
        return done(null, false, { message: "Invalid username or password" });
      }
      const isValid = await bcrypt.compare(password, PASSWORD_HASH);
      if (!isValid) {
        return done(null, false, { message: "Invalid username or password" });
      }
      const user = { id: "1", username: AUTH_USERNAME };
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  const user = { id, username: AUTH_USERNAME };
  done(null, user);
});
var auth_default = passport;

// server/routes.ts
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: "Unauthorized" });
}
async function registerRoutes(app2) {
  app2.post("/api/login", (req, res, next) => {
    auth_default.authenticate("local", (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ error: info?.message || "Invalid credentials" });
      }
      req.logIn(user, (err2) => {
        if (err2) {
          return next(err2);
        }
        return res.json({ success: true, user });
      });
    })(req, res, next);
  });
  app2.post("/api/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      req.session.destroy((destroyErr) => {
        if (destroyErr) {
          return res.status(500).json({ error: "Session destruction failed" });
        }
        res.clearCookie("connect.sid");
        res.json({ success: true });
      });
    });
  });
  app2.get("/api/auth/check", (req, res) => {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    if (req.isAuthenticated()) {
      return res.json({ authenticated: true, user: req.user });
    }
    res.json({ authenticated: false });
  });
  app2.use("/api/apps", isAuthenticated);
  app2.get("/api/apps", async (req, res) => {
    try {
      const apps2 = await storage.getAllApps();
      res.json(apps2);
    } catch (error) {
      console.error("Error fetching apps:", error);
      res.status(500).json({ error: "Failed to fetch apps" });
    }
  });
  app2.get("/api/apps/:id", async (req, res) => {
    try {
      const app3 = await storage.getApp(req.params.id);
      if (!app3) {
        return res.status(404).json({ error: "App not found" });
      }
      res.json(app3);
    } catch (error) {
      console.error("Error fetching app:", error);
      res.status(500).json({ error: "Failed to fetch app" });
    }
  });
  app2.post("/api/apps", async (req, res) => {
    try {
      const validatedData = insertAppSchema.parse(req.body);
      const newApp = await storage.createApp(validatedData);
      res.status(201).json(newApp);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      console.error("Error creating app:", error);
      res.status(500).json({ error: "Failed to create app" });
    }
  });
  app2.put("/api/apps/:id", async (req, res) => {
    try {
      const validatedData = insertAppSchema.partial().parse(req.body);
      const updatedApp = await storage.updateApp(req.params.id, validatedData);
      if (!updatedApp) {
        return res.status(404).json({ error: "App not found" });
      }
      res.json(updatedApp);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      console.error("Error updating app:", error);
      res.status(500).json({ error: "Failed to update app" });
    }
  });
  app2.delete("/api/apps/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteApp(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "App not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting app:", error);
      res.status(500).json({ error: "Failed to delete app" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
var vite_config_default = defineConfig({
  plugins: [
    react()
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.set("trust proxy", 1);
var sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET environment variable is required");
}
app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1e3
      // 24 hours
    }
  })
);
app.use(auth_default.initialize());
app.use(auth_default.session());
app.use(express2.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
