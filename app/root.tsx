import {
  data,
  Form,
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router"; // Import necessary components and functions from react-router

import type { Route } from "./+types/root"; // Import Route type for type-checking
import stylesheet from "./app.css?url"; // Import the stylesheet for the app
import { commitSession, getSession } from "./session.server"; // Import session management functions
// import { supabase } from "./supabaseClient"; // Supabase client (commented out)
import { useEffect } from "react"; // Import useEffect hook for handling side effects
import { getUser } from "../supabase.server"; // Function to fetch user from Supabase
import toast, { Toaster } from "react-hot-toast"; // Import toast notification library

// Links function for adding external resources like stylesheets
export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous", // Allow cross-origin access for fonts
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap", // Google Fonts Inter
  },
  { rel: "stylesheet", href: stylesheet }, // External stylesheet imported above
];

// Loader function to fetch session data and user info
export async function loader({ request }: Route.LoaderArgs) {
  // Get session from request headers
  let session = await getSession(request.headers.get("Cookie"));
  let toastMessage = session.get("toastMessage"); // Fetch the toast message from the session

  // Fetch user data from Supabase (assuming the getUser function does this)
  let { user } = await getUser(request);
  let userEmail = user?.email || null; // Extract the user's email if available

  return data(
    { toastMessage, userEmail }, // Return the data needed for rendering
    {
      headers: {
        "Set-Cookie": await commitSession(session), // Commit any session changes to the cookie
      },
    }
  );
}

// Layout component that renders the HTML structure
export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400..900;1,400..900&display=swap"
          rel="stylesheet" // External font stylesheet for Alegreya font
        ></link>
        <Links />
      </head>
      <body>
        {children}
        <Toaster />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

// Main App component that renders the layout and manages side effects
export default function App({ loaderData }: Route.ComponentProps) {
  let { toastMessage, userEmail } = loaderData; // Destructure data returned by the loader

  // useEffect to handle displaying toast notifications when data changes
  useEffect(() => {
    if (!toastMessage) {
      return;
    }
    let { message, type } = toastMessage; // Extract message and type

    // Display toast based on message type
    switch (type) {
      case "success": {
        toast.success(message); // Show success toast
      }
    }
  }, [toastMessage]); // Re-run when toastMessage changes

  return (
    <>
      <header className="flex justify-between items-center py-4 px-6">
        <Link to="/">
          <img
            src="https://i.pinimg.com/736x/dc/95/e1/dc95e1e3c1c9650870a31e74dd19b5ce.jpg"
            alt="Logo"
            className="h-14 w-14 rounded-full"
          />
        </Link>

        {/* Conditional rendering based on whether the user is logged in */}
        {userEmail ? (
          <div className="flex gap-2 place-items-center">
            <Link
              to="/dashboard"
              className="border border-r-orange-700 hover:bg-slate-500 duration-700 hover:text-black rounded-md px-4 py-2 hover:border-transparent"
            >
              Dashboard
            </Link>
            <p className="hidden lg:flex text-gray-200 text-sm">
              {" "}
              Logged in as {userEmail}
            </p>
            <Form method="post" action="/logout">
              <button
                type="submit"
                className="hover:bg-red-800 duration-500 bg-red-500 px-4 py-2 active:scale-[.98] transition ease-in-out rounded-md shadow-lg shadow-black"
              >
                Log Out
              </button>
            </Form>
          </div>
        ) : (
          <Link
            to="/login"
            className="bg-green-600 hover:bg-green-700 transition ease-in-out duration-500 px-4 py-2 rounded-lg text-white"
          ></Link>
        )}
      </header>
      <Outlet /> {/* Render the nested route components here */}
    </>
  );
}

// ErrorBoundary component to handle any errors that occur in the app
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!"; // Default error message
  let details = "An unexpected error occurred."; // Default error details
  let stack: string | undefined; // Stack trace (if available)

  // Handle specific route errors (e.g., 404 Not Found)
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message; // Capture error message in development
    stack = error.stack; // Capture stack trace in development
  }

  // Render the error page with details
  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
