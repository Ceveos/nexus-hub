import { relations } from "drizzle-orm";
import { pgTable, uniqueIndex, pgEnum, text, timestamp, index, integer, primaryKey, jsonb } from "drizzle-orm/pg-core"

export const game = pgEnum("Game", ['MINECRAFT', 'RUST', 'GARRYS_MOD'])
export const role = pgEnum("Role", ['MEMBER', 'MODERATOR', 'ADMIN'])


export const domains = pgTable("Domain", {
	id: text("id").primaryKey().notNull(),
	domain: text("domain").notNull(),
	createdAt: timestamp("createdAt", { precision: 3, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updatedAt", { precision: 3, mode: 'string' }).notNull(),
},
(table) => {
	return {
		domainKey: uniqueIndex("Domain_domain_key").on(table.domain),
	}
});

export const domainsRelations = relations(domains, ({ many }) => ({
  community: many(communities),
}));

export type Domain = typeof domains.$inferSelect; // return type when queried
export type NewDomain = typeof domains.$inferInsert; // insert type

export const communities = pgTable("Community", {
	id: text("id").primaryKey().notNull(),
	secretId: text("secretId").notNull(),
	name: text("name").notNull(),
	description: text("description").default('Powered by Nexus Hub'),
	logo: text("logo").default('https://public.blob.vercel-storage.com/eEZHAoPTOBSYGBE3/JRajRyC-PhBHEinQkupt02jqfKacBVHLWJq7Iy.png'),
	subdomain: text("subdomain").notNull(),
	customDomain: text("customDomain"),
	avatarClass: text("avatarClass").default('bg-blue-100 text-blue-900').notNull(),
	ownerId: text("ownerId").notNull().references(() => users.id, { onDelete: "restrict", onUpdate: "cascade" } ),
	createdAt: timestamp("createdAt", { precision: 3, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updatedAt", { precision: 3, mode: 'string' }).notNull(),
	domainId: text("domainId").references(() => domains.id, { onDelete: "set null", onUpdate: "cascade" } ),
},
(table) => {
	return {
		secretIdKey: uniqueIndex("Community_secretId_key").on(table.secretId),
		subdomainKey: uniqueIndex("Community_subdomain_key").on(table.subdomain),
		customDomainKey: uniqueIndex("Community_customDomain_key").on(table.customDomain),
	}
});

export const communitiesRelations = relations(communities, ({ one, many }) => ({
	domain: one(domains, { fields: [communities.domainId], references: [domains.id]}),
	owner: one(users, { fields: [communities.ownerId], references: [users.id]}),
  members: many(userCommunityMaps),
	servers: many(servers),
	communityData: many(communityData),
}));

export type Community = typeof communities.$inferSelect; // return type when queried
export type NewCommunity = typeof communities.$inferInsert; // insert type

export const accounts = pgTable("Account", {
	id: text("id").primaryKey().notNull(),
	userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	type: text("type").notNull(),
	provider: text("provider").notNull(),
	providerAccountId: text("providerAccountId").notNull(),
	refreshToken: text("refresh_token"),
	refreshTokenExpiresIn: integer("refresh_token_expires_in"),
	accessToken: text("access_token"),
	expiresAt: integer("expires_at"),
	tokenType: text("token_type"),
	scope: text("scope"),
	idToken: text("id_token"),
	sessionState: text("session_state"),
},
(table) => {
	return {
		userIdIdx: index("Account_userId_idx").on(table.userId),
		providerProviderAccountIdKey: uniqueIndex("Account_provider_providerAccountId_key").on(table.provider, table.providerAccountId),
	}
});

export const accountsRelations = relations(accounts, ({ one }) => ({
	user: one(users, { fields: [accounts.userId], references: [users.id]}),
}));

export type Account = typeof accounts.$inferSelect; // return type when queried
export type NewAccount = typeof accounts.$inferInsert; // insert type

export const sessions = pgTable("Session", {
	id: text("id").primaryKey().notNull(),
	sessionToken: text("sessionToken").notNull(),
	userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	expires: timestamp("expires", { precision: 3, mode: 'string' }).notNull(),
},
(table) => {
	return {
		sessionTokenKey: uniqueIndex("Session_sessionToken_key").on(table.sessionToken),
		userIdIdx: index("Session_userId_idx").on(table.userId),
	}
});

export const sessionsRelations = relations(sessions, ({ one }) => ({
	user: one(users, { fields: [sessions.userId], references: [users.id]}),
}));

export type Session = typeof sessions.$inferSelect; // return type when queried
export type NewSession = typeof sessions.$inferInsert; // insert type

export const verificationTokens = pgTable("VerificationToken", {
	identifier: text("identifier").notNull(),
	token: text("token").notNull(),
	expires: timestamp("expires", { precision: 3, mode: 'string' }).notNull(),
},
(table) => {
	return {
		tokenKey: uniqueIndex("VerificationToken_token_key").on(table.token),
		identifierTokenKey: uniqueIndex("VerificationToken_identifier_token_key").on(table.identifier, table.token),
	}
});

export type VerificationToken = typeof verificationTokens.$inferSelect; // return type when queried
export type NewVerificationToken = typeof verificationTokens.$inferInsert; // insert type

export const users = pgTable("User", {
	id: text("id").primaryKey().notNull(),
	name: text("name"),
	email: text("email"),
	emailVerified: timestamp("emailVerified", { precision: 3, mode: 'string' }),
	image: text("image"),
},
(table) => {
	return {
		emailKey: uniqueIndex("User_email_key").on(table.email),
	}
});

export const usersRelations = relations(users, ({ many }) => ({
	accounts: many(accounts),
	sessions: many(sessions),
	sites: many(sites),
	ownedCommunities: many(communities),
	memberOfCommunities: many(userCommunityMaps),
}));

export type User = typeof users.$inferSelect; // return type when queried
export type NewUser = typeof users.$inferInsert; // insert type

export const servers = pgTable("Server", {
	id: text("id").primaryKey().notNull(),
	name: text("name").notNull(),
	game: game("game").notNull(),
	communityId: text("communityId").notNull().references(() => communities.id, { onDelete: "restrict", onUpdate: "cascade" } ),
	createdAt: timestamp("createdAt", { precision: 3, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updatedAt", { precision: 3, mode: 'string' }).notNull(),
	gameMode: text("gameMode").notNull(),
	ip: text("ip").notNull(),
	verifiedAt: timestamp("verifiedAt", { precision: 3, mode: 'string' }),
	port: integer("port"),
},
(table) => {
	return {
		gameIpPortKey: uniqueIndex("Server_game_ip_port_key").on(table.game, table.ip, table.port),
	}
});

export const serversRelations = relations(servers, ({ one, many }) => ({
	community: one(communities, { fields: [servers.communityId], references: [communities.id]}),
	serverData: many(serverData),
}));

export type Server = typeof servers.$inferSelect; // return type when queried
export type NewServer = typeof servers.$inferInsert; // insert type

export const sites = pgTable("Site", {
	id: text("id").primaryKey().notNull(),
	name: text("name"),
	description: text("description"),
	logo: text("logo").default('https://public.blob.vercel-storage.com/eEZHAoPTOBSYGBE3/JRajRyC-PhBHEinQkupt02jqfKacBVHLWJq7Iy.png'),
	font: text("font").default('font-cal').notNull(),
	image: text("image").default('https://public.blob.vercel-storage.com/eEZHAoPTOBSYGBE3/hxfcV5V-eInX3jbVUhjAt1suB7zB88uGd1j20b.png'),
	imageBlurhash: text("imageBlurhash").default('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAhCAYAAACbffiEAAAACXBIWXMAABYlAAAWJQFJUiTwAAABfUlEQVR4nN3XyZLDIAwE0Pz/v3q3r55JDlSBplsIEI49h76k4opexCK/juP4eXjOT149f2Tf9ySPgcjCc7kdpBTgDPKByKK2bTPFEdMO0RDrusJ0wLRBGCIuelmWJAjkgPGDSIQEMBDCfA2CEPM80+Qwl0JkNxBimiaYGOTUlXYI60YoehzHJDEm7kxjV3whOQTD3AaCuhGKHoYhyb+CBMwjIAFz647kTqyapdV4enGINuDJMSScPmijSwjCaHeLcT77C7EC0C1ugaCTi2HYfAZANgj6Z9A8xY5eiYghDMNQBJNCWhASot0jGsSCUiHWZcSGQjaWWCDaGMOWnsCcn2QhVkRuxqqNxMSdUSElCDbp1hbNOsa6Ugxh7xXauF4DyM1m5BLtCylBXgaxvPXVwEoOBjeIFVODtW74oj1yBQah3E8tyz3SkpolKS9Geo9YMD1QJR1Go4oJkgO1pgbNZq0AOUPChyjvh7vlXaQa+X1UXwKxgHokB2XPxbX+AnijwIU4ahazAAAAAElFTkSuQmCC'),
	subdomain: text("subdomain"),
	customDomain: text("customDomain"),
	message404: text("message404").default('Blimey! You\'ve found a page that doesn\'t exist.'),
	createdAt: timestamp("createdAt", { precision: 3, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updatedAt", { precision: 3, mode: 'string' }).notNull(),
	userId: text("userId").references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" } ),
},
(table) => {
	return {
		subdomainKey: uniqueIndex("Site_subdomain_key").on(table.subdomain),
		customDomainKey: uniqueIndex("Site_customDomain_key").on(table.customDomain),
		userIdIdx: index("Site_userId_idx").on(table.userId),
	}
});

export const sitesRelations = relations(sites, ({ one }) => ({
	user: one(users, { fields: [sites.userId], references: [users.id]}),
}));

export type Site = typeof sites.$inferSelect; // return type when queried
export type NewSite = typeof sites.$inferInsert; // insert type

export const userCommunityMaps = pgTable("UserCommunityMap", {
	communityId: text("communityId").notNull().references(() => communities.id, { onDelete: "restrict", onUpdate: "cascade" } ),
	userId: text("userId").notNull().references(() => users.id, { onDelete: "restrict", onUpdate: "cascade" } ),
	role: role("role").notNull(),
},
(table) => {
	return {
		userCommunityMapPkey: primaryKey({ columns: [table.communityId, table.userId], name: "UserCommunityMap_pkey"})
	}
});

export const userCommunityMapsRelations = relations(userCommunityMaps, ({ one }) => ({
	community: one(communities, { fields: [userCommunityMaps.communityId], references: [communities.id]}),
	user: one(users, { fields: [userCommunityMaps.userId], references: [users.id]}),
}));


export type UserCommunityMap = typeof userCommunityMaps.$inferSelect; // return type when queried
export type NewUserCommunityMap = typeof userCommunityMaps.$inferInsert; // insert type

export const serverData = pgTable("ServerData", {
	serverId: text("serverId").notNull().references(() => servers.id, { onDelete: "restrict", onUpdate: "cascade" } ),
	key: text("key").notNull(),
	value: jsonb("value").notNull(),
	createdAt: timestamp("createdAt", { precision: 3, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updatedAt", { precision: 3, mode: 'string' }).notNull(),
},
(table) => {
	return {
		serverDataPkey: primaryKey({ columns: [table.serverId, table.key], name: "ServerData_pkey"})
	}
});

export const serverDataRelations = relations(serverData, ({ one }) => ({
	server: one(servers, { fields: [serverData.serverId], references: [servers.id]}),
}));

export type ServerData = typeof serverData.$inferSelect; // return type when queried
export type NewServerData = typeof serverData.$inferInsert; // insert type

export const communityData = pgTable("CommunityData", {
	communityId: text("communityId").notNull().references(() => communities.id, { onDelete: "restrict", onUpdate: "cascade" } ),
	key: text("key").notNull(),
	value: jsonb("value").notNull(),
	createdAt: timestamp("createdAt", { precision: 3, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updatedAt", { precision: 3, mode: 'string' }).notNull(),
},
(table) => {
	return {
		communityDataPkey: primaryKey({ columns: [table.communityId, table.key], name: "CommunityData_pkey"})
	}
});

export const communityDataRelations = relations(communityData, ({ one }) => ({
	community: one(communities, { fields: [communityData.communityId], references: [communities.id]}),
}));

export type CommunityData = typeof communityData.$inferSelect; // return type when queried
export type NewCommunityData = typeof communityData.$inferInsert; // insert type