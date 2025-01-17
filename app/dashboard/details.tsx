import {
  deleteCustomer,
  getCustomerById,
  updateCustomer,
} from "~/models/product"; // Import functions for interacting with the customer data.
import type { Route } from "./+types/details"; // Import the Route type for proper type-checking.
import {
  Form,
  redirect,
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "react-router"; // Import necessary hooks and components for handling form actions and routing.
import { commitSession, getSession, setSuccessMessage } from "~/session.server"; // Import session-related functions.

export async function action({ params, request }: Route.ActionArgs) {
  const session = await getSession(request.headers.get("Cookie")); // Fetch the session from the request.
  if (!session) return new Response("Unauthorized", { status: 401 }); // If session is not found, return unauthorized error.

  const customer = await getCustomerById(params.id); // Retrieve the customer by ID from the database.
  if (!customer) throw new Response("Customer not found :(", { status: 404 }); // If customer is not found, return a 404 error.

  try {
    const body = await request.formData(); // Parse form data sent in the request.
    const email = body.get("email")?.toString().trim(); // Extract email, trim any extra spaces.
    const firstName = body.get("firstName")?.toString().trim(); // Extract first name, trim any extra spaces.
    const lastName = body.get("lastName")?.toString().trim(); // Extract last name, trim any extra spaces.
    const phoneNumber = body.get("phoneNumber")?.toString().trim(); // Extract phone number, trim any extra spaces.
    const intent = body.get("intent"); // Extract the 'intent' which will determine the action (save or delete).

    // Validate inputs for both save and delete actions
    if (
      intent === "save" &&
      (!email || !firstName || !lastName || !phoneNumber)
    ) {
      return { error: "All fields are required." }; // If any required field is missing, return an error.
    }

    if (intent === "save") {
      // Handle save action - update customer details.
      const updatedCustomer = await updateCustomer(params.id, {
        email,
        firstName,
        lastName,
        phoneNumber,
      });

      if (updatedCustomer) {
        setSuccessMessage(session, "Customer updated successfully."); // Set a success message in the session.
      }
    } else if (intent === "delete") {
      // Handle delete action - delete customer by ID.
      const deletedCustomer = await deleteCustomer(params.id);

      if (deletedCustomer) {
        setSuccessMessage(session, "Customer deleted successfully."); // Set a success message if deletion is successful.
      } else {
        return { error: "Failed to delete the customer." }; // If deletion fails, return an error.
      }
    }

    // Redirect with success message after action.
    return redirect("/dashboard/customer", {
      headers: {
        "Set-Cookie": await commitSession(session), // Commit the session with success message.
      },
    });
  } catch (error) {
    console.error("Error processing customer action:", error);
    return { error: "An error occurred. Please try again later." }; // Return error if something goes wrong.
  }
}

export async function loader({ params }: Route.LoaderArgs) {
  const customer = await getCustomerById(params.id); // Load the customer data by ID.

  if (!customer) throw new Response("Customer not found :(", { status: 404 }); // Return 404 if customer is not found.

  return customer; // Return the customer data for rendering the form.
}

export default function EditCustomer() {
  const customer = useLoaderData(); // Use the loader data (customer data) to pre-fill the form.
  const actionData = useActionData(); // Get any action data (errors or success messages).
  const navigation = useNavigation(); // Get the navigation state (if the form is submitting).
  const navigate = useNavigate(); // Hook to navigate programmatically.

  const isSubmitting = navigation.state === "submitting"; // Check if the form is currently being submitted.
  const intent = navigation.formData?.get("intent"); // Get the form intent (save or delete action).

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-lg p-8">
        {/* Header */}
        <h1 className="text-3xl font-extrabold text-pink-600 text-center mb-6 ">
          Edit Customer
        </h1>

        {/* Error Message */}
        {actionData?.error && (
          <div className="text-red-700 bg-red-100 border border-red-300 rounded-md p-4 mb-6 text-sm">
            {actionData.error}
          </div>
        )}

        {/* Form */}
        <Form method="post" className="space-y-6">
          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-600"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              defaultValue={customer?.email || ""}
              className="w-full mt-2 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter email address"
            />
          </div>

          {/* First Name Input */}
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-semibold text-gray-600"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              defaultValue={customer?.firstName || ""}
              className="w-full mt-2 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter first name"
            />
          </div>

          {/* Last Name Input */}
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-semibold text-gray-600"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              defaultValue={customer?.lastName || ""}
              className="w-full mt-2 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter last name"
            />
          </div>

          {/* Phone Number Input */}
          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-semibold text-gray-600"
            >
              Phone
            </label>
            <input
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              defaultValue={customer?.phoneNumber || ""}
              className="w-full mt-2 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter phone number"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between mt-8">
            {/* Save Button */}
            <button
              type="submit"
              name="intent"
              value="save"
              disabled={isSubmitting}
              className={`w-1/3 py-3 text-white font-semibold rounded-lg transition ${
                isSubmitting && intent === "save"
                  ? "bg-indigo-300 cursor-not-allowed"
                  : "bg-indigo-500 hover:bg-indigo-600"
              }`}
            >
              {isSubmitting && intent === "save" ? "Saving..." : "Save"}
            </button>

            {/* Cancel Button */}
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-1/3 py-3 text-gray-600 font-semibold rounded-lg border border-gray-300 hover:bg-gray-100 transition"
            >
              Cancel
            </button>

            {/* Delete Button */}
            <button
              type="submit"
              name="intent"
              value="delete"
              disabled={isSubmitting}
              className={`w-1/3 py-3 text-white font-semibold rounded-lg transition ${
                isSubmitting && intent === "delete"
                  ? "bg-red-300 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600"
              }`}
            >
              {isSubmitting && intent === "delete" ? "Deleting..." : "Delete"}
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
