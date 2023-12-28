import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type NextApiRequest, type GetServerSidePropsContext, type NextApiResponse } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
  type DefaultUser,
  type User,
} from "next-auth";
import { type DefaultJWT } from "next-auth/jwt";
import DiscordProvider from "next-auth/providers/discord";
import GithubProvider from "next-auth/providers/github";
import { env } from "@/env.mjs";
import prisma from "@/lib/prisma";
import { type Site } from "@prisma/client";

const VERCEL_DEPLOYMENT = !!process.env.VERCEL_URL;

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    // ...other properties
    // role: UserRole;
    // emailVerified: boolean | Date | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    user: User;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  debug: false,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.user = user;
      }
      return token;
    },
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.sub,
      },
    }),
  },
  providers: [
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_AUTH_ID as string,
      clientSecret: process.env.GITHUB_AUTH_SECRET as string,
      profile(profile) {
        return {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          id: profile.id as string,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          name: profile.name as string || profile.login as string,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          email: profile.email as string,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          image: profile.avatar_url as string,
        };
      }
    }),
  ],
  // pages: {
  //   signIn: `/login`,
  //   verifyRequest: `/login`,
  //   error: "/login", // Error code passed in query string as ?error=
  // },
  cookies: {
    sessionToken: {
      name: `${VERCEL_DEPLOYMENT ? "__Secure-" : ""}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        // When working on localhost, the cookie domain must be omitted entirely (https://stackoverflow.com/a/1188145)
        domain: VERCEL_DEPLOYMENT
          ? `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
          : undefined,
        secure: VERCEL_DEPLOYMENT,
      },
    },
    state: {
      name: `${VERCEL_DEPLOYMENT ? "__Secure-" : ""}next-auth.state`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        // When working on localhost, the cookie domain must be omitted entirely (https://stackoverflow.com/a/1188145)
        domain: VERCEL_DEPLOYMENT
          ? `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
          : undefined,
        secure: VERCEL_DEPLOYMENT,
      },
    },
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
// Use it in server contexts
export function getServerAuthSession(...args: [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]] | [NextApiRequest, NextApiResponse] | []) {
  return getServerSession(...args, authOptions)
}

export type WithSiteAuthProps = (
  formData: FormData | null,
  site: Site,
  key: string | null,
) => Promise<{
  error?: string;
}>;

export function withSiteAuth(action: WithSiteAuthProps) {
  return async (
    formData: FormData | null,
    siteId: string,
    key: string | null,
  ) => {
    const session = await getServerSession(authOptions);
    if (!session) {
      return {
        error: "Not authenticated",
      };
    }
    const site = await prisma.site.findUnique({
      where: {
        id: siteId,
      },
    });
    
    if (!site || site.userId !== session.user.id) {
      return {
        error: "Not authorized",
      };
    }

    return action(formData, site, key);
  };
}
