import { data, Form, Link, redirect, useNavigation } from "react-router";

import { validateEmail, validatePassword } from "~/validation";
import { createClient } from "~/supabase.server";
import { commitSession, getSession } from "~/session.server";
import type { Route } from "./+types/signup";
// import { commitSession, getSession } from "~/session.server";

export async function action({ request }: Route.ActionArgs) {
  let session = await getSession(request.headers.get("Cookie"));
  // get form data from request body and validate it
  let formData = await request.formData();
  let email = String(formData.get("email"));
  let password = String(formData.get("password"));

  console.log({ email, password });

  // validation logic here
  let fieldError = {
    email: validateEmail(email),
    password: validatePassword(password),
  };

  // return errors if any
  if (Object.values(fieldError).some(Boolean)) {
    return data(
      { fieldError },
      {
        status: 400,
        statusText: "Bad Request :(",
      }
    );
  }

  // sign up user
  let { supabase, headers } = createClient(request);
  let { data: userData, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    throw error;
  }
  console.log({ userData });

  // return data(
  //   { ok: true },
  //   {
  //     headers: headers,
  //   }
  // );
  let allHeaders = {
    ...Object.fromEntries(headers.entries()),
    "Set-Cookie": await commitSession(session),
  };
  return redirect("/", {
    headers: allHeaders,
  });
}

export default function SignUp({ actionData }: Route.ComponentProps) {
  let navigation = useNavigation();
  let isSubmitting = navigation.state === "submitting";
  return (
    <main className="grid lg:grid-cols-2 gap-10 lg:h-screen px-8 lg:max-w-6xl mx-auto">
      <div className="lg:self-center">
        <h1 className="text-4xl font-semibold font-heading"> signing in</h1>
        <Form method="post" className="mt-8 space-y-6">
          <div>
            <label htmlFor="">
              Email{" "}
              {actionData?.fieldError.email ? (
                <span className="text-red-600">
                  {actionData.fieldError.email}
                </span>
              ) : null}
            </label>
            <input
              type="email"
              name="email"
              id="email"
              // autoComplete="off"
              className={`px-4 py-1 rounded-md block  w-full border ${
                actionData?.fieldError.email ? "border-red-600" : ""
              }`}
            />
          </div>
          <div>
            <label htmlFor="">
              Password{" "}
              {actionData?.fieldError.password ? (
                <span className="text-red-600">
                  {actionData.fieldError.password}
                </span>
              ) : null}
            </label>
            <input
              type="password"
              name="password"
              id="password"
              // autoComplete="off"
              className={`px-4 py-1 rounded-md block  w-full border ${
                actionData?.fieldError.password ? "border-red-600" : ""
              }`}
            />
          </div>

          <button
            type="submit"
            className="bg-green-400 hover:bg-green-700 transition ease-in-out duration-500 px-5 py-1 rounded-md active:scale-[.98]"
          >
            {isSubmitting ? "signingup.." : "sign up"}
          </button>
        </Form>
        <Link
          to="/login"
          className="mt-4 text-gray-400 inline-block hover:underline"
        >
          Already have an Account? Login here
        </Link>
      </div>
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
