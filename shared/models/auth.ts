import { type User } from "../schema";

// Re-export types from schema to maintain compatibility with existing imports
export type { User };

// Define session interface manually since we removed Drizzle
export interface Session {
  sid: string;
  sess: any;
  expire: Date;
}

// We don't export Drizzle tables anymore since the backend is Java.
// If any code was relying on `users` or `sessions` table objects, it will need to be refactored.
// Based on our analysis, the frontend mostly uses `User` type.
