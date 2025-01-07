import {
  ChartNoAxesColumnIncreasing,
  Cog,
  PersonStanding,
  ShoppingBasket,
} from "lucide-react";
import { NavLink, Outlet } from "react-router";
import { requireUser } from "~/supabase.server";
import type { Route } from "./+types/dashboard";

export async function loader({ request }: Route.LoaderArgs) {
  await requireUser(request);
  return null;
}

export default function Dashboard() {
  let dashboardLinks = [
    {
      text: "Dashboard",
      path: "/dashboard",
      icon: <ChartNoAxesColumnIncreasing />,
    },
    {
      path: "/dashboard/products",
      text: "Products",
      icon: <ShoppingBasket />,
    },
    {
      path: "/dashboard/customer",
      text: "Customer",
      icon: <PersonStanding />,
    },
    {
      path: "/dashboard/settings",
      text: "Settings",
      icon: <Cog />,
    },
  ];
  return (
    <main className="flex">
      {/* sidenavigation */}
      <nav className="w-96 bg-zinc-600 min-h-screen">
        <ul>
          {dashboardLinks.map((item) => (
            <li className="p-2" key={crypto.randomUUID()}>
              <NavLink
                to={item.path}
                className="bg-[#353b45] w-full p-3 rounded-md flex gap-2 items-centre active:scale[0.98] hover:bg-[#2f343d] transition ease-in-out duration-500"
              >
                <span>{item.icon}</span>
                {item.text}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* main content */}
      <div className="w-full">
        <Outlet />
      </div>
    </main>
  );
}
