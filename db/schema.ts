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

export const organization = pgTable("organizations", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  nickname: text("nickname").notNull(),
  image: text("image").notNull(),
  title: text("title").notNull(),
  mission: text("mission").notNull(),
  tags: json("tags").notNull(),
  verified: boolean("verified").notNull().default(false),
  premium: boolean("premium").notNull().default(false),
  bgGradient: varchar("bggradient", { length: 100 }),
  bitcoinAddress: varchar("bitcoinaddress", { length: 100 }),
  location: varchar("location", { length: 100 }),
  fullContext: text("fullcontext"),
  website: text("website"),
  email: text("email"),
  originDate: date("startdate"),
  registrationNumber: varchar("registrationnumber", { length: 100 }),
  president: text("president"),
  founder: text("founder"),
  banner: text("banner"),
  customMessage: text("custommessage"),
});

export type Organization = InferSelectModel<typeof organization>;
