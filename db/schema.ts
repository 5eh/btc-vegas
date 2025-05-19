import { Message } from "ai";
import { InferSelectModel } from "drizzle-orm";
import {
  pgTable,
  varchar,
  timestamp,
  json,
  uuid,
  boolean,
  text,
  date,
  integer,
} from "drizzle-orm/pg-core";

export const user = pgTable("User", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  email: varchar("email", { length: 64 }).notNull(),
  password: varchar("password", { length: 64 }),
});

export type User = InferSelectModel<typeof user>;

export const chat = pgTable("Chat", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  createdAt: timestamp("createdAt").notNull(),
  messages: json("messages").notNull(),
  userId: uuid("userId")
    .notNull()
    .references(() => user.id),
});

export type Chat = Omit<InferSelectModel<typeof chat>, "messages"> & {
  messages: Array<Message>;
};

export const reservation = pgTable("Reservation", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  createdAt: timestamp("createdAt").notNull(),
  details: json("details").notNull(),
  hasCompletedPayment: boolean("hasCompletedPayment").notNull().default(false),
  userId: uuid("userId")
    .notNull()
    .references(() => user.id),
});

export type Reservation = InferSelectModel<typeof reservation>;

// Add the new organizations table
export const organization = pgTable("Organization", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  nickname: text("nickname").notNull(),
  image: text("image").notNull(),
  title: text("title").notNull(),
  mission: text("mission").notNull(),
  tags: json("tags").notNull(), // Array of text stored as JSON
  verified: boolean("verified").notNull().default(false),
  premium: boolean("premium").notNull().default(false),
  bgGradient: varchar("bgGradient", { length: 100 }),
  bitcoinAddress: varchar("bitcoinAddress", { length: 100 }),
  location: varchar("location", { length: 100 }),
  fullContext: text("fullContext"),
  website: text("website"),
  email: text("email"),
  originDate: date("originDate"),
  registrationNumber: varchar("registrationNumber", { length: 100 }),
  president: text("president"),
  founder: text("founder"),
  banner: text("banner"),
  customMessage: text("customMessage"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export type Organization = InferSelectModel<typeof organization>;

// If you want to track association between users and organizations
export const userOrganization = pgTable("UserOrganization", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  userId: uuid("userId")
    .notNull()
    .references(() => user.id),
  organizationId: uuid("organizationId")
    .notNull()
    .references(() => organization.id),
  role: varchar("role", { length: 50 }).notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export type UserOrganization = InferSelectModel<typeof userOrganization>;