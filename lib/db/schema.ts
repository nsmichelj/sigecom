import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const genderEnum = pgEnum("gender", [
  "male", // Hombre
  "female", // Mujer
]);

export const educationLevelEnum = pgEnum("education_level", [
  "none", // Sin educación
  "primary", // Primaria
  "secondary", // Secundaria
  "technical", // Técnica
  "university", // Universitaria
  "postgraduate", // Postgrado
]);

export const civilStatusEnum = pgEnum("civil_status", [
  "single", // Soltero
  "married", // Casado
  "divorced", // Divorciado
  "widowed", // Viudo
]);

export const housingStatusEnum = pgEnum("housing_status", [
  "owned", // Propia
  "rented", // Alquilado
  "shared", // Arrimado / Compartida
  "custody", // Al cuidado / Comodato
]);

export const relationshipEnum = pgEnum("relationship", [
  "headOfFamily", // Jefe de Familia
  "spouse", // Cónyuge
  "child", // Hijo/a
  "parent", // Padre/Madre
  "sibling", // Hermano/a
  "other", // Otro
]);

export const committeeRoleEnum = pgEnum("committee_role", [
  "main", // Principal
  "substitute", // Suplente
]);

export const businessCategoryEnum = pgEnum("business_category", [
  "food", // Alimentos y Bebidas
  "services", // Servicios Generales
  "commerce", // Comercio y Ventas
  "crafts", // Artesanía y Manualidades
  "health", // Salud y Bienestar
  "education", // Educación y Formación
  "technology", // Tecnología
  "beauty", // Belleza y Cuidado Personal
  "other", // Otro
]);

export const user = pgTable("user", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  username: text("username").unique(),
  displayUsername: text("display_username"),
  role: text("role"),
  banned: boolean("banned").default(false),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires"),
});

export const session = pgTable(
  "session",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    impersonatedBy: text("impersonated_by"),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: uuid("user_id")
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
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const sectors = pgTable("sectors", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const houses = pgTable("houses", {
  id: uuid("id").defaultRandom().primaryKey(),
  number: integer("number").default(0).notNull(),
  sectorId: uuid("sector_id")
    .notNull()
    .references(() => sectors.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const family = pgTable("family", {
  id: uuid("id").defaultRandom().primaryKey(),
  houseId: uuid("house_id")
    .notNull()
    .references(() => houses.id, { onDelete: "cascade" }),
  housingStatus: housingStatusEnum("housing_status").default("owned").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const familyMembers = pgTable("family_members", {
  id: uuid("id").defaultRandom().primaryKey(),
  familyId: uuid("family_id")
    .notNull()
    .references(() => family.id, { onDelete: "cascade" }),
  residentId: uuid("resident_id")
    .notNull()
    .references(() => residents.id, { onDelete: "cascade" }),
  relationship: varchar("relationship", { length: 100 }).notNull(),
  isHeadOfFamily: boolean("is_head_of_family").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const residents = pgTable("residents", {
  id: uuid("id").defaultRandom().primaryKey(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  cedula: varchar("cedula", { length: 100 }).notNull(),
  dateOfBirth: timestamp("date_of_birth").notNull(),
  gender: genderEnum("gender").default("male").notNull(),
  educationLevel: educationLevelEnum("education_level")
    .default("none")
    .notNull(),
  civilStatus: civilStatusEnum("civil_status").default("single").notNull(),
  isWorking: boolean("is_working").default(false).notNull(),
  occupation: varchar("occupation", { length: 100 }),
  serialCarnet: varchar("serial_carnet", { length: 100 }),
  codeCarnet: varchar("code_carnet", { length: 100 }),
  email: varchar("email", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 100 }).notNull(),
  hasDisability: boolean("has_disability").default(false).notNull(),
  isPregnant: boolean("is_pregnant").default(false).notNull(),
  isStudying: boolean("is_studying").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const committees = pgTable("committees", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const committeeMembers = pgTable("committee_members", {
  id: uuid("id").defaultRandom().primaryKey(),
  committeeId: uuid("committee_id")
    .notNull()
    .references(() => committees.id, { onDelete: "cascade" }),
  residentId: uuid("resident_id")
    .notNull()
    .references(() => residents.id, { onDelete: "cascade" }),
  role: committeeRoleEnum("role").default("main").notNull(),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const businesses = pgTable("businesses", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 150 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  category: businessCategoryEnum("category").default("other").notNull(),
  ownerId: uuid("owner_id").references(() => residents.id, {
    onDelete: "set null",
  }),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 100 }),
  address: varchar("address", { length: 255 }),
  coverImage: text("cover_image"),
  schedule: text("schedule"),
  isLegalEntity: boolean("is_legal_entity").default(false).notNull(),
  rif: varchar("rif", { length: 20 }),
  isPublished: boolean("is_published").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const committeeMembersRelations = relations(
  committeeMembers,
  ({ one }) => ({
    committee: one(committees, {
      fields: [committeeMembers.committeeId],
      references: [committees.id],
    }),
    resident: one(residents, {
      fields: [committeeMembers.residentId],
      references: [residents.id],
    }),
  }),
);

export const committeesRelations = relations(committees, ({ many }) => ({
  members: many(committeeMembers),
}));

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  news: many(news),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const sectorsRelations = relations(sectors, ({ many }) => ({
  houses: many(houses),
}));

export const housesRelations = relations(houses, ({ one, many }) => ({
  sector: one(sectors, {
    fields: [houses.sectorId],
    references: [sectors.id],
  }),
  families: many(family),
}));

export const familyRelations = relations(family, ({ one, many }) => ({
  house: one(houses, {
    fields: [family.houseId],
    references: [houses.id],
  }),
  members: many(familyMembers),
}));

export const familyMembersRelations = relations(familyMembers, ({ one }) => ({
  family: one(family, {
    fields: [familyMembers.familyId],
    references: [family.id],
  }),
  resident: one(residents, {
    fields: [familyMembers.residentId],
    references: [residents.id],
  }),
}));

export const residentsRelations = relations(residents, ({ many }) => ({
  familyMemberships: many(familyMembers),
  committeeMemberships: many(committeeMembers),
  businesses: many(businesses),
}));

export const news = pgTable("news", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  coverImage: text("cover_image"),
  authorId: uuid("author_id").references(() => user.id, {
    onDelete: "set null",
  }),
  isPublished: boolean("is_published").default(false).notNull(),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const newsRelations = relations(news, ({ one }) => ({
  author: one(user, {
    fields: [news.authorId],
    references: [user.id],
  }),
}));

export const businessesRelations = relations(businesses, ({ one }) => ({
  owner: one(residents, {
    fields: [businesses.ownerId],
    references: [residents.id],
  }),
}));
