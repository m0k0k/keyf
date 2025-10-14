import { type InferSelectModel, type InferInsertModel } from "drizzle-orm";

import {
  integer,
  text,
  boolean,
  pgTable,
  uuid,
  varchar,
  timestamp,
  jsonb,
  primaryKey,
  json,
  numeric,
  pgEnum,
} from "drizzle-orm/pg-core";

type Caption = {
  text: string;
  startMs: number;
  endMs: number;
  timestampMs: number | null;
  confidence: number | null;
};

export const context = pgTable("Context", {
  id: text("id").primaryKey(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  name: text("name").notNull(),
  instructions: text("instructions"),
  userId: text("userId")
    .notNull()
    .references(() => user.id),
  visibility: varchar("visibility", { enum: ["public", "private"] })
    .notNull()
    .default("private"),
});

export type Context = InferSelectModel<typeof context>;

export const project = pgTable("Project", {
  id: text("id").primaryKey(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  title: text("title").notNull(),
  contextId: text("contextId")
    .notNull()
    .references(() => context.id, { onDelete: "cascade" }),

  userId: text("userId")
    .notNull()
    .references(() => user.id),
  visibility: varchar("visibility", { enum: ["public", "private"] })
    .notNull()
    .default("private"),
  isPinned: boolean("isPinned").notNull().default(false),
});

export type Project = InferSelectModel<typeof project>;

export const document = pgTable(
  "Document",
  {
    id: text("id").notNull(),
    createdAt: timestamp("createdAt").notNull(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow(),
    title: text("title").notNull().default("Video Document"),
    state: jsonb("state").notNull(),
    projectId: text("projectId")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),
    userId: text("userId")
      .notNull()
      .references(() => user.id),
    visibility: varchar("visibility", { enum: ["public", "private"] })
      .notNull()
      .default("private"),
    isPinned: boolean("isPinned").notNull().default(false),
  },
  (table) => [primaryKey({ columns: [table.id, table.createdAt] })],
);

export type Document = InferSelectModel<typeof document>;

export const asset = pgTable(
  "Asset",
  {
    id: text("id").notNull(),
    createdAt: timestamp("createdAt").notNull(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow(),
    filename: text("filename").notNull(),
    size: integer("size").notNull(),
    remoteUrl: text("remoteUrl"),
    remoteFileKey: text("remoteFileKey"),
    mimeType: text("mimeType").notNull(),
    type: varchar("type", {
      enum: ["image", "video", "gif", "audio", "caption"],
    }).notNull(),

    // meta trzyma pola specyficzne:
    // image/video/gif: width,height; video/audio/gif: durationInSeconds; video: hasAudioTrack; caption: captions[]
    meta: jsonb("meta")
      .$type<
        | { width: number; height: number } // image
        | {
            width: number;
            height: number;
            durationInSeconds: number;
            hasAudioTrack: boolean;
          } // video
        | { width: number; height: number; durationInSeconds: number } // gif
        | { durationInSeconds: number } // audio
        | { captions: Caption[] } // caption
      >()
      .notNull(),

    documentId: text("documentId"),
    projectId: text("projectId")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),
    userId: text("userId")
      .notNull()
      .references(() => user.id),
    visibility: varchar("visibility", { enum: ["public", "private"] })
      .notNull()
      .default("private"),
    isPinned: boolean("isPinned").notNull().default(false),
  },
  (table) => [primaryKey({ columns: [table.id, table.createdAt] })],
);
export type DBAsset = InferSelectModel<typeof asset>;

export const assetImage = pgTable(
  "AssetImage",
  {
    id: text("id").notNull(),
    createdAt: timestamp("createdAt").notNull(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow(),
    filename: text("filename").notNull(),
    size: integer("size").notNull(),
    remoteUrl: text("remoteUrl"),
    remoteFileKey: text("remoteFileKey"),
    mimeType: text("mimeType").notNull(),
    type: varchar("type", {
      enum: ["image", "video", "gif", "audio", "caption"],
    }).notNull(),

    width: integer("width").notNull(),
    height: integer("height").notNull(),

    documentId: text("documentId"),
    projectId: text("projectId")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),
    userId: text("userId")
      .notNull()
      .references(() => user.id),
    visibility: varchar("visibility", { enum: ["public", "private"] })
      .notNull()
      .default("private"),
    isPinned: boolean("isPinned").notNull().default(false),
  },
  (table) => [primaryKey({ columns: [table.id, table.createdAt] })],
);
export type DBAssetImage = InferSelectModel<typeof assetImage>;

export const chat = pgTable("Chat", {
  id: text("id").primaryKey(),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  title: text("title").notNull(),
  documentId: text("documentId"),
  projectId: text("projectId"),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  visibility: varchar("visibility", { enum: ["public", "private"] })
    .notNull()
    .default("private"),
  isPinned: boolean("isPinned").notNull().default(false),
});

export type Chat = InferSelectModel<typeof chat>;

export const message = pgTable("Message", {
  id: text("id").primaryKey(),
  chatId: text("chatId")
    .notNull()
    .references(() => chat.id, {
      onDelete: "cascade",
    }),
  parentMessageId: text("parentMessageId"),
  documentId: text("documentId"),
  projectId: text("projectId").notNull(),
  role: varchar("role").notNull(),
  parts: json("parts").notNull(),
  attachments: json("attachments").notNull(),
  createdAt: timestamp("createdAt").notNull(),
  annotations: json("annotations"),
  isPartial: boolean("isPartial").notNull().default(false),
  selectedModel: varchar("selectedModel", { length: 256 }).default(""),
  selectedTool: varchar("selectedTool", { length: 256 }).default(""),
  lastContext: json("lastContext"),
});

export type DBMessage = InferSelectModel<typeof message>;

export const run = pgTable("Run", {
  id: text("id").primaryKey(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  userId: text("userId")
    .notNull()
    .references(() => user.id),
  status: varchar("status", {
    enum: ["queued", "running", "completed", "failed"],
  })
    .notNull()
    .default("queued"),
  publicAccessToken: text("publicAccessToken").notNull(),
});

export const user = pgTable("User", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").default("user"),
  credits: integer("credits").notNull().default(0),
  reservedCredits: integer("reservedCredits").notNull().default(0),
  stripeCustomerId: text("stripe_customer_id"),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  banned: boolean("banned").default(false),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires"),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable("Session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("Account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const verification = pgTable("Verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});
