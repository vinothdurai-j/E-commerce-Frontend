import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Menu } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import SearchBar from "./SearchBar";
import DesktopNav from "./DesktopNav";
import ProfileMenu from "./ProfileMenu";
import MobileMenu from "./MobileMenu";

function IconLink({ to, label, count = 0, children }) {
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
  const [mobileOpen, setMobileOpen] = useState(false);

  // TODO: useCart() / useWishlist() ready aanadhum replace pannunga
  const cartCount = 0;
  const wishlistCount = 0;

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line bg-canvas/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
            className="rounded-full p-2 text-display lg:hidden"
          >
            <Menu size={22} />
          </button>

       

<div className="flex h-16 items-center border-r-3 border-white/80 border-line pr-8 mr-6">
  <Link
    to={ROUTES.HOME}
    className="font-heading text-2xl font-semibold text-display"
  >
    SHILOH
  </Link>
</div>


          <div className="hidden flex-1 md:mx-6 md:block lg:mx-12">
            <SearchBar />
          </div>


       
<div className="ml-auto flex h-16 items-center gap-1 border-l-3 border-white/80 border-line pl-6 md:ml-0">
  <IconLink to={ROUTES.WISHLIST} label="Wishlist" count={wishlistCount}>
    <Heart size={20} />
  </IconLink>

  <IconLink to={ROUTES.CART} label="Cart" count={cartCount}>
    <ShoppingBag size={20} />
  </IconLink>

  <ProfileMenu />
</div>

        </div>

        {/* Mobile search */}
        <div className="px-4 pb-3 md:hidden">
          <SearchBar />
        </div>

        {/* Desktop nav row */}
<div className="hidden border-t-2 border-white/100 lg:block">
  <DesktopNav />
</div>
      </header>

      {/* Header-ku veliya vekkanum: backdrop-blur kulla fixed drawer break aagum */}
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}