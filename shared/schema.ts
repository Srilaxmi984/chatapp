import { z } from "zod";

export const insertMessageSchema = z.object({
    content: z.string().min(1, "Message cannot be empty"),
    senderId: z.number(), // Backend uses Long for ID
});

export type InsertMessage = z.infer<typeof insertMessageSchema>;

export const userSchema = z.object({
    id: z.number(), // Backend uses Long
    username: z.string(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    profileImageUrl: z.string().optional(),
    password: z.string().optional(), // Only for registration, handled via separate types usually but good to have in base for now
});

export type User = z.infer<typeof userSchema>;

export const messageSchema = z.object({
    id: z.number(),
    content: z.string(),
    senderId: z.number(),
    createdAt: z.string().or(z.date()).optional(),
});

export type Message = z.infer<typeof messageSchema>;

export type MessageWithSender = Message & {
    sender: User;
};
