import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { storage } from "./storage";
import { firestore } from "./services/firebase-admin";
import { sendBulkEmails } from "./services/resend";
import { sendEmailSchema } from "@shared/schema";

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all users
  app.get("/api/users", async (req, res) => {
    try {
      // Try to get users from Firestore first, fallback to memory storage
      let users = [];
      
      try {
        if (firestore) {
          const usersSnapshot = await firestore.collection("users").get();
          users = usersSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
        } else {
          users = await storage.getAllUsers();
        }
      } catch (error) {
        console.log("Firestore not available, using memory storage");
        users = await storage.getAllUsers();
      }

      res.json(users);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get email logs
  app.get("/api/email-logs", async (req, res) => {
    try {
      const logs = await storage.getEmailLogs();
      res.json(logs);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get dashboard stats
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      const todayStats = await storage.getEmailStatsToday();
      
      const successRate = todayStats.total > 0 
        ? (todayStats.sent / todayStats.total) * 100 
        : 100;

      res.json({
        totalUsers: users.length,
        emailsSentToday: todayStats.sent,
        successRate,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Send bulk email
  app.post("/api/send-email", async (req, res) => {
    try {
      const { subject, htmlContent } = sendEmailSchema.parse(req.body);

      // Get all users for sending
      let users = [];
      
      try {
        if (firestore) {
          const usersSnapshot = await firestore.collection("users").get();
          users = usersSnapshot.docs.map(doc => ({
            id: doc.id,
            name: doc.data().name,
            email: doc.data().email,
          }));
        } else {
          const storageUsers = await storage.getAllUsers();
          users = storageUsers.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
          }));
        }
      } catch (error) {
        console.log("Firestore not available, using memory storage");
        const storageUsers = await storage.getAllUsers();
        users = storageUsers.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
        }));
      }

      if (users.length === 0) {
        return res.status(400).json({ message: "No users found to send emails to" });
      }

      // Send emails using Resend
      const results = await sendBulkEmails(
        users,
        subject,
        htmlContent,
        (sent, total) => {
          console.log(`Sent ${sent}/${total} emails`);
        }
      );

      // Log all email attempts
      for (const result of results) {
        const user = users.find(u => u.email === result.email);
        if (user) {
          await storage.createEmailLog({
            recipientId: user.id,
            recipientEmail: result.email,
            recipientName: result.name,
            subject,
            htmlContent,
            status: result.status,
            errorMessage: result.status === "failed" ? result.error : null,
            resendId: result.status === "sent" ? result.resendId : null,
          });
        }
      }

      const sentCount = results.filter(r => r.status === "sent").length;
      const failedCount = results.filter(r => r.status === "failed").length;

      res.json({
        message: `Email sending completed. ${sentCount} sent, ${failedCount} failed.`,
        results: {
          sent: sentCount,
          failed: failedCount,
          total: results.length,
        },
      });
    } catch (error: any) {
      console.error("Send email error:", error);
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
