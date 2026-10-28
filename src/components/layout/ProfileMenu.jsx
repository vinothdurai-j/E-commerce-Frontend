import { useRef, useState, useSyncExternalStore } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { User, Package, Heart, MapPin, KeyRound, LogOut } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { tokenStorage } from "@/utils/tokenStorage";
import useClickOutside from "@/hooks/useClickOutside";
import { notify } from "@/utils/toast";

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
  const queryClient = useQueryClient();
  useClickOutside(ref, () => setOpen(false));

  // Re-renders automatically on login, logout, or logout in another tab.
  // TODO: replace with useAuth() once AuthContext is ready.
  const token = useSyncExternalStore(
    tokenStorage.subscribe,
    tokenStorage.get,
    tokenStorage.get
  );
  const isLoggedIn = Boolean(token);

  // runs only after the user clicks "Confirm" in the toast
  const performLogout = () => {
    tokenStorage.clear(); // access token + refresh token + stored user
    queryClient.clear(); // drop all cached server data (cart, wishlist, orders)
    navigate(ROUTES.LOGIN, { replace: true }); // Back button can't return to protected pages
    notify.success("Logged out successfully");
  };

  const logout = () => {
    setOpen(false); // close the menu first
    notify.confirm("Are you sure you want to logout?", performLogout);
  };

  const item =
    "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-body hover:bg-stage hover:text-terracotta";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="Account"
        aria-expanded={open}
        aria-haspopup="menu"
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
              <button
                type="button"
                onClick={logout}
                className={`${item} mt-1 border-t border-line pt-3`}
              >
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