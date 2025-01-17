import {
  Form,
  redirect,
  useLoaderData,
  useActionData,
  useNavigate,
  useNavigation,
} from "react-router"; // Importing necessary hooks and components from 'react-router' to handle routing and form submissions
import { deleteProduct, getProductById, updateProduct } from "~/models/product"; // Importing product-related functions (CRUD operations)
import { commitSession, getSession, setSuccessMessage } from "~/session.server"; // Importing session management functions
import type { Route } from "./+types/id"; // Importing types for type-checking route arguments

// Action function for handling form submissions (save or delete product)
export async function action({ params, request }: Route.ActionArgs) {
  let id = params.id;
  if (!id) return new Response("Product ID is required", { status: 400 }); // Ensures product ID is provided in URL parameters

  try {
    let body = await request.formData(); // Parsing the form data from the request
    let title = body.get("name"); // Extracting the title of the product
    let description = body.get("description"); // Extracting product description
    let price = Number(body.get("price")); // Extracting and converting the price to a number
    let quantity = Number(body.get("quantity")); // Extracting and converting quantity to a number
    let image = body.get("image"); // Extracting the product image URL
    let intent = body.get("intent"); // Determining whether the user intends to save or delete the product

    // Validating form inputs
    if (!title || !description || isNaN(price) || price < 0 || quantity < 0) {
      return {
        message: "Please provide valid input values for all fields 😡. ",
      }; // Returns an error message if validation fails
    }

    let session = await getSession(request.headers.get("Cookie")); // Retrieving the session to ensure the user is logged in
    if (!session) return new Response("Unauthorized", { status: 401 }); // Handling unauthorized access

    let product = await getProductById(id); // Fetching the product by ID to ensure it exists
    if (!product) return new Response("Product not found", { status: 404 }); // If the product doesn't exist, return 404

    // Handling different form submission intents (save or delete)
    switch (intent) {
      case "save": {
        let result = await updateProduct(id, {
          title,
          description,
          price,
          quantity,
          image,
        }); // Updating product details
        if (result) {
          setSuccessMessage(session, "Product updated successfully 👍"); // Setting a success message if the product is updated
        }
        break;
      }
      case "delete": {
        let deletedProduct = await deleteProduct(id); // Deleting the product
        if (!deletedProduct) {
          return {
            message: "An error occurred while deleting the product", // Error handling for delete failure
          };
        }
        if (deletedProduct) {
          setSuccessMessage(session, "Product deleted successfully 👍"); // Setting success message for deletion
        }
        break;
      }
    }

    // Redirecting to the products page after successful operation
    return redirect("/dashboard/products", {
      headers: {
        "Set-Cookie": await commitSession(session), // Committing the session changes
      },
    });
  } catch (error) {
    console.error("Error updating product:", error); // Logging any errors that occur
    return {
      message:
        "An error occurred while saving changes. Please try again later.", // Error message for failed operation
    };
  }
}

// Loader function to fetch product data for pre-rendering
export async function loader({ params }: Route.LoaderArgs) {
  let id = params.id as string;
  let product = await getProductById(id); // Fetching the product data

  if (!product) throw new Response("Product not found :(", { status: 404 }); // Handling case where product is not found

  return product; // Returning product data to be used in the component
}

// Product Edit Component
export default function ProductEdit() {
  let product = useLoaderData() as {
    image: string;
    title: string;
    description: string;
    price: number;
    quantity: number;
  }; // Retrieving the product data from the loader

  let errors = useActionData(); // Retrieving any errors from the action function
  let navigation = useNavigation(); // Using the navigation hook to track the form submission state
  let isSubmitting = navigation.state === "submitting"; // Checking if the form is currently being submitted
  let navigate = useNavigate(); // Hook for programmatically navigating between pages

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* Title of the Edit Product page */}
      <h1 className="text-2xl font-bold text-red-500 mb-6 text-center">
        Edit Product
      </h1>

      {/* Displaying error message if any */}
      {errors?.message && (
        <div className="text-red-600 bg-red-100 p-4 rounded-md mb-4">
          {errors.message}
        </div>
      )}

      {/* Form for editing product */}
      <Form method="post" className="space-y-4">
        {/* Product name input */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Product Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            defaultValue={product?.title || ""}
            className="mt-1 block w-full px-3 py-2 text-black bg-white border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* Image URL input */}
        <div>
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700"
          >
            Image URL
          </label>
          <input
            type="text"
            id="image"
            name="image"
            defaultValue={product?.image || ""}
            className="mt-1 block w-full px-3 py-2 text-black bg-white border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* Product description input */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            defaultValue={product?.description || ""}
            className="mt-1 block w-full px-3 py-2 text-black bg-white border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          ></textarea>
        </div>

        {/* Price input */}
        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700"
          >
            Price (Ksh)
          </label>
          <input
            type="number"
            id="price"
            name="price"
            min="0"
            defaultValue={product?.price || ""}
            className="mt-1 block w-full px-3 py-2 text-black bg-white border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* Quantity input */}
        <div>
          <label
            htmlFor="quantity"
            className="block text-sm font-medium text-gray-700"
          >
            Quantity
          </label>
          <input
            type="text"
            id="quantity"
            name="quantity"
            min="0"
            defaultValue={product?.quantity || ""}
            className="mt-1 block w-full px-3 py-2 text-black bg-white border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* Action buttons (Save, Cancel, Delete) */}
        <div className="flex gap-4">
          <button
            type="submit"
            name="intent"
            value="save"
            disabled={isSubmitting}
            className={`w-full py-2 px-4 text-white rounded-md ${
              isSubmitting ? "bg-gray-400" : "hover:bg-green-700 bg-green-500"
            } transition ease-in-out duration-500 active:scale-[.98]`}
          >
            {isSubmitting && navigation.formData?.get("intent") === "save"
              ? "Saving..."
              : "Save Changes"}
          </button>

          {/* Cancel button */}
          <button
            type="button"
            onClick={() => navigate(-1)} // Navigates to the previous page
            className="w-full py-2 px-4 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition ease-in-out duration-500 active:scale-[.98]"
          >
            Cancel
          </button>

          {/* Delete button */}
          <button
            name="intent"
            value="delete"
            className="w-full py-2 px-4 bg-red-500 hover:bg-red-700 text-white rounded-md transition ease-in-out duration-500 active:scale-[.98]"
          >
            {isSubmitting && navigation.formData?.get("intent") === "delete"
              ? "deleting..."
              : "delete"}
          </button>
        </div>
      </Form>
    </div>
  );
}
