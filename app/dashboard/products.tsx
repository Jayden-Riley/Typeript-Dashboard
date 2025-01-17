import { Link } from "react-router"; // Import Link component for routing to individual product pages
import type { Route } from "./+types/products"; // Import Route type for strong typing of routes
import { getProducts } from "~/models/product"; // Import the function to fetch product data from the model

// Product interface defining the structure of the product data
interface Product {
  _id?: string; // Optional ID of the product
  image: string; // Product image URL
  name: string; // Product name
  description: string; // Description of the product
  price: number; // Price of the product
  quantity: string; // Available quantity of the product
}

// Loader function to fetch the list of products from the database
export async function loader() {
  let result = await getProducts(); // Get products from the model

  // Map through the result and ensure the _id is converted to a string
  let results = result.map((product) => ({
    ...product,
    _id: product._id.toString(), // Convert MongoDB ObjectId to string for easier use in frontend
  }));
  return results; // Return the list of products
}

// ProductCard component for displaying individual product details
let ProductCard: React.FC<Product> = ({
  _id,
  image,
  name,
  description,
  price,
  quantity,
}) => {
  return (
    <div className="p-4 rounded-md shadow-xl shadow-black hover:scale-[1.02] transition ease-in-out duration-500">
      <img
        src={image} // Display product image
        alt={name} // Alt text for the image (helps with SEO and accessibility)
        className="w-full h-48 object-cover rounded-md" // Style for image size and rounding
      />
      <h2 className="text-xl font-bold mt-3">{name}</h2> {/* Product name */}
      <p className="mt-1 text-gray-400">{description}</p>{" "}
      {/* Product description */}
      <div className="flex justify-between mt-4">
        <p className="text-lg font-semibold mt-2 text-gray-200">Ksh {price}</p>{" "}
        {/* Product price */}
        <p className="text-gray-600 mt-1">{quantity}</p>{" "}
        {/* Available quantity */}
      </div>
      {/* Link to product edit page */}
      <Link
        to={_id} // Link to the product detail or edit page using _id
        className="inline-block mt-6 bg-blue-500 text-white py-1 px-7 rounded-md hover:bg-blue-900 transition ease-in-out duration-500"
      >
        Edit
      </Link>
    </div>
  );
};

// Products component to display all products in a grid layout
export default function Products({ loaderData }: Route.ComponentProps) {
  let products = loaderData; // Retrieve the products passed from the loader function

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-5">
      {/* Map through the products and render a ProductCard for each product */}
      {products?.map((product) => (
        <ProductCard
          _id={product._id} // Pass product _id
          key={product._id} // Use product _id as the key for React's reconciliation process
          image={product.image} // Pass product image URL
          name={product.title} // Use product title for the name
          description={product.description} // Pass product description
          price={product.price} // Pass product price
          quantity={product.quantity} // Pass available quantity
        />
      ))}
    </div>
  );
}
