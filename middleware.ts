import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// This function can be marked `async` if using `await` inside
export default async function middleware(request: NextRequest) {
  console.log(`${request.url} triggered middleware`);

  const secret = process.env.NEXTAUTH_SECRET;
  const token = await getToken({ req: request, secret });

  if (!token) {
    return NextResponse.redirect(new URL("/api/auth/signin", request.url));
  }

  if (!token.username) {
    return NextResponse.redirect(new URL("/username", request.url));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/api/UpsertFlashcard(.*)",
    "/api/UpsertTopic(.*)",
    "/api/Delete(.*)",
  ],
};
