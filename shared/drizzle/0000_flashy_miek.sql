DO $$ BEGIN
 CREATE TYPE "Game" AS ENUM('MINECRAFT', 'RUST', 'GARRYS_MOD');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "Role" AS ENUM('MEMBER', 'MODERATOR', 'ADMIN');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Account" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" uuid NOT NULL,
	"refresh_token" text,
	"refresh_token_expires_in" integer,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Community" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"secretId" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text DEFAULT 'Powered by Nexus Hub',
	"logo" text DEFAULT 'https://public.blob.vercel-storage.com/eEZHAoPTOBSYGBE3/JRajRyC-PhBHEinQkupt02jqfKacBVHLWJq7Iy.png',
	"subdomain" text NOT NULL,
	"customDomain" text,
	"avatarClass" text DEFAULT 'bg-blue-100 text-blue-900' NOT NULL,
	"ownerId" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL,
	"domainId" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "CommunityData" (
	"communityId" uuid NOT NULL,
	"key" text NOT NULL,
	"value" jsonb NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "CommunityData_pkey" PRIMARY KEY("communityId","key")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Domain" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"domain" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ServerData" (
	"serverId" uuid NOT NULL,
	"key" text NOT NULL,
	"value" jsonb NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "ServerData_pkey" PRIMARY KEY("serverId","key")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Server" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"game" "Game" NOT NULL,
	"communityId" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL,
	"gameMode" text NOT NULL,
	"ip" text NOT NULL,
	"verifiedAt" timestamp,
	"port" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Session" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sessionToken" text NOT NULL,
	"userId" uuid NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Site" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text,
	"description" text,
	"logo" text DEFAULT 'https://public.blob.vercel-storage.com/eEZHAoPTOBSYGBE3/JRajRyC-PhBHEinQkupt02jqfKacBVHLWJq7Iy.png',
	"font" text DEFAULT 'font-cal' NOT NULL,
	"image" text DEFAULT 'https://public.blob.vercel-storage.com/eEZHAoPTOBSYGBE3/hxfcV5V-eInX3jbVUhjAt1suB7zB88uGd1j20b.png',
	"imageBlurhash" text DEFAULT 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAhCAYAAACbffiEAAAACXBIWXMAABYlAAAWJQFJUiTwAAABfUlEQVR4nN3XyZLDIAwE0Pz/v3q3r55JDlSBplsIEI49h76k4opexCK/juP4eXjOT149f2Tf9ySPgcjCc7kdpBTgDPKByKK2bTPFEdMO0RDrusJ0wLRBGCIuelmWJAjkgPGDSIQEMBDCfA2CEPM80+Qwl0JkNxBimiaYGOTUlXYI60YoehzHJDEm7kxjV3whOQTD3AaCuhGKHoYhyb+CBMwjIAFz647kTqyapdV4enGINuDJMSScPmijSwjCaHeLcT77C7EC0C1ugaCTi2HYfAZANgj6Z9A8xY5eiYghDMNQBJNCWhASot0jGsSCUiHWZcSGQjaWWCDaGMOWnsCcn2QhVkRuxqqNxMSdUSElCDbp1hbNOsa6Ugxh7xXauF4DyM1m5BLtCylBXgaxvPXVwEoOBjeIFVODtW74oj1yBQah3E8tyz3SkpolKS9Geo9YMD1QJR1Go4oJkgO1pgbNZq0AOUPChyjvh7vlXaQa+X1UXwKxgHokB2XPxbX+AnijwIU4ahazAAAAAElFTkSuQmCC',
	"subdomain" text,
	"customDomain" text,
	"message404" text DEFAULT 'Blimey! You've found a page that doesn't exist.',
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL,
	"userId" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "UserCommunityMap" (
	"communityId" uuid NOT NULL,
	"userId" uuid NOT NULL,
	"role" "Role" NOT NULL,
	CONSTRAINT "UserCommunityMap_pkey" PRIMARY KEY("communityId","userId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "User" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text,
	"email" text,
	"emailVerified" timestamp,
	"image" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "VerificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "Account_userId_idx" ON "Account" ("userId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Account_provider_providerAccountId_key" ON "Account" ("provider","providerAccountId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Community_secretId_key" ON "Community" ("secretId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Community_subdomain_key" ON "Community" ("subdomain");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Community_customDomain_key" ON "Community" ("customDomain");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Domain_domain_key" ON "Domain" ("domain");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Server_game_ip_port_key" ON "Server" ("game","ip","port");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Session_sessionToken_key" ON "Session" ("sessionToken");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "Session_userId_idx" ON "Session" ("userId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Site_subdomain_key" ON "Site" ("subdomain");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Site_customDomain_key" ON "Site" ("customDomain");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "Site_userId_idx" ON "Site" ("userId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User" ("email");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "VerificationToken_token_key" ON "VerificationToken" ("token");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "VerificationToken_identifier_token_key" ON "VerificationToken" ("identifier","token");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Community" ADD CONSTRAINT "Community_ownerId_User_id_fk" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Community" ADD CONSTRAINT "Community_domainId_Domain_id_fk" FOREIGN KEY ("domainId") REFERENCES "Domain"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "CommunityData" ADD CONSTRAINT "CommunityData_communityId_Community_id_fk" FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ServerData" ADD CONSTRAINT "ServerData_serverId_Server_id_fk" FOREIGN KEY ("serverId") REFERENCES "Server"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Server" ADD CONSTRAINT "Server_communityId_Community_id_fk" FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Site" ADD CONSTRAINT "Site_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "UserCommunityMap" ADD CONSTRAINT "UserCommunityMap_communityId_Community_id_fk" FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "UserCommunityMap" ADD CONSTRAINT "UserCommunityMap_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
