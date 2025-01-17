// Importing necessary modules and functions from "react-router" and other libraries
import { data, Form, Link, redirect, useNavigation } from "react-router";
import { createClient } from "supabase.server"; // Initializes the Supabase client
import { validateEmail, validatePassword } from "~/validation"; // Utility functions for validating email and password
import { commitSession, getSession, setSuccessMessage } from "~/session.server"; // Session management functions
import type { Route } from "./+types/login"; // Type definition for Route.ActionArgs

// This function handles the form submission logic
export async function action({ request }: Route.ActionArgs) {
  // Creating a Supabase client and retrieving headers from the incoming request
  let { supabase, headers } = createClient(request);

  // Retrieving form data (email and password) from the POST request
  let formData = await request.formData();
  let email = String(formData.get("email")); // Casting email to a string
  let password = String(formData.get("password")); // Casting password to a string

  // Retrieving the current session from the request cookies
  let session = await getSession(request.headers.get("Cookie"));

  // Validating the email and password using helper functions
  let fieldErrors = {
    email: validateEmail(email), // Checks if email is valid
    password: validatePassword(password), // Checks if password meets requirements
  };

  // If any validation errors exist, return a response with error details
  if (Object.values(fieldErrors).some(Boolean)) {
    return data(
      { fieldErrors },
      {
        status: 400, // Bad Request HTTP status
        statusText: "Bad Request :(",
      }
    );
  }

  // Attempting to authenticate the user with Supabase using email and password
  let { data: userData, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  // If an error occurs during authentication, throw the error
  if (error) {
    throw error;
  }

  // Debugging: Log user data to the console
  console.log({ userData });

  // If authentication is successful, retrieve the user's email
  let userEmail = userData.user?.email;

  // If the user's email exists, set a success message in the session
  if (userEmail) {
    setSuccessMessage(session, "logged in successfully");
  }

  // Combine headers and set the updated session cookie
  let allHeaders = {
    ...Object.fromEntries(headers.entries()),
    "Set-Cookie": await commitSession(session),
  };

  // Redirect the user to the dashboard after successful login
  throw redirect("/dashboard", {
    headers: allHeaders,
  });
}

// React component for rendering the Login page
export default function Login({ actionData }: Route.ComponentProps) {
  // Retrieve navigation state to handle form submission status
  let navigation = useNavigation();
  let isSubmitting = navigation.state === "submitting"; // Check if the form is being submitted

  // Render the login form and additional UI
  return (
    <main className="grid lg:grid-cols-2 gap-10 lg:h-screen px-8 lg:max-w-6xl mx-auto">
      <div className="lg:self-center">
        <h1 className="text-4xl font-semibold font-heading"> Login</h1>

        {/* Form for login with method "post" */}
        <Form method="post" className="mt-8 space-y-6">
          <div>
            <label htmlFor="">
              Email{" "}
              {actionData?.fieldErrors.email ? (
                <span className="text-red-600">
                  {actionData.fieldErrors.email}{" "}
                  {/* Displays email validation error */}
                </span>
              ) : null}
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className={`px-4 py-1 rounded-md block  w-full border ${
                actionData?.fieldErrors.email ? "border-red-600" : "" // Adds red border for invalid input
              }`}
            />
          </div>
          <div>
            <label htmlFor="">
              Password{" "}
              {actionData?.fieldErrors.password ? (
                <span className="text-red-600">
                  {actionData.fieldErrors.password}{" "}
                  {/* Displays password validation error */}
                </span>
              ) : null}
            </label>
            <input
              type="password"
              name="password"
              id="password"
              className={`px-4 py-1 rounded-md block  w-full border ${
                actionData?.fieldErrors.password ? "border-red-600" : "" // Adds red border for invalid input
              }`}
            />
          </div>

          {/* Submit button with dynamic text based on submission status */}
          <button
            type="submit"
            className="bg-green-400 hover:bg-green-700 transition ease-in-out duration-500 px-5 py-1 rounded-md active:scale-[.98]"
          >
            {isSubmitting ? "signing up.." : "sign up"}{" "}
            {/* Changes text while submitting */}
          </button>
        </Form>

        {/* Link to the signup page */}
        <Link
          to="/signup"
          className="mt-4 text-gray-400 inline-block hover:underline"
        >
          Dont have an Account? Sign up here
        </Link>
      </div>

      {/* Right section with an image */}
      <div>
        <img
          src="https://i.pinimg.com/736x/f0/1a/e2/f01ae2de78cd7010bd7c7a15fb98e5df.jpg"
          alt="image here"
          className="w-full h-full rounded-lg shadow-black shadow-lg object-cover"
        />
      </div>
    </main>
  );
}
