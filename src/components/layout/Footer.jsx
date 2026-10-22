import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

const columns = [
  {
    title: "Shop",
    items: [
      { label: "All Products", to: ROUTES.PRODUCTS },
      { label: "Wishlist", to: ROUTES.WISHLIST },
      { label: "Cart", to: ROUTES.CART },
    ],
  },
  {
    title: "Account",
    items: [
      { label: "Profile", to: ROUTES.PROFILE },
      { label: "My Orders", to: ROUTES.ORDERS },
      { label: "Login", to: ROUTES.LOGIN },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-stage">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-heading text-2xl font-semibold text-display">SHILOH</p>
          <p className="mt-3 max-w-sm text-sm text-body">
            Handcrafted footwear in earthy, timeless designs. Walk in comfort, every day.
          </p>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="font-body text-sm font-semibold uppercase tracking-wider text-display">
              {col.title}
            </h4>
            <ul className="mt-4 space-y-2">
              {col.items.map((i) => (
                <li key={i.label}>
                  <Link to={i.to} className="text-sm text-body hover:text-terracotta">
                    {i.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-line-card py-4 text-center text-xs text-body">
        © {new Date().getFullYear()} SHILOH. All rights reserved.
      </div>
    </footer>
  );
}