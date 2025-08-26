import { type User, type InsertUser, type EmailLog, type InsertEmailLog } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  
  // Email log methods
  createEmailLog(log: InsertEmailLog): Promise<EmailLog>;
  getEmailLogs(): Promise<EmailLog[]>;
  updateEmailLogStatus(id: string, status: string, errorMessage?: string): Promise<void>;
  
  // Stats methods
  getEmailStatsToday(): Promise<{ sent: number; failed: number; total: number }>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private emailLogs: Map<string, EmailLog>;

  constructor() {
    this.users = new Map();
    this.emailLogs = new Map();
    
    // Add some default users for testing
    this.seedDefaultUsers();
  }

  private async seedDefaultUsers() {
    const defaultUsers = [
      { name: "John Doe", email: "john@example.com", firebaseUid: null },
      { name: "Jane Smith", email: "jane@example.com", firebaseUid: null },
      { name: "Mike Johnson", email: "mike@example.com", firebaseUid: null },
      { name: "Sarah Wilson", email: "sarah@example.com", firebaseUid: null },
      { name: "Tom Brown", email: "tom@example.com", firebaseUid: null },
    ];

    for (const user of defaultUsers) {
      await this.createUser(user);
    }
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async createEmailLog(insertLog: InsertEmailLog): Promise<EmailLog> {
    const id = randomUUID();
    const log: EmailLog = {
      ...insertLog,
      id,
      sentAt: new Date(),
    };
    this.emailLogs.set(id, log);
    return log;
  }

  async getEmailLogs(): Promise<EmailLog[]> {
    return Array.from(this.emailLogs.values()).sort((a, b) => 
      new Date(b.sentAt!).getTime() - new Date(a.sentAt!).getTime()
    );
  }

  async updateEmailLogStatus(id: string, status: string, errorMessage?: string): Promise<void> {
    const log = this.emailLogs.get(id);
    if (log) {
      log.status = status;
      if (errorMessage) {
        log.errorMessage = errorMessage;
      }
      this.emailLogs.set(id, log);
    }
  }

  async getEmailStatsToday(): Promise<{ sent: number; failed: number; total: number }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todaysLogs = Array.from(this.emailLogs.values()).filter(log => 
      log.sentAt && new Date(log.sentAt) >= today
    );

    const sent = todaysLogs.filter(log => log.status === "sent").length;
    const failed = todaysLogs.filter(log => log.status === "failed").length;
    const total = todaysLogs.length;

    return { sent, failed, total };
  }
}

export const storage = new MemStorage();
