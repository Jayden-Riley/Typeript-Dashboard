import { data, Form, Link, redirect, useNavigation } from "react-router";

import { createClient } from "~/supabase.server";
import { validateEmail, validatePassword } from "~/validation";
import { commitSession, getSession, setSuccessMessage } from "~/session.server";
import type { Route } from "./+types/login";
export async function action({ request }: Route.ActionArgs) {
  let { supabase, headers } = createClient(request);
  let formData = await request.formData();
  let email = String(formData.get("email"));
  let password = String(formData.get("password"));

  let session = await getSession(request.headers.get("Cookie"));

  let fieldErrors = {
    email: validateEmail(email),
    password: validatePassword(password),
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return data(
      { fieldErrors },
      {
        status: 400,
        statusText: "Bad Request :(",
      }
    );
  }
  let { data: userData, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    throw error;
  }
  console.log({ userData });
  let userEmail = userData.user?.email;

  if (userEmail) {
    setSuccessMessage(session, "logged in succesfully");
  }
  let allHeaders = {
    ...Object.fromEntries(headers.entries()),
    "Set-Cookie": await commitSession(session),
  };
  throw redirect("/dashboard", {
    headers: allHeaders,
  });
}
export default function Login({ actionData }: Route.ComponentProps) {
  let navigation = useNavigation();
  let isSubmitting = navigation.state === "submitting";

  // let fieldErrors;
  // if (typeof actionData === "object") {
  //   fieldErrors = actionData?.fieldErrors;
  // }
  return (
    <main className="grid lg:grid-cols-2 gap-10 lg:h-screen px-8 lg:max-w-6xl mx-auto">
      <div className="lg:self-center">
        <h1 className="text-4xl font-semibold font-heading"> Login</h1>
        <Form method="post" className="mt-8 space-y-6">
          <div>
            <label htmlFor="">
              Email{" "}
              {actionData?.fieldErrors.email ? (
                <span className="text-red-600">
                  {actionData.fieldErrors.email}
                </span>
              ) : null}
            </label>
            <input
              type="email"
              name="email"
              id="email"
              // autoComplete="off"
              className={`px-4 py-1 rounded-md block  w-full border ${
                actionData?.fieldErrors.email ? "border-red-600" : ""
              }`}
            />
          </div>
          <div>
            <label htmlFor="">
              Password{" "}
              {actionData?.fieldErrors.password ? (
                <span className="text-red-600">
                  {actionData.fieldErrors.password}
                </span>
              ) : null}
            </label>
            <input
              type="password"
              name="password"
              id="password"
              // autoComplete="off"
              className={`px-4 py-1 rounded-md block  w-full border ${
                actionData?.fieldErrors.password ? "border-red-600" : ""
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
          to="/signup"
          className="mt-4 text-gray-400 inline-block hover:underline"
        >
          Dont have an Account? Sign up here
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
