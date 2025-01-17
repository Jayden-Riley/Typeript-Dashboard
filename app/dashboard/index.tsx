import type React from "react"; // Importing React type definitions for TypeScript
import { AiFillStar } from "react-icons/ai"; // Importing a star icon from react-icons for ratings
import { FiDollarSign, FiHeart, FiShare2 } from "react-icons/fi"; // Importing icons for currency, heart, and share

// Define the EarningsCardProps interface for type safety
interface EarningsCardProps {
  title: string; // Title of the card (e.g., Total Earnings, Profit)
  value: number; // Value to be displayed (e.g., 1000, 2434)
  currencySymbol: string; // Symbol of the currency (e.g., $, £)
  icon: React.ReactNode; // Icon to represent the data (e.g., heart, dollar sign)
}

export default function DashboardIndex() {
  return (
    <div className=" px-10  ">
      <h1 className="font-semibold text-2xl">Welcome back 😊...</h1>
      <div className="flex gap-4 items-center mt-5">
        {/* Render different EarningsCard components with various props */}
        <EarningsCard
          title="Total Earnings"
          value={1000}
          currencySymbol="£"
          icon={<FiHeart className="text-red-700" />} // Heart icon for earnings
        />
        <EarningsCard
          title="Share"
          value={2434}
          currencySymbol="" // No currency symbol for "Share"
          icon={<FiShare2 className="text-orange-600" />} // Share icon for sharing
        />
        <EarningsCard
          title="Profit"
          value={4500}
          currencySymbol="$"
          icon={<FiDollarSign className="text-green-500" />} // Dollar icon for profit
        />
        <EarningsCard
          title="Rating"
          value={9.8}
          currencySymbol="" // No currency symbol for rating
          icon={<AiFillStar className="text-yellow-400" />} // Star icon for ratings
        />
      </div>
    </div>
  );
}

// EarningsCard component for displaying individual data cards
let EarningsCard: React.FC<EarningsCardProps> = ({
  title, // Title of the card
  value, // The numeric value to display
  currencySymbol, // The currency symbol (if applicable)
  icon, // The icon associated with the card
}) => {
  return (
    <div className="w-full max-w-sm p-4 rounded-lg shadow-md bg-white hover:bg-blue-700 transition ease-in-out duration-500 text-black hover:text-white">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold">{title}</h3> {/* Card title */}
        <p className="text-white " aria-label="Info">
          {" "}
          {/* Icon with aria-label for accessibility */}
          {icon}
        </p>
      </div>
      <div className="mt-4">
        <h2 className="text-3xl font-bold flex items-center">
          <div className="">
            {currencySymbol} <span>{value}</span>{" "}
            {/* Display value with currency symbol */}
          </div>
        </h2>
      </div>
    </div>
  );
};

// The EarningsCard component is not exported here because it's already being used in the parent component (DashboardIndex)
// If you want to export it, you can uncomment the line below:
// export default EarningsCard;
