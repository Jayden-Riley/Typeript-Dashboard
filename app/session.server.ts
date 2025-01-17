// Importing the necessary modules from react-router to manage sessions
import { createCookieSessionStorage, type Session } from "react-router"; // or cloudflare/deno

// Create a session storage using cookies for handling session data
export const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    // Configuration for the cookie that will store session data
    cookie: {
      name: "__session", // The name of the cookie that will hold the session data
      secrets: ["r3m1xr0ck5"], // The secrets used to sign the cookie for security
      sameSite: "lax", // SameSite policy to control cross-site cookie behavior
      path: "/", // The cookie is accessible on all paths of the domain
      httpOnly: true, // Cookie will only be accessible via HTTP(S), not via JavaScript
      secure: true, // Ensure the cookie is sent only over HTTPS connections
      maxAge: 60 * 60 * 24, // The cookie will expire after 24 hours
    },
  });

// Function to set a success message in the session, often used for flash messages
export function setSuccessMessage(session: Session, message: string) {
  // Using the "flash" method to temporarily store a success message with a specific type in the session
  session.flash("toastMessage", { message, type: "success" });
}
