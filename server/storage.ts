import { messages, users, type Message, type InsertMessage, type User } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUsers(): Promise<User[]>; // For user list
  createMessage(userId: string, content: string): Promise<Message & { sender: User }>;
  getMessages(): Promise<(Message & { sender: User })[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async createMessage(senderId: string, content: string): Promise<Message & { sender: User }> {
    const [message] = await db
      .insert(messages)
      .values({
        content,
        senderId,
      })
      .returning();

    const user = await this.getUser(senderId);
    if (!user) throw new Error("User not found");

    return { ...message, sender: user };
  }

  async getMessages(): Promise<(Message & { sender: User })[]> {
    return await db.query.messages.findMany({
      with: {
        sender: true,
      },
      orderBy: desc(messages.createdAt),
      limit: 50, // Limit to last 50 messages
    }).then(msgs => msgs.reverse()); // Show oldest first in chat
  }
}

export const storage = new DatabaseStorage();
