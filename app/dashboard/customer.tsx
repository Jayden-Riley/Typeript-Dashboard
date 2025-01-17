import { Link } from "react-router";
import type { Route } from "./+types/customer"; // Importing type for route props.
import { getCustomers } from "~/models/product"; // Importing the function to fetch customer data.
import type { ObjectId } from "mongodb"; // Importing ObjectId type for MongoDB compatibility.

// Define the customer data interface
interface Customer {
  _id?: string | ObjectId; // _id is optional, can be a string or ObjectId.
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

// Loader function to fetch customers from the database
export async function loader() {
  let results = await getCustomers(); // Fetching customer data from the database.
  console.log({ results }); // Logging the fetched data for debugging purposes.

  let customers = results.map((result) => ({
    ...result, // Mapping each result to a new object with the same properties.
    _id: result._id.toString(), // Converting ObjectId to string for easier handling in the frontend.
  }));

  return customers; // Returning the processed customer data.
}

// CustomerCard Component: Displays the details of a customer.
function CustomerCard({ customer }: { customer: Customer }) {
  return (
    <div className="p-6 bg-white shadow-black rounded-lg border shadow-xl">
      <h2 className="text-2xl font-bold border-b pb-4 mb-4 text-pink-600">
        Customer Details
      </h2>
      <div className="space-y-4 text-gray-700">
        <p>
          <span className="font-bold text-lg">Email:</span> {customer.email}
        </p>
        <p>
          <span className="font-bold text-lg">First Name:</span>{" "}
          {customer.firstName}
        </p>
        <p>
          <span className="font-bold text-lg">Last Name:</span>{" "}
          {customer.lastName}
        </p>
        <p>
          <span className="font-bold text-lg">Phone:</span>{" "}
          {customer.phoneNumber}
        </p>
      </div>
      {/* Edit button which links to the customer's details page */}
      <Link
        to={customer._id} // Using the _id as the link to customer details (ensure that _id is unique).
        className="inline-block mt-6 bg-blue-500 text-white py-1 px-7 rounded-md hover:bg-blue-900 transition ease-in-out duration-500"
      >
        Edit
      </Link>
    </div>
  );
}

// Customers Component: Displays the list of customers by mapping over the customer data.
export default function Customers({ loaderData }: Route.ComponentProps) {
  let customers = loaderData; // Destructuring the loaderData to get the customers.

  console.log({ customers }); // Logging the list of customers for debugging.

  // Return a message if no customers are found.
  if (!customers || customers.length === 0) {
    return <div className="text-center mt-10">No customers found.</div>;
  }

  // Return the grid of customers with the 'CustomerCard' for each customer.
  return (
    <div className="grid-cols-3 grid">
      {customers.map((customer) => (
        <div key={customer.email} className="p-4 border-3 border-green-700">
          {/* Wrap each customer in a link to their respective details page */}
          <Link to={`/customers/${customer.email}`}>
            <CustomerCard customer={customer} />
          </Link>
        </div>
      ))}
    </div>
  );
}
