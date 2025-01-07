import { redirect } from "react-router";

import type { Route } from "./+types/logout";
import { commitSession, getSession, setSuccessMessage } from "~/session.server";
import { createClient } from "~/supabase.server";
// import{createClient} from ""

export async function action({ request }: Route.ActionArgs) {
  let { supabase, headers } = createClient(request);

  let session = await getSession(request.headers.get("Cookie"));
  let { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
  setSuccessMessage(session, "logged out succesfully");
  let allHeaders = {
    ...Object.fromEntries(headers.entries()),
    "Set-Cookie": await commitSession(session),
  };

  return redirect("/login", { headers: allHeaders });
}
