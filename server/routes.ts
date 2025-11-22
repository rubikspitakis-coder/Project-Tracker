import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAppSchema } from "@shared/schema";
import { z } from "zod";
import passport from "./auth";

function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: "Unauthorized" });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ error: info?.message || "Invalid credentials" });
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        return res.json({ success: true, user });
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res) => {
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

  app.get("/api/auth/check", (req, res) => {
    // Prevent caching of auth status to ensure fresh data after login
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    
    if (req.isAuthenticated()) {
      return res.json({ authenticated: true, user: req.user });
    }
    res.json({ authenticated: false });
  });

  // Protect all app routes
  app.use("/api/apps", isAuthenticated);

  // Get all apps
  app.get("/api/apps", async (req, res) => {
    try {
      const apps = await storage.getAllApps();
      res.json(apps);
    } catch (error) {
      console.error("Error fetching apps:", error);
      res.status(500).json({ error: "Failed to fetch apps" });
    }
  });

  // Get single app
  app.get("/api/apps/:id", async (req, res) => {
    try {
      const app = await storage.getApp(req.params.id);
      if (!app) {
        return res.status(404).json({ error: "App not found" });
      }
      res.json(app);
    } catch (error) {
      console.error("Error fetching app:", error);
      res.status(500).json({ error: "Failed to fetch app" });
    }
  });

  // Create new app
  app.post("/api/apps", async (req, res) => {
    try {
      const validatedData = insertAppSchema.parse(req.body);
      const newApp = await storage.createApp(validatedData);
      res.status(201).json(newApp);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      console.error("Error creating app:", error);
      res.status(500).json({ error: "Failed to create app" });
    }
  });

  // Update app
  app.put("/api/apps/:id", async (req, res) => {
    try {
      const validatedData = insertAppSchema.partial().parse(req.body);
      const updatedApp = await storage.updateApp(req.params.id, validatedData);
      if (!updatedApp) {
        return res.status(404).json({ error: "App not found" });
      }
      res.json(updatedApp);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      console.error("Error updating app:", error);
      res.status(500).json({ error: "Failed to update app" });
    }
  });

  // Delete app
  app.delete("/api/apps/:id", async (req, res) => {
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

  const httpServer = createServer(app);

  return httpServer;
}
