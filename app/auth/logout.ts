import { redirect } from "react-router"; // Import the 'redirect' function to redirect the user.
import type { Route } from "./+types/logout"; // Import the type for the action argument to type-check the request object.
import { commitSession, getSession, setSuccessMessage } from "~/session.server"; // Import session handling functions.
import { createClient } from "supabase.server"; // Import the function to create a Supabase client.

export async function action({ request }: Route.ActionArgs) {
  // Action function for handling user logout. It receives the 'request' from the route handler.

  let { supabase, headers } = createClient(request);
  // Create a Supabase client and extract headers for future use.

  let session = await getSession(request.headers.get("Cookie"));
  // Retrieve the session from the incoming cookie header.

  let { error } = await supabase.auth.signOut();
  // Attempt to sign the user out using the Supabase client.

  if (error) {
    throw error;
    // If there's an error during logout, throw the error.
  }

  setSuccessMessage(session, "logged out successfully");
  // Set a success message in the session, indicating that the user logged out successfully.

  let allHeaders = {
    ...Object.fromEntries(headers.entries()),
    "Set-Cookie": await commitSession(session),
    // Combine the existing headers with the new 'Set-Cookie' header, committing the session.
  };

  return redirect("/login", { headers: allHeaders });
  // Redirect the user to the login page and include the updated headers (with the session cookie).
}
