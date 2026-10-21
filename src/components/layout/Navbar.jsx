import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Search, Heart, ShoppingBag, User, Menu, X } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/utils/cn";

const links = [
  { label: "Home", to: ROUTES.HOME },
  { label: "Shop", to: ROUTES.PRODUCTS },
  { label: "Orders", to: ROUTES.ORDERS },
];

function IconLink({ to, label, count, children }) {
  return (
    <Link
      to={to}
      aria-label={label}
      className="relative rounded-full p-2 text-display transition-colors duration-200 hover:text-terracotta"
    >
      {children}
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-terracotta px-1 text-[10px] font-semibold text-inverse">
          {count}
        </span>
      )}
    </Link>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  // TODO: useCart() / useWishlist() hooks ready aanadhum replace pannunga
  const cartCount = 0;
  const wishlistCount = 0;

  const handleSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    navigate(`${ROUTES.PRODUCTS}?search=${encodeURIComponent(q)}`);
    setOpen(false);
  };

  const linkClass = ({ isActive }) =>
    cn(
      "text-sm font-medium transition-colors duration-200 hover:text-terracotta",
      isActive ? "text-terracotta" : "text-display"
    );

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6">
        {/* Logo */}
        <Link to={ROUTES.HOME} className="font-heading text-2xl font-semibold text-display">
          Hazy
        </Link>

        {/* Desktop links */}
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === ROUTES.HOME} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop search */}
        <form
          onSubmit={handleSearch}
          className="hidden max-w-xs flex-1 items-center gap-2 rounded-full border border-line-card bg-card px-4 py-2 lg:flex"
        >
          <Search size={16} className="text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search footwear..."
            className="w-full bg-transparent text-sm text-body outline-none placeholder:text-subtle"
          />
        </form>

        {/* Icons */}
        <div className="flex items-center gap-1">
          <IconLink to={ROUTES.WISHLIST} label="Wishlist" count={wishlistCount}>
            <Heart size={20} />
          </IconLink>
          <IconLink to={ROUTES.CART} label="Cart" count={cartCount}>
            <ShoppingBag size={20} />
          </IconLink>
          <IconLink to={ROUTES.PROFILE} label="Profile">
            <User size={20} />
          </IconLink>

          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="rounded-full p-2 text-display md:hidden"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-line bg-canvas px-4 pb-4 md:hidden">
          <form
            onSubmit={handleSearch}
            className="mt-3 flex items-center gap-2 rounded-full border border-line-card bg-card px-4 py-2"
          >
            <Search size={16} className="text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search footwear..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-subtle"
            />
          </form>
          <nav className="mt-3 flex flex-col gap-3">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === ROUTES.HOME}
                onClick={() => setOpen(false)}
                className={linkClass}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}