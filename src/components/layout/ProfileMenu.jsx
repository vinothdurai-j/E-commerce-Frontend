import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Package, Heart, MapPin, KeyRound, LogOut } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { tokenStorage } from "@/utils/tokenStorage";
import useClickOutside from "@/hooks/useClickOutside";

const items = [
  { label: "My Profile", to: ROUTES.PROFILE, icon: User },
  { label: "My Orders", to: ROUTES.ORDERS, icon: Package },
  { label: "Wishlist", to: ROUTES.WISHLIST, icon: Heart },
  { label: "Saved Addresses", to: `${ROUTES.PROFILE}?tab=addresses`, icon: MapPin },
  { label: "Change Password", to: `${ROUTES.PROFILE}?tab=password`, icon: KeyRound },
];

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();
  useClickOutside(ref, () => setOpen(false));

  // TODO: AuthContext ready aanadhum useAuth() use pannunga
  const isLoggedIn = Boolean(tokenStorage.get());

  const logout = () => {
    tokenStorage.clear();
    setOpen(false);
    navigate(ROUTES.LOGIN);
  };

  const item =
    "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-body hover:bg-stage hover:text-terracotta";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="Account"
        onClick={() => setOpen((v) => !v)}
        className="rounded-full p-2 text-display transition-colors duration-200 hover:text-terracotta"
      >
        <User size={20} />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-line bg-card p-2 shadow-soft">
          {isLoggedIn ? (
            <>
              {items.map(({ label, to, icon: Icon }) => (
                <Link key={label} to={to} onClick={() => setOpen(false)} className={item}>
                  <Icon size={16} /> {label}
                </Link>
              ))}
              <button onClick={logout} className={`${item} mt-1 border-t border-line pt-3`}>
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to={ROUTES.LOGIN} onClick={() => setOpen(false)} className={item}>
                Login
              </Link>
              <Link to={ROUTES.REGISTER} onClick={() => setOpen(false)} className={item}>
                Create account
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}