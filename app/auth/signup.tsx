import { data, Form, Link, redirect, useNavigation } from "react-router";
// Import necessary components from React Router.
import { validateEmail, validatePassword } from "~/validation";
// Import validation functions for email and password.
import { commitSession, getSession } from "~/session.server";
// Import session handling functions.
import type { Route } from "./+types/signup";
// Import type for the signup route.
import { addCustomer } from "~/models/product";
// Import function to add a customer to the database.

export async function action({ request }: Route.ActionArgs) {
  // This function handles the signup process when the form is submitted.

  let session = await getSession(request.headers.get("Cookie"));
  // Get the session based on the incoming request's cookie.

  let formData = await request.formData();
  // Retrieve the form data submitted by the user.

  // Extract values from the form.
  let email = String(formData.get("email"));
  let password = String(formData.get("password"));
  let firstName = String(formData.get("firstName"));
  let lastName = String(formData.get("lastName"));
  let phoneNumber = String(formData.get("phoneNumber"));

  // Validate the form fields.
  let fieldError = {
    email: validateEmail(email),
    password: validatePassword(password),
    firstName: validateFirstName(firstName),
    lastName: validateLastName(lastName),
    phoneNumber: validatePhoneNumber(phoneNumber),
  };

  // If there are any errors, return them with a 400 status code.
  if (Object.values(fieldError).some(Boolean)) {
    return {
      fieldError,
      status: 400,
      statusText: "Bad Request",
    };
  }

  // Attempt to add the new user to the database.
  try {
    let newUser = {
      email,
      firstName,
      lastName,
      phoneNumber,
      createdAt: new Date(),
    };

    let result = await addCustomer(newUser);
    // Insert the new user into the database.

    if (!result.acknowledged || !result.insertedId) {
      return {
        fieldError: { general: "Error inserting user data" },
        status: 400,
        statusText: "Bad Request",
      };
    }
  } catch (err) {
    // If there is an error with the database insertion, return a 500 error.
    return {
      fieldError: { general: "Database error: " + (err as Error).message },
      status: 500,
      statusText: "Internal Server Error",
    };
  }

  // Set the session cookie after a successful signup.
  let allHeaders = {
    ...Object.fromEntries(request.headers.entries()),
    "Set-Cookie": await commitSession(session),
  };

  return redirect("/", { headers: allHeaders });
  // Redirect the user to the homepage with updated session headers.
}

export interface ComponentProps {
  actionData?: {
    headers: Headers;
    fieldError?: {
      email?: string;
      password?: string;
      firstName?: string;
      lastName?: string;
      phoneNumber?: string;
    };
  };
}

export default function SignUp({ actionData }: Route.ComponentProps) {
  // The SignUp component handles the form rendering and user input.

  let navigation = useNavigation();
  // Use navigation to manage form submission state (e.g., loading state).
  let isSubmitting = navigation.state === "submitting";
  // Determine if the form is in the submitting state.

  return (
    <main className="grid lg:grid-cols-2 gap-10 lg:h-screen px-8 lg:max-w-6xl mx-auto">
      <div className="lg:self-center">
        <h1 className="text-4xl font-semibold font-heading">Sign Up</h1>
        <Form method="post" className="mt-8 space-y-6">
          {/* Form fields for user input. Each field includes validation feedback if errors occur. */}
          <div>
            <label htmlFor="email">
              Email{" "}
              {actionData?.fieldError?.email && (
                <span className="text-red-600">
                  {actionData.fieldError.email}
                </span>
              )}
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className={`px-4 py-1 rounded-md block w-full border ${
                actionData?.fieldError?.email ? "border-red-600" : ""
              }`}
            />
          </div>
          {/* Other input fields for firstName, lastName, phoneNumber, password */}
          <button
            type="submit"
            className="bg-green-400 hover:bg-green-700 transition ease-in-out duration-500 px-5 py-1 rounded-md active:scale-[.98]"
          >
            {isSubmitting ? "Signing Up..." : "Sign Up"}
            {/* Change the button text when submitting */}
          </button>
        </Form>
        <Link
          to="/login"
          className="mt-4 text-gray-400 inline-block hover:underline"
        >
          Already have an account? Log in here.
        </Link>
      </div>
      <div>
        <img
          src="https://i.pinimg.com/736x/f0/1a/e2/f01ae2de78cd7010bd7c7a15fb98e5df.jpg"
          alt="Sign Up Illustration"
          className="w-full h-full rounded-lg shadow-black shadow-lg object-cover"
        />
      </div>
    </main>
  );
}

// Validation functions for each field.
function validateFirstName(firstName: string) {
  return firstName.trim() === "" ? "First Name is required" : null;
}

function validateLastName(lastName: string) {
  return lastName.trim() === "" ? "Last Name is required" : null;
}

function validatePhoneNumber(phoneNumber: string) {
  return phoneNumber.trim() === "" ? "Phone Number is required" : null;
}
