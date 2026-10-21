import { Navigate, Outlet, useLocation } from "react-router-dom";
import { tokenStorage } from "@/utils/tokenStorage";
import { ROUTES } from "@/constants/routes";

export default function ProtectedRoute() {
  const location = useLocation();
  // TODO: AuthContext ready aanadhum useAuth() use pannunga
  const isLoggedIn = Boolean(tokenStorage.get());

  if (!isLoggedIn) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }
  return <Outlet />;
}