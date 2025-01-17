import { ObjectId } from "mongodb"; // Import ObjectId class from MongoDB to handle unique document IDs
import { client } from "~/mongoClient.server"; // Import the MongoDB client for database connection

// Define the structure of a Product object in the database
interface Product {
  _id: ObjectId; // Unique identifier for the product
  image: string; // Image URL of the product
  title: string; // Product name/title
  description: string; // Detailed description of the product
  price: number; // Price of the product
  quantity: string; // Available quantity of the product
}

// Define the structure of a Customer object in the database
interface Customer {
  _id: ObjectId; // Unique identifier for the customer
  email: string; // Customer's email address
  firstName: string; // Customer's first name
  lastName: string; // Customer's last name
  phoneNumber: string; // Customer's phone number
}

// Connect to MongoDB and get the "dashboard" database and "products" collection.
let database = client.db("dashboard"); // Access the "dashboard" database
let productsCollection = database.collection<Product>("products"); // Get the "products" collection from the database
let customersCollection = database.collection<Customer>("customers"); // Get the "customers" collection

// Get all products from the "products" collection
export async function getProducts(): Promise<Product[]> {
  return productsCollection.find().toArray(); // Retrieve all products and return them as an array
}

// Get a single product by its ID from the "products" collection
export async function getProductById(id: string): Promise<Product> {
  return productsCollection.findOne({ _id: new ObjectId(id) }); // Search for the product by ID and return it
}

// Update a product in the "products" collection
export async function updateProduct(id: string, data: any) {
  return productsCollection.updateOne(
    // Update a single product by its ID
    { _id: new ObjectId(id) }, // Find the product by its unique ObjectId
    { $set: data } // Update the product with the new data passed in the 'data' object
  );
}

// Delete a product from the "products" collection
export async function deleteProduct(id: string) {
  return productsCollection.deleteOne({ _id: new ObjectId(id) }); // Delete the product by its ObjectId
}

// Add a new customer to the "customers" collection
export async function addCustomer(data: any) {
  return customersCollection.insertOne(data); // Insert the new customer data into the "customers" collection
}

// Get all customers from the "customers" collection
export async function getCustomers(): Promise<Customer[]> {
  return customersCollection.find().toArray(); // Retrieve all customers and return them as an array
}

// Get a customer by their ID from the "customers" collection
export async function getCustomerById(id: string) {
  return customersCollection.findOne({ _id: new ObjectId(id) }); // Find the customer by their unique ObjectId
}

// Update customer data in the "customers" collection
export async function updateCustomer(id: string, data: any) {
  return customersCollection.updateOne(
    // Update a single customer by their ID
    { _id: new ObjectId(id) }, // Find the customer by their unique ObjectId
    { $set: data } // Update the customer with the new data passed in the 'data' object
  );
}

// Delete a customer from the "customers" collection
export async function deleteCustomer(id: string) {
  return customersCollection.deleteOne({ _id: new ObjectId(id) }); // Delete the customer by their ObjectId
}
