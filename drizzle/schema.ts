import { index, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/** Authenticated Manus OAuth users and application roles. */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const vehicles = mysqlTable("vehicles", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 140 }).notNull().unique(),
  brand: varchar("brand", { length: 80 }).notNull(),
  model: varchar("model", { length: 120 }).notNull(),
  year: int("year").notNull(),
  priceDh: int("priceDh").notNull(),
  mileageKm: int("mileageKm").notNull(),
  fuel: varchar("fuel", { length: 40 }).notNull(),
  transmission: varchar("transmission", { length: 40 }).notNull(),
  powerCv: int("powerCv"),
  category: varchar("category", { length: 60 }).notNull(),
  description: text("description").notNull(),
  equipment: text("equipment").notNull(),
  images: text("images").notNull(),
  availability: mysqlEnum("availability", ["available", "reserved", "sold"]).default("available").notNull(),
  published: int("published").default(0).notNull(),
  featured: int("featured").default(0).notNull(),
  warrantyNote: varchar("warrantyNote", { length: 300 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => ({
  publicInventory: index("vehicles_public_inventory_idx").on(table.published, table.availability),
}));

export const blogPosts = mysqlTable("blog_posts", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 180 }).notNull().unique(),
  title: varchar("title", { length: 220 }).notNull(),
  category: varchar("category", { length: 80 }).notNull(),
  excerpt: text("excerpt").notNull(),
  body: text("body").notNull(),
  imageUrl: text("imageUrl").notNull(),
  author: varchar("author", { length: 120 }),
  readingMinutes: int("readingMinutes").default(5).notNull(),
  sourceDate: varchar("sourceDate", { length: 40 }),
  status: mysqlEnum("status", ["draft", "published"]).default("draft").notNull(),
  reviewNotes: text("reviewNotes"),
  publishedAt: timestamp("publishedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => ({
  publicBlog: index("blog_posts_status_published_idx").on(table.status, table.publishedAt),
}));

export const leads = mysqlTable("leads", {
  id: int("id").autoincrement().primaryKey(),
  type: mysqlEnum("type", ["contact", "financing", "trade_in", "appointment"]).notNull(),
  name: varchar("name", { length: 160 }).notNull(),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 50 }).notNull(),
  vehicleSlug: varchar("vehicleSlug", { length: 140 }),
  message: text("message"),
  details: text("details").notNull(),
  photoUrls: text("photoUrls").notNull(),
  status: mysqlEnum("status", ["new", "in_progress", "completed"]).default("new").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => ({
  inbox: index("leads_status_created_idx").on(table.status, table.createdAt),
}));

export const siteSettings = mysqlTable("site_settings", {
  key: varchar("key", { length: 100 }).primaryKey(),
  value: text("value").notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Vehicle = typeof vehicles.$inferSelect;
export type BlogPost = typeof blogPosts.$inferSelect;
export type Lead = typeof leads.$inferSelect;
