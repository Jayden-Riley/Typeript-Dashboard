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
} from "react-router";

import type { Route } from "./+types/root";
import stylesheet from "./app.css?url";
import { commitSession, getSession } from "./session.server";
// import { supabase } from "./supabaseClient";
import { useEffect } from "react";
import { getUser } from "./supabase.server";
import toast, { Toaster } from "react-hot-toast";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  { rel: "stylesheet", href: stylesheet },
];
export async function loader({ request }: Route.LoaderArgs) {
  let session = await getSession(request.headers.get("Cookie"));
  let toastMessage = session.get("toastMessage");

  let { user } = await getUser(request);
  console.log({ user });

  let userEmail = user?.email || null;

  return data(
    { toastMessage, userEmail },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  // let toastMessage = useLoaderData();

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
          rel="stylesheet"
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

export default function App({ loaderData }: Route.ComponentProps) {
  let { toastMessage, userEmail } = loaderData;
  useEffect(() => {
    if (!toastMessage) {
      return;
    }
    let { message, type } = toastMessage;

    switch (type) {
      case "success": {
        toast.success(message);
      }
    }
  }, [toastMessage]);

  return (
    <>
      <header className="flex justify-between items-center py-4 px-6">
        <img
          src="https://i.pinimg.com/736x/ae/e5/4a/aee54ace12387b141dfdbda1870b48bc.jpg"
          alt=""
          className="h-12 w-12 rounded-full"
        />
        {userEmail ? (
          <div className="flex gap-2 place-items-center">
            <Link
              to="/dashboard"
              className="border border-r-orange-700 hover:bg-slate-500 duration-700 hover:text-black rounded-md px-4 py-2 hover:"
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
      <Outlet />
    </>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

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
