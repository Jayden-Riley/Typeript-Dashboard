import { createCookieSessionStorage, type Session } from "react-router"; // or cloudflare/deno

export const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    // a Cookie from `createCookie` or the same CookieOptions to create one
    cookie: {
      name: "__session",
      secrets: ["r3m1xr0ck5"],
      sameSite: "lax",
      path: "/",
      httpOnly: true,
      secure: true, // true for HTTPS only
      maxAge: 60 * 60 * 24,
    },
  });

export function setSuccessMessage(session: Session, message: string) {
  session.flash("toastMessage", { message, type: "success" });
}
