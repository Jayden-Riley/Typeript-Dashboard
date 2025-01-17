import {
  ChartNoAxesColumnIncreasing, // Icon for the Dashboard link
  Cog, // Icon for the Settings link
  PersonStanding, // Icon for the Customer link
  ShoppingBasket, // Icon for the Products link
} from "lucide-react"; // Importing icons from the lucide-react library
import { NavLink, Outlet } from "react-router"; // NavLink for navigation, Outlet for nested routes
import { requireUser } from "supabase.server"; // Authentication function from Supabase
import type { Route } from "./+types/dashboard"; // Importing type for route props

// Loader function that runs before rendering the Dashboard component
export async function loader({ request }: Route.LoaderArgs) {
  await requireUser(request); // Ensures that the user is authenticated before accessing the dashboard
  return null; // Returning null as the loader does not need to return any specific data
}

export default function Dashboard() {
  // Define the list of links for the dashboard sidebar
  let dashboardLinks = [
    {
      text: "Dashboard",
      path: "/dashboard", // Link to the Dashboard page
      icon: <ChartNoAxesColumnIncreasing />, // Icon for the Dashboard link
    },
    {
      path: "/dashboard/products", // Link to the Products page
      text: "Products",
      icon: <ShoppingBasket />, // Icon for the Products link
    },
    {
      path: "/dashboard/customer", // Link to the Customer page
      text: "Customer",
      icon: <PersonStanding />, // Icon for the Customer link
    },
    {
      path: "/dashboard/settings", // Link to the Settings page
      text: "Settings",
      icon: <Cog />, // Icon for the Settings link
    },
  ];

  return (
    <main className="flex">
      {/* Side navigation bar */}
      <nav className="w-96 bg-zinc-600 min-h-screen">
        <ul>
          {/* Loop through dashboardLinks array to generate the navigation items */}
          {dashboardLinks.map((item) => (
            <li className="p-2" key={crypto.randomUUID()}>
              {" "}
              {/* Using crypto.randomUUID() for unique key generation */}
              <NavLink
                to={item.path} // The path of the link
                className="bg-[#353b45] w-full p-3 rounded-md flex gap-2 items-centre active:scale[0.98] hover:bg-[#2f343d] transition ease-in-out duration-500"
              >
                <div className="hover:text-pink-700 flex gap-4 transition ease-in-out duration-500">
                  {/* Render the icon and the text of the link */}
                  <span>{item.icon}</span>
                  {item.text} {/* Display the text */}
                </div>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Main content area */}
      <div className="w-full">
        <Outlet /> {/* The nested routes will be rendered here */}
      </div>
    </main>
  );
}
