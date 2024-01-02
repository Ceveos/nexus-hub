import { type NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
    "/"
  ],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // Get hostname of request (e.g. demo.nexushub.app, demo.localhost:3000)
  let hostname = req.headers
    .get("host")!;

  // special case for Vercel preview deployment URLs
  if (process.env.VERCEL_URL && hostname.endsWith(process.env.VERCEL_URL)) {
    hostname = `${hostname.split(process.env.VERCEL_URL)[0]}.${
      process.env.NEXT_PUBLIC_ROOT_DOMAIN
    }`;
  }

  const searchParams = req.nextUrl.searchParams.toString();
  // Get the pathname of the request (e.g. /, /about, /blog/first-post)
  const path = `${url.pathname}${
    searchParams.length > 0 ? `?${searchParams}` : ""
  }`;

  // rewrites for app pages
  if (hostname == process.env.NEXT_PUBLIC_ROOT_DOMAIN && path !== "/") {
    const session = await getToken({ req });
    if (!session && url.pathname !== "/login") {
      console.log("URL Path name: ", url.pathname);
      return NextResponse.redirect(new URL(`/login?callbackUrl=${encodeURIComponent(path)}`, req.url));
    } else if (session && path.startsWith("/login")) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    
    return NextResponse.rewrite(
      new URL(`/app${path === "/" ? "" : path}`, req.url),
    );
  }

  // rewrite root application to `/home` folder
  if (
    hostname === process.env.NEXT_PUBLIC_ROOT_DOMAIN && path === "/"
  ) {
    return NextResponse.rewrite(
      new URL(`/home${path === "/" ? "" : path}`, req.url),
    );
  }

  // rewrite everything else to `/[domain]/[slug] dynamic route
  return NextResponse.rewrite(new URL(`/${hostname}${path}`, req.url));
}
